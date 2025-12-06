from fastapi import FastAPI
from ai_app.routes import predict

app = FastAPI(title="Ranger-Med-Core AI Service")

app.include_router(predict.router, prefix="/api/ai")

@app.get("/")
async def root():
    return {"ok": True, "service": "ai-service", "status": "ready"}
