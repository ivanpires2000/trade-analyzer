# backend/services/sentimentService.py
from textblob import TextBlob

def analyze_sentiment(text):
    analysis = TextBlob(text)
    return analysis.sentiment.polarity  # Retorna um valor entre -1 e 1
