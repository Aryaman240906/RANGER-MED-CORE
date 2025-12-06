from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from ai_app.services import predictor, explainability
from ai_app.utils import simulator

router = APIRouter()

class PredictRequest(BaseModel):
    user_id: Optional[str]
    last_dose_missed: Optional[bool] = False
    hours_since_last_dose: Optional[float] = 0.0
    symptom_severity: Optional[float] = 0.0
    missions_last_24h: Optional[int] = 0

@router.post("/predict/light")
async def predict_light(req: PredictRequest):
    features = req.dict()
    result = predictor.light_predict(features)
    return {"ok": True, "data": result}

@router.post("/predict/full")
async def predict_full(req: PredictRequest, background_tasks: BackgroundTasks):
    features = req.dict()
    # We simulate a background worker but also return a synchronous response after simulated work.
    # For later queue integration, this endpoint can return a job_id.
    def work_and_store():
        simulator.simulate_heavy_work(seconds=2.5)
        # In a real setup: compute and persist to DB / push to queue / notify via websocket
        full = predictor.full_predict(features)
        # here we'd save or push
        return full

    # For now run the heavy work synchronously but called via background to emulate async
    background_tasks.add_task(work_and_store)
    # Return immediate acknowledgement + quick shallow result
    shallow = predictor.light_predict(features)
    return {"ok": True, "status": "accepted", "data_preview": shallow, "message": "Full compute started in background (simulated)"}
