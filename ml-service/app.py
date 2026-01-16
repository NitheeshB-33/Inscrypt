# ml-service/app.py
from flask import Flask, request, jsonify
from transformers import pipeline
import datetime
import logging
import os


# Toxicity / moderation model
toxicity_model = pipeline(
    "text-classification",
    model="unitary/toxic-bert",
    top_k=1
)

def contains_violence_threat(text: str):
    keywords = [
        "attack", "kill", "hurt", "beat", "stab",
        "shoot", "bomb", "destroy", "assault"
    ]
    lower = text.lower()
    return any(word in lower for word in keywords)



app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Force CPU
SENTIMENT_DEVICE = -1
EMOTION_DEVICE = -1
ZEROSHOT_DEVICE = -1

logger.info("Loading models (this may take a minute the first time)...")

# Load pipelines (these will download models if needed)
sentiment_model = pipeline("sentiment-analysis", device=SENTIMENT_DEVICE)
emotion_model = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=5, device=EMOTION_DEVICE)
zero_shot_model = pipeline("zero-shot-classification", model="facebook/bart-large-mnli", device=ZEROSHOT_DEVICE)

CATEGORY_LABELS = ["Relationship", "Career", "Education", "Family", "Personal choices"]

logger.info("Models loaded.")


def normalize_sentiment(raw_label: str, score: float):
    raw = (raw_label or "").upper()
    if raw == "POSITIVE":
        base = float(score)
    else:
        base = -float(score)
    if base >= 0.3:
        label = "Positive"
    elif base <= -0.3:
        label = "Negative"
    else:
        label = "Neutral"
    return base, label


def map_emotion(raw_label: str):
    raw = (raw_label or "").lower()
    if "sad" in raw:
        return "Sadness"
    if "fear" in raw or "anx" in raw:
        return "Fear"
    if "anger" in raw or "angry" in raw:
        return "Anger"
    if "disgust" in raw or "guilt" in raw or "shame" in raw:
        return "Guilt"
    if "joy" in raw or "love" in raw or "optim" in raw or "hope" in raw:
        return "Hope"
    if "neutral" in raw:
        return "Stress"
    return "Unknown"


def classify_category(text: str):
    res = zero_shot_model(text, CATEGORY_LABELS)
    # HuggingFace returns a dict with 'labels' list; fallback defensively
    if isinstance(res, dict) and "labels" in res and len(res["labels"]) > 0:
        return res["labels"][0]
    # fallback
    return "Personal choices"


def _extract_first_dict(o):
    """
    Given pipeline output that may be a dict, list-of-dicts, or nested lists,
    return the first dict-like object found, or empty dict.
    """
    if isinstance(o, dict):
        return o
    if isinstance(o, list):
        stack = list(o)
        while stack:
            item = stack.pop(0)
            if isinstance(item, dict):
                return item
            if isinstance(item, list):
                # prepend nested list items so order remains
                stack = list(item) + stack
        return {}
    return {}


def check_toxicity(text: str):
    """
    Returns:
      safe (bool)
      toxicityScore (float)
      toxicityType (str or None)
    """
    out = toxicity_model(text)
    item = _extract_first_dict(out)

    label = (item.get("label") or "").lower()
    score = float(item.get("score", 0.0))

    # toxic-bert labels: 'toxic' / 'non-toxic'
    if label == "toxic" and score >= 0.85:
        return False, score, "Toxic or abusive content"

    return True, score, None



# @app.route("/analyze", methods=["POST"])
# def analyze():
#     payload = request.get_json() or {}
#     text = payload.get("text", "")
#     if not text or not isinstance(text, str) or not text.strip():
#         return jsonify({"error": "Text is required"}), 400

#     try:

#         safe, tox_score, tox_reason = check_toxicity(text)

# # 🚨 EXTRA VIOLENCE CHECK (IMPORTANT)
#         if safe and contains_violence_threat(text):
#             return jsonify({
#         "safe": False,
#         "toxicityScore": 0.9,
#         "toxicityType": "Violence or threat-related content",
#         "message": "Content violates safety guidelines"
#     })


#         if not safe:
#             logger.warning("Toxic content blocked. score=%.3f", tox_score)
#             return jsonify({
#                 "safe": False,
#                 "toxicityScore": tox_score,
#                 "toxicityType": tox_reason,
#                 "message": "Content violates safety guidelines"
#             })




