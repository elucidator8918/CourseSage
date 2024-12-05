# CurateSage - Personalized Course Recommendation System
Currently, there is no easy way for a student to figure out what specific courses to take and the degree to choose that aligns with his/her strengths and interests. The process of picking academic courses is often laborious, time-consuming, and requires a lot of independent research by the student.

CurateSage is an innovative solution that leverages cutting-edge machine-learning techniques to make course recommendations. At its core, the system employs a sophisticated recommendation engine powered by Heterogeneous Graph Neural Networks (GNN). These advanced algorithms analyze student's academic history, interests, and career goals to generate highly personalized course suggestions.

<img width="1071" alt="image" src="https://github.com/user-attachments/assets/d7f01bec-83c6-4c79-b3a4-aab38da0320a">

## Tech Stack

### ML and DL
- **Graph Neural Networks (GNNs)**: Built using PyTorch Geometric for modelling relationships in large heterogeneous graphs.
- **Sentence Transformers**: For converting text-based attributes into numerical features for context-aware processing.
- **Explainability Models**: Utilized GNNExplainer and CaptumExplainer to provide insights into model predictions.
<div align="center">
  <img width="672" alt="image" src="https://github.com/user-attachments/assets/01e229dd-a553-4276-9d06-676c0cc6dff7">
</div>

### Backend
- **Frameworks**: 
  - [FastAPI](https://fastapi.tiangolo.com/) : For building the backend APIs to serve the React Frontend.
  - [PyTorch Geometric](https://pytorch-geometric.readthedocs.io/) : For implementing GNN models.
  - [MongoDB](https://www.mongodb.com/) : Used to store user information for fast and scalable retrieval.

### Frontend
  - [ReactJS](https://reactjs.org/) : For creating an interactive and visually appealing user interface.

## Demo
### You can watch a demo of CurateSage in action here:  [Video Demo](https://drive.google.com/file/d/1QmuDSvuy-_2ORoHx-3P120T8Rullq1M-/view)

<img width="1509" alt="image" src="https://github.com/user-attachments/assets/266cdaa7-8680-4e80-b2f2-db305c7e656a">

<img width="1509" alt="image" src="https://github.com/user-attachments/assets/64b3505c-0c70-4371-806b-9315fb8215c0">

<img width="1509" alt="image" src="https://github.com/user-attachments/assets/91391562-bcf2-41b6-9bdd-0649f9d06f5d">

<img width="1509" alt="image" src="https://github.com/user-attachments/assets/45569ba0-8588-4583-a7c3-0da687dc0d57">
