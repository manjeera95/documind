# DocuMind

An AI-powered document intelligence platform built with FastAPI, PostgreSQL, and Ollama. Users can upload PDF documents, perform semantic search, and ask questions using Retrieval-Augmented Generation (RAG).

---

## Features

- JWT Authentication
- PDF Upload
- PDF Text Extraction
- Intelligent Document Chunking
- Sentence Transformer Embeddings
- Semantic Search
- Retrieval-Augmented Generation (RAG)
- Multi-Document Chat
- Conversation Memory
- Source Citations
- PostgreSQL Database
- REST API with Swagger UI

---

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic

### AI
- Ollama
- Llama 3.2
- Sentence Transformers

### Authentication
- JWT

### PDF Processing
- PyMuPDF

---

## Architecture

```
User
   │
   ▼
FastAPI
   │
JWT Authentication
   │
PDF Upload
   │
PDF Text Extraction
   │
Chunking
   │
Embedding Generation
   │
Semantic Search (RAG)
   │
Ollama (Llama 3.2)
   │
Answer + Source Citations
```

---

## Project Structure

```
app/
├── ai/
├── api/
├── auth/
├── core/
├── db/
├── models/
├── repositories/
├── schemas/
├── services/
└── utils/

alembic/
uploads/
```

---

## API Endpoints

### Users
- POST `/users/register`
- POST `/users/login`
- GET `/users/me`

### Documents
- POST `/documents/upload`
- GET `/documents`

### Chat
- POST `/chat`

### Search
- POST `/search`

---

## Installation

```bash
git clone <repository-url>

cd documind

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Open:

```
http://127.0.0.1:8000/docs
```

---

## Current Status

✅ Backend completed

### Next Improvements

- React Frontend
- Docker Support
- Cloud Deployment
- pgvector Integration
- Streaming Responses

---

## License

This project was built for learning and portfolio purposes.