#         # 1) Sentiment
#         s_out = sentiment_model(text)
#         # sentiment_model usually returns a list like [{'label':'POSITIVE','score':...}]
#         s_item = _extract_first_dict(s_out)
#         raw_sent_label = s_item.get("label", "NEUTRAL")
#         raw_sent_score = float(s_item.get("score", 0.0))
#         sentiment_score, sentiment_label = normalize_sentiment(raw_sent_label, raw_sent_score)

#         # 2) Emotion (defensive)
#         e_out = emotion_model(text)  # top_k=5 so likely a list of dicts or nested
#         e_item = _extract_first_dict(e_out)
#         raw_emotion_label = e_item.get("label", "neutral")
#         emotion_label = map_emotion(raw_emotion_label)

#         # 3) Category (zero-shot)
#         category = classify_category(text)

#         result = {
#             "safe": True,   # ✅ ADD THIS
#             "sentimentScore": float(sentiment_score),
#             "sentimentLabel": sentiment_label,
#             "emotionLabel": emotion_label,
#             "category": category,
#             "analyzedAt": datetime.datetime.utcnow().isoformat() + "Z"
#         }

#         # Log minimal info for debugging
#         logger.info("Analyzed text. sentiment=%s score=%.3f emotion=%s category=%s",
#                     sentiment_label, sentiment_score, emotion_label, category)

#         return jsonify(result)

#     except Exception as exc:
#         logger.exception("Error while analyzing")
#         return jsonify({
#             "safe": True,
#             "sentimentScore": 0.0,
#             "sentimentLabel": "Neutral",
#             "emotionLabel": "Unknown",
#             "category": "Personal choices",
#             "analyzedAt": datetime.datetime.utcnow().isoformat() + "Z",
#             "error": str(exc)
#         }), 500


@app.route("/analyze", methods=["POST"])
def analyze():
    payload = request.get_json() or {}
    text = payload.get("text", "")

    if not text or not isinstance(text, str) or not text.strip():
        return jsonify({"safe": False, "message": "Text is required"}), 400

    # 🚨 GATE 1: VIOLENCE / THREAT CHECK (FIRST)
    if contains_violence_threat(text):
        return jsonify({
            "safe": False,
            "toxicityScore": 0.9,
            "toxicityType": "Violence or threat-related content",
            "message": "Content violates safety guidelines"
        })

    # 🚨 GATE 2: TOXIC LANGUAGE CHECK
    safe, tox_score, tox_reason = check_toxicity(text)
    if not safe:
        return jsonify({
            "safe": False,
            "toxicityScore": tox_score,
            "toxicityType": tox_reason,
            "message": "Content violates safety guidelines"
        })

    try:
        # ✅ ONLY SAFE CONTENT REACHES HERE

        s_out = sentiment_model(text)
        s_item = _extract_first_dict(s_out)
        raw_sent_label = s_item.get("label", "NEUTRAL")
        raw_sent_score = float(s_item.get("score", 0.0))
        sentiment_score, sentiment_label = normalize_sentiment(
            raw_sent_label, raw_sent_score
        )

        e_out = emotion_model(text)
        e_item = _extract_first_dict(e_out)
        raw_emotion_label = e_item.get("label", "neutral")
        emotion_label = map_emotion(raw_emotion_label)

        category = classify_category(text)

        return jsonify({
            "safe": True,
            "sentimentScore": float(sentiment_score),
            "sentimentLabel": sentiment_label,
            "emotionLabel": emotion_label,
            "category": category,
            "analyzedAt": datetime.datetime.utcnow().isoformat() + "Z"
        })

    except Exception as exc:
        logger.exception("Error while analyzing")
        return jsonify({
            "safe": True,
            "sentimentScore": 0.0,
            "sentimentLabel": "Neutral",
            "emotionLabel": "Unknown",
            "category": "Personal choices",
            "analyzedAt": datetime.datetime.utcnow().isoformat() + "Z",
            "error": str(exc)
        }), 500




if __name__ == "__main__":
    # debug=False to avoid the interactive Werkzeug debugger popup
    app.run(host="127.0.0.1", port=5000, debug=False)









# cd ml-service
# venv\Scripts\activate.bat
# python app.py