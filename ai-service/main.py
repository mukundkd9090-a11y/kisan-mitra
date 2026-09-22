"""
FastAPI Microservice for KisanMitra
Exposes ETA forecasting, delay probability, and Mandi time-series metrics.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from predictor import predict_queue_waiting_time, get_hourly_mandi_trend()

app = FastAPI(
    title="KisanMitra AI Prediction Service",
    description="Mandi Queue Wait Time & Delay Prediction API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueuePredictionRequest(BaseModel):
    queue_position: int = Field(..., ge=0, description="Current position in Mandi queue")
    crop_type: str = Field(default="Wheat", description="Type of crop being procured")
    quantity_quintals: Optional[float] = Field(default=25.0, ge=1.0, description="Approximate quantity in quintals")
    active_counters: Optional[int] = Field(default=3, ge=1, description="Active inspection/weighing booths")
    weather_condition: Optional[str] = Field(default="Clear", description="Weather status: Clear, Cloudy, Rain")
    historical_avg_mins: Optional[float] = Field(default=8.5, description="Historical average processing time")

class DelayPredictionRequest(BaseModel):
    crop_type: str
    centre_id: Optional[str] = None
    truck_count: int = 15
    staff_count: int = 4
    weather_condition: Optional[str] = "Clear"

@app.get("/")
def health_check():
    return {
        "service": "KisanMitra AI Prediction Microservice",
        "status": "HEALTHY",
        "version": "1.0.0",
        "description": "KisanMitra - Farmer Queue & Status Intelligence"
    }

@app.post("/predict-wait-time")
def predict_wait(req: QueuePredictionRequest):
    try:
        result = predict_queue_waiting_time(
            queue_position=req.queue_position,
            crop_type=req.crop_type,
            quantity_quintals=req.quantity_quintals or 25.0,
            active_counters=req.active_counters or 3,
            weather_condition=req.weather_condition or "Clear",
            historical_avg_mins=req.historical_avg_mins or 8.5
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-delay")
def predict_delay(req: DelayPredictionRequest):
    # Determine bottleneck risk score (0 - 100)
    risk_score = 15
    reasons = []
    
    if req.truck_count > 25:
        risk_score += 35
        reasons.append("High truck arrival density at gate")
    if req.staff_count < 3:
        risk_score += 30
        reasons.append("Limited active inspection staff")
    if req.weather_condition.lower() in ["rain", "storm"]:
        risk_score += 25
        reasons.append("Moisture sensitivity & wet unloading slowdown")

    severity = "LOW" if risk_score < 40 else ("MODERATE" if risk_score < 70 else "HIGH")

    return {
        "status": "success",
        "crop_type": req.crop_type,
        "delay_risk_score": min(100, risk_score),
        "severity": severity,
        "contributing_factors": reasons if reasons else ["Smooth normal flow"],
        "recommended_action": "Operate secondary moisture testing bench" if risk_score >= 50 else "Maintain current schedule"
    }

@app.get("/historical-stats")
def historical_stats():
    return {
        "status": "success",
        "trend_data": get_hourly_mandi_trend()()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
