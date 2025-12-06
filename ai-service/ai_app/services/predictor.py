# simple rule-based predictor (placeholder for proper ML)
from typing import Dict, Any
import math

def light_predict(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Very fast prediction: rules + logistic-like scoring.
    features may include:
      - last_dose_missed (bool)
      - hours_since_last_dose (float)
      - symptom_severity (0-10)
      - missions_last_24h (int)
    Returns risk (0-100) and confidence (0-100) and short explanation.
    """
    score = 0.0

    if features.get("last_dose_missed"):
        score += 30
    score += min(float(features.get("hours_since_last_dose", 0)) / 2.0, 20)  # hours -> risk
    score += min(float(features.get("symptom_severity", 0)) * 5.0, 30)
    score += min(int(features.get("missions_last_24h", 0)) * 8.0, 20)

    # normalize to 0-100
    risk = max(0.0, min(100.0, score))

    # confidence: higher when more features provided
    provided = sum(1 for k in ["last_dose_missed", "hours_since_last_dose", "symptom_severity", "missions_last_24h"] if k in features)
    confidence = 50 + provided * 12  # 1->62, 4->98
    confidence = max(40, min(99, confidence))

    # short reason
    reasons = []
    if features.get("last_dose_missed"):
        reasons.append("missed dose")
    h = float(features.get("hours_since_last_dose", 0))
    if h >= 8:
        reasons.append(f"{int(h)}h since last dose")
    s = float(features.get("symptom_severity", 0))
    if s >= 5:
        reasons.append("high symptom severity")
    m = int(features.get("missions_last_24h", 0))
    if m >= 1:
        reasons.append(f"{m} recent mission(s)")

    explanation = ", ".join(reasons) if reasons else "normal"
    return {
        "risk": round(risk, 1),
        "confidence": round(confidence, 1),
        "explanation": explanation,
        "model_version": "light-v0.1"
    }

def full_predict(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deeper prediction: returns same fields plus feature_importance and pseudo-calcs.
    This is simulated and slower (intentionally).
    """
    base = light_predict(features)
    # fake feature importance
    fi = {
        "last_dose_missed": 0.4 if features.get("last_dose_missed") else 0.05,
        "symptom_severity": 0.3,
        "hours_since_last_dose": 0.2,
        "missions_last_24h": 0.1
    }
    # pseudo advanced metric
    fatigue_score = min(100, base["risk"] * 0.7 + (features.get("missions_last_24h", 0) * 6))
    return {
        **base,
        "fatigue_score": round(fatigue_score, 1),
        "feature_importance": fi,
        "model_version": "full-v0.1"
    }
