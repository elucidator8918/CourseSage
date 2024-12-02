from fastapi import Depends, FastAPI, HTTPException, status, Header, Body
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Annotated
from pymongo.errors import DuplicateKeyError

from concurrent.futures import ThreadPoolExecutor
from collections import Counter
from GoogleNews import GoogleNews

from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace

from pymongo import MongoClient

from schemas import User, Login, Token, UserInDB, TokenData, StudentData, RecommendationRequest, statsRequest, geminiRequest

import torch
from torch_geometric.nn import SAGEConv, to_hetero
from torch_geometric.data import HeteroData
from torch_geometric.transforms import ToUndirected
from torch.nn import Linear
import pandas as pd
from sentence_transformers import SentenceTransformer
import json

import google.generativeai as genai

SECRET_KEY = "c67d75893e1466b33475deac05f91f606bcd1b2fbfa569acb4afdbbc1f6599dc"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(title="CourseRec Back-End",)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = MongoClient(
    "mongodb+srv://Aj_3001:RacWMGQ6k9gLKP0g@cluster0.vflcwlu.mongodb.net")
db = conn.course_rec.course_rec


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(username: str):
    user_data = db.find_one({"username": username})
    if user_data:
        return UserInDB(**user_data)
    return None


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if user and verify_password(password, user.hashed_password):
        return user
    return None


def create_user(user: User):
    try:
        db.insert_one({
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "id_student": abs(hash(user.username)) % 2**12,
            "hashed_password": get_password_hash(user.password),
            "age": user.age,
            "gender": user.gender,
            "courses_list": user.courses_list,
            "highest_edu": user.highest_edu,
            "studied_credits": user.studied_credits,
            "disability": user.disability,
            "final_result": user.final_result,
            "region": user.region,
            "imd_band": user.imd_band,
            "interests": user.interests,
            "first_login": user.first_login,


        })
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )


def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=180)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

MODEL_PATH = "best-sageconv.pt"
graph_cluster = torch.load(MODEL_PATH)
course_map = graph_cluster['course_map']
user_map = graph_cluster['user_map']
data = graph_cluster['data']
courses_nodes = graph_cluster['courses']
device = 'cpu'

band_mapping = {
    '90-100%': "Experiencing extremely low levels of multiple deprivation.",
    '80-90%': "Encountering very low levels of multiple deprivation.",
    '70-80%': "Facing low to moderate levels of multiple deprivation.",
    '60-70%': "Navigating through moderate levels of multiple deprivation.",
    '50-60%': "Dealing with moderate to high levels of multiple deprivation.",
    '40-50%': "Confronting high to moderate levels of multiple deprivation.",
    '30-40%': "Coping with high levels of multiple deprivation.",
    '20-30%': "Encountering very high levels of multiple deprivation.",
    '10-20%': "Facing very high levels of multiple deprivation.",
    '0-10%': "Confronting extremely high levels of multiple deprivation.",
}


class SequenceEncoder(object):
    def __init__(self, model_name='all-MiniLM-L6-v2', device=None):
        self.device = device
        self.model = SentenceTransformer(model_name, device=device)

    @torch.no_grad()
    def __call__(self, df):
        return self.model.encode(df.values, show_progress_bar=True, convert_to_tensor=True, device=self.device).cpu()


class IdentityEncoder(object):
    def __init__(self, dtype=None):
        self.dtype = dtype

    def __call__(self, df):
        return torch.from_numpy(df.values).view(-1, 1).to(self.dtype)


def load_node_csv(path, index_col, encoders=None, **kwargs):
    df = pd.read_csv(path, index_col=index_col)
    mapping = {index: i for i, index in enumerate(df.index.unique())}
    x = None
    if encoders is not None:
        x = torch.cat([encoder(df[col])
                      for col, encoder in encoders.items()], dim=-1)
    return x, mapping


