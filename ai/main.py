from transformers import pipeline
sentiment_pipelione = pipeline("finiteautomata/bertweet-base-sentiment-analysis")
data = ["I love this", "I hate this"]
print(sentiment_pipelione(data))
