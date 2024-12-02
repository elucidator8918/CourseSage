from pydantic import BaseModel, Field
from fastapi import UploadFile
from typing import List


class User(BaseModel):
    first_name: str
    last_name: str
    username: str  # email id
    id_student: int or None = None
    password: str
    age: int
    gender: str
    courses_list: list[str] = []  # !
    highest_edu: str  # dropdown
    studied_credits: float  # !
    disability: int  # dropdown
    final_result: int  # dropdown
    region: str
    imd_band: str  # dropdown
    interests: str = ''  # !
    first_login: bool = True


class UserInDB(BaseModel):
    first_name: str
    last_name: str
    username: str
    id_student: int or None = None
    password: str = Field(..., alias="hashed_password")
    age: int
    gender: str
    courses_list: list[str] = []
    highest_edu: str
    studied_credits: float
    disability: int
    final_result: int
    region: str
    imd_band: str
    interests: str
    first_login: bool = True


class Login(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str or None = None


class StudentData(BaseModel):
    course_code: List[str]
    id_student: int
    highest_education: str
    studied_credits: float
    disability: int
    final_result: int
    region: str
    imd_band: str
    num_courses: int


class RecommendationRequest(BaseModel):
    recs: str


class statsRequest(BaseModel):
    code: str


class geminiRequest(BaseModel):
    input: str
