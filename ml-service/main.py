from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from typing import Optional

app = FastAPI(title="Sistema Agrícola - ML Service")

class PredictionRequest(BaseModel):
    plot_id: str
    temperature: float
    humidity: float
    rainfall: Optional[float] = None
    soil_moisture: Optional[float] = None

class PredictionResponse(BaseModel):
    plot_id: str
    prediction: float
    confidence: float

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Predict crop yield from environmental conditions."""
    try:
        temperature_score = np.clip(1.0 - abs(request.temperature - 24.0) / 22.0, 0.0, 1.0)
        humidity_score = np.clip(1.0 - abs(request.humidity - 65.0) / 40.0, 0.0, 1.0)
        rainfall_score = 0.75
        if request.rainfall is not None:
            rainfall_score = float(np.clip(1.0 - abs(request.rainfall - 35.0) / 60.0, 0.0, 1.0))

        soil_moisture_score = 0.75
        if request.soil_moisture is not None:
            soil_moisture_score = float(np.clip(request.soil_moisture / 100.0, 0.0, 1.0))

        weighted_score = (
            temperature_score * 0.35
            + humidity_score * 0.25
            + rainfall_score * 0.20
            + soil_moisture_score * 0.20
        )

        prediction = float(np.clip(weighted_score * 100.0, 0.0, 100.0))
        confidence = float(np.clip(0.55 + weighted_score * 0.4, 0.55, 0.95))

        return PredictionResponse(
            plot_id=request.plot_id,
            prediction=prediction,
            confidence=confidence,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
async def train_model(data: dict):
    """Accept a batch of training samples and report the size."""
    return {"status": "training", "samples": len(data.get("samples", []))}

@app.get("/model/info")
async def get_model_info():
    return {
        "version": "1.0",
        "type": "HeuristicScoringModel",
        "features": ["temperature", "humidity", "rainfall", "soil_moisture"],
        "last_trained": "2024-05-01",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
