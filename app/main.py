from fastapi import FastAPI

from app.api.chat import router as chat_router
from app.api.documents import router as documents_router
from app.api.search import router as search_router
from app.api.users import router as users_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)

app.include_router(users_router)
app.include_router(documents_router)
app.include_router(search_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}"
    }