# small helper to convert feature_importance to readable list
def explain_feature_importance(fi: dict):
    items = sorted(fi.items(), key=lambda x: -x[1])
    return [{"feature": k, "importance": v} for k, v in items]
