from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class Transaction(BaseModel):
    id: str
    amount: float
    date: str
    merchant: str
    category: Optional[str] = None

class TransactionList(BaseModel):
    transactions: List[Transaction]

class TransacationCategoryRequirements(BaseModel):
    title: str
    merchant: str


@app.get("/")
def health_check():
    return {"status": "ML Service is running"}

@app.post("/predict")
def predict_next_month(data: TransactionList):
    """
    STUB: Forecasts total spending for the next month.
    Input: A history of transactions.
    Output: A single float value.
    """
    # TODO: Implement Prophet or ARIMA logic here
    
    # Mock Response:
    return {
        "forecast_amount": 1450.00, 
        "confidence_score": 0.85
    }

@app.post("/anomalies")
def detect_anomalies(data: TransactionList):
    """
    STUB: Detects unusual transactions (e.g. spikes in spending).
    Input: A list of transactions.
    Output: A list of transaction IDs that are suspicious.
    """
    # TODO: Implement Isolation Forest logic here
    
    # Mock Response:
    # We return specific IDs (assuming Node sends IDs). 
    # If the input list is empty, return empty.
    if not data.transactions:
        return {"anomalies": []}
        
    # Just for testing, let's pretend the first transaction sent is always an anomaly
    fake_anomaly_id = data.transactions[0].id
    
    return {
        "anomalies": [fake_anomaly_id],
        "reason": "Unusually high amount for this merchant"
    }

@app.post("/insights")
def generate_insights(data: TransactionList):
    """
    STUB: Generates text-based financial advice.
    Input: A list of transactions.
    Output: A list of strings.
    """
    # TODO: Implement rule-based analysis or LLM calls here
    
    # Mock Response:
    return {
        "insights": [
            "You spent 20% more on Dining this month compared to last month.",
            "Your highest spending day is usually Friday.",
            "You are on track to save $200 if you maintain this rate."
        ]
    }

@app.post("/categorize")
def generate_insights(data: TransacationCategoryRequirements):
    """
    STUB: Categorizes each transaction.
    Input: An expense.
    Output: A category.
    """
    # TODO: Implement model or LLM calls here
    
    # Mock Response:
    return {
        "category": "errorCategory"
    }