def load_edge_csv(path, src, srcmap, dst, dstmap, encoders=None, **kwargs):
    df = pd.read_csv(path)
    src = [srcmap[index] for index in df[src]]
    dst = [dstmap[index] for index in df[dst]]
    edge_index = torch.tensor([src, dst])
    edge_attr = None
    if encoders is not None:
        edge_attr = torch.cat([encoder(df[col])
                              for col, encoder in encoders.items()], dim=-1)
    return edge_index, edge_attr


class GNNEncoder(torch.nn.Module):
    def __init__(self, hidden_channels, out_channels):
        super().__init__()
        self.conv1 = SAGEConv((-1, -1), hidden_channels)
        self.conv2 = SAGEConv((-1, -1), out_channels)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        x = self.conv2(x, edge_index)
        return x


class EdgeDecoder(torch.nn.Module):
    def __init__(self, hidden_channels):
        super().__init__()
        self.lin1 = Linear(2 * hidden_channels, hidden_channels)
        self.lin2 = Linear(hidden_channels, 1)

    def forward(self, z_dict, edge_label_index):
        row, col = edge_label_index
        z = torch.cat([z_dict['student'][row], z_dict['course'][col]], dim=-1)

        z = self.lin1(z).relu()
        z = self.lin2(z)
        return z.view(-1)


class Model(torch.nn.Module):
    def __init__(self, hidden_channels):
        super().__init__()
        self.encoder = GNNEncoder(hidden_channels, hidden_channels)
        self.encoder = to_hetero(self.encoder, data.metadata(), aggr='sum')
        self.decoder = EdgeDecoder(hidden_channels)

    def forward(self, x_dict, edge_index_dict, edge_label_index):
        z_dict = self.encoder(x_dict, edge_index_dict)
        return self.decoder(z_dict, edge_label_index)


model = Model(hidden_channels=64).to(device)
model.load_state_dict(graph_cluster['state_dict'])
model.eval()


@app.get("/")
def read_root():
    print(db)
    return {"You're not": "supposed to be here"}


@app.post('/signup')
def signup(request: User):
    existing_user = db.find_one({"username": request.username})

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email ID has already registered",
        )

    hashed_pass = get_password_hash(request.password)
    user_object = {
        "first_name": request.first_name,
        "last_name": request.last_name,
        "username": request.username,
        "id_student": abs(hash(request.username)) % 2**12,
        "hashed_password": hashed_pass,
        "age": request.age,
        "gender": request.gender,
        "courses_list": request.courses_list,
        "highest_edu": request.highest_edu,
        "studied_credits": request.studied_credits,
        "disability": request.disability,
        "final_result": request.final_result,
        "region": request.region,
        "imd_band": request.imd_band,
        "interests": request.interests,
        "first_login": request.first_login
    }
    db.insert_one(user_object)
    return {"res": "User succesfully created"}


@app.post('/login')
def login(request: OAuth2PasswordRequestForm = Depends()):
    user = db.find_one({"username": request.username})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'No user found with this Email ID')
    if not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Wrong Email ID or password')
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer", "first_login": user["first_login"]}


@app.post('/updatelists')
async def updateLists(
    courses_list: list[str] = Body(...),
    studied_credits: float = Body(None),
    interests: str = Body(None),
    token: str = Header(...),
):
    current_user = await get_current_user(token)
    filter = {"username": current_user.username}
    newvalues = {
        "$set": {
            "courses_list": courses_list,
            "studied_credits": studied_credits,
            "interests": interests,
            "first_login": False,
        }
    }
    db.update_one(filter, newvalues)

    return {"message": "Lists updated successfully"}


@app.post('/getlists')
async def getLists(
    token: str = Header(...),
):
    current_user = await get_current_user(token)
    return {"courses_list": current_user.courses_list, "studied_credits": current_user.studied_credits, 'interests': current_user.interests}


@app.post("/recommend/")
async def rec(token: str = Header(...)):
    student_data = await get_current_user(token)
    don = len(student_data.courses_list)
    df = {
        "course_code": student_data.courses_list,
        "id_student": [student_data.id_student]*don,
        "highest_education": [student_data.highest_edu]*don,
        "studied_credits": [student_data.studied_credits]*don,
        "disability": [student_data.disability]*don,
        "final_result": [student_data.final_result]*don,
        "region":  [student_data.region]*don,
        "imd_band":  [student_data.imd_band]*don
    }
    df = pd.DataFrame(df)
    df['imd_band'] = df['imd_band'].replace(band_mapping)
    df['region_imd_band'] = df['region'] + '|' + df['imd_band']
    df = df.drop(columns=["region", "imd_band"]).reset_index(drop=True)
    try:
        existing_df = pd.read_csv('test.csv')
        df.to_csv('test.csv', mode='a', header=False, index=False)
    except FileNotFoundError:
        df.to_csv('test.csv', index=False)

    test_user_x, test_user_map = load_node_csv("test.csv", 'id_student',
                                               encoders={'region_imd_band': SequenceEncoder(), 'highest_education': SequenceEncoder()})

    test_edge_index, test_edge_label = load_edge_csv("test.csv", 'id_student', test_user_map, 'course_code', course_map,
                                                     encoders={'final_result': IdentityEncoder(dtype=torch.long)})

    test_data = HeteroData()
    test_data['student'].x = test_user_x
    test_data['course'].x = data['course'].x
    test_data['student', 'results', 'course'].edge_index = test_edge_index
    test_data['student', 'results', 'course'].edge_label = test_edge_label
    test_data = ToUndirected()(test_data)
    del test_data['course', 'rev_results', 'student'].edge_label
    test_data['course', 'prerequisite', 'course'].edge_index = data['course',
                                                                    'prerequisite', 'course'].edge_index
    already_seen_list = list()
    for i in student_data.courses_list:
        already_seen_list.append(course_map[i])
    real_user = test_user_map[student_data.id_student]
    len_courses = len(test_data['course'].x)
    row = torch.tensor([real_user] * len_courses)
    col = torch.arange(len_courses)
    edge_label_index = torch.stack([row, col], dim=0)
    pred = model(test_data.x_dict, test_data.edge_index_dict,
                 edge_label_index).clamp(min=-1, max=2)
    for i in already_seen_list:
        pred[i] = 0
    idx_max = torch.topk(pred, 5).indices
    response = []
    for k, i in enumerate(idx_max):

        # response.append({
        #     "course_title": courses_nodes.loc[int(i)]["course_title"],
        #     "course_code": courses_nodes.loc[int(i)]["course_code"],
        #     "reviews": courses_nodes.loc[int(i)]["reviews"].split('\n')[:3],
        #     "useful": courses_nodes.loc[int(i)]["useful"],
        #     "easy": courses_nodes.loc[int(i)]["easy"],
        #     "liked": courses_nodes.loc[int(i)]["liked"],
        # })
        response.append(courses_nodes.loc[int(i)]["course_code"])

    return {"recommendations": response}


@app.post("/stats/")
async def stats(request: statsRequest):
    selected_rows = json.loads(
        courses_nodes[courses_nodes.course_code == request.code].to_json(orient='records'))[0]
    selected_rows["reviews"] = selected_rows["reviews"].split('\n')[:1]
    return selected_rows

genai.configure(api_key="Gemini Key Here")
gemini_model = genai.GenerativeModel('gemini-pro')


@app.post("/gemini")
async def chat(request: geminiRequest):
    
    response = gemini_model.generate_content(
        f"Respond in max 128 words. Hello! 👋 I'm your friendly student course recommender. How can I assist you today with your course selection? Please provide me with some information, such as your interests, preferred subjects, or any specific requirements. I'm here to help! 😊\n\nUser Input: {request.input}"
    )
    return {"text": response.text}
