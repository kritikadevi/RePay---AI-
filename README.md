#  RePay 

> **Recover more. Lose less.**

RePay is an AI-powered payment recovery intelligence platform designed to help businesses analyze failed payments, estimate their recovery probability, prioritize recovery opportunities, and recommend the most effective recovery action.

Instead of treating every failed payment the same way, RePay uses Machine Learning and decision intelligence to answer:

> **Which failed payments are most likely to be recovered, what action should be taken, and where should recovery efforts be prioritized?**

---

# Live Demo

###  Frontend

https://repay-ai.onrender.com

###  Backend API

https://repay-4teu.onrender.com

###  API Documentation

https://repay-4teu.onrender.com/docs

---

#  Problem Statement

Failed payments are a major source of revenue loss for businesses.

Traditional recovery systems often rely on generic strategies such as:

- Retrying every failed transaction
- Sending the same reminder to every customer
- Treating all failed payments with equal priority
- Relying heavily on manual recovery decisions

This approach can result in:

- Wasted recovery efforts
- Poor prioritization
- Increased operational costs
- Missed revenue opportunities

The key question is not simply:

> **How do we recover every failed payment?**

Instead, businesses need to know:

> **Which payments are worth recovering?**

> **What recovery action has the highest probability of success?**

> **Which payments require immediate attention?**

RePay addresses this problem using Machine Learning and recovery decision intelligence.

---

#  Solution

RePay analyzes failed payment data and generates an intelligent recovery recommendation.

For every failed payment, the system:

1. Analyzes payment and customer-related features.
2. Predicts the probability of successful recovery.
3. Evaluates possible recovery actions.
4. Selects the best recovery action.
5. Assigns a priority level.
6. Generates a primary and fallback recovery strategy.
7. Estimates potential recoverable revenue.
8. Stores the payment and prediction data in MongoDB.
9. Displays recovery insights through an interactive dashboard.

This transforms the recovery workflow from:

```text
Failed Payment
      ↓
Manual Decision
      ↓
Generic Recovery Action
```

into:

```text
Failed Payment
      ↓
AI Analysis
      ↓
Recovery Probability
      ↓
Best Recovery Action
      ↓
Recovery Strategy
      ↓
Priority Assignment
      ↓
Revenue Recovery Opportunity
```

---

#  AI-Powered Decision Engine

The core of RePay is its prediction and decision intelligence layer.

The system analyzes multiple features associated with the failed payment and customer payment behavior.

| Feature | Description |
|---|---|
| **Payment Amount** | Value of the failed transaction |
| **Payment Method** | Card, UPI, Wallet, or Net Banking |
| **Failure Reason** | Reason behind the payment failure |
| **Previous Successful Payments** | Number of successful payments made previously |
| **Previous Failed Payments** | Historical payment failures |
| **Retry Count** | Number of previous recovery attempts |
| **Customer Success Rate** | Historical payment success rate |
| **Hour of Payment** | Time at which the transaction occurred |
| **Customer Tenure** | Duration of the customer's relationship with the platform |

These signals are processed by the Machine Learning model to estimate:

> **How likely is this failed payment to be successfully recovered?**

The prediction is then converted into actionable recovery intelligence.

---

#  Intelligent Recovery Strategy

RePay does not simply return a prediction.

It converts Machine Learning insights into an actionable recovery plan.

Example:

```text
Payment Failed
      │
      ▼
Recovery Probability: 87%
      │
      ▼
Priority: HIGH
      │
      ▼
Recommended Action
Retry Payment
      │
      ├── If unsuccessful
      │
      ▼
Fallback 1: Send Payment Reminder
      │
      ├── If unsuccessful
      │
      ▼
Fallback 2: Change Payment Method
```

This allows recovery teams to move from:

```text
Failed Payment
      ↓
Manual Decision
```

to:

```text
Failed Payment
      ↓
AI Analysis
      ↓
Recommended Action
      ↓
Recovery Strategy
```

---

# 📊 Dashboard Intelligence

The RePay dashboard provides a centralized overview of payment recovery opportunities.

### Key Metrics

- Total Failed Payments
- Revenue at Risk
- Recovered Payments
- Revenue Recovered
- Expected Recoverable Revenue
- High Priority Payments
- Average AI Recovery Confidence
- Recovery Pipeline Status

This helps businesses understand not only **what failed**, but also:

> **Where should recovery efforts be focused for maximum impact?**

---

#  Key Features

##  AI Recovery Prediction

Predicts the probability of successfully recovering a failed payment using a trained Machine Learning model.

---

##  Best Action Recommendation

Evaluates recovery options and recommends the most suitable action.

Examples include:

- Retry Payment
- Send Payment Reminder
- Change Payment Method
- Escalate for Manual Review

---

## Smart Priority Classification

Automatically classifies failed payments based on their recovery potential and business impact.

Priority levels include:

- 🔴 High
- 🟡 Medium
- 🟢 Low

---

##  Recovery Strategy Generation

RePay generates a recovery sequence consisting of:

- Primary recovery action
- Fallback recovery actions
- Recovery probabilities
- Step-by-step instructions

---

##  Revenue Opportunity Estimation

Estimates the amount of revenue that can potentially be recovered based on the payment amount and predicted recovery probability.

---

##  Recovery Analytics Dashboard

Provides a real-time overview of:

- Failed payments
- Revenue at risk
- Recovery opportunities
- Recovery confidence
- Priority payments
- Recovery pipeline status

---

##  Persistent Payment Tracking

Payment analysis, predictions, and recovery information are stored in MongoDB for persistent tracking and analytics.

---

#  System Architecture

```text
                           ┌──────────────────────┐
                           │                      │
                           │    React Frontend    │
                           │                      │
                           └──────────┬───────────┘
                                      │
                                   REST API
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │                      │
                           │   FastAPI Backend    │
                           │                      │
                           └──────────┬───────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼

            ┌───────────────┐ ┌────────────────┐ ┌───────────────┐
            │               │ │                │ │               │
            │   ML Model    │ │    Recovery    │ │    MongoDB    │
            │               │ │ Intelligence   │ │               │
            │ Scikit-learn  │ │     Engine     │ │               │
            │               │ │                │ │               │
            └───────────────┘ └────────────────┘ └───────────────┘
```

---

# Application Flow

```text
User enters failed payment details
                │
                ▼
        React Frontend
                │
                ▼
        FastAPI Backend
                │
                ▼
        ML Prediction Model
                │
                ▼
     Calculate Recovery Probability
                │
                ▼
     Evaluate Recovery Actions
                │
                ▼
      Select Best Recovery Action
                │
                ▼
       Generate Recovery Strategy
                │
                ▼
        Assign Priority Level
                │
                ▼
        Estimate Recovery Value
                │
                ▼
        Store Data in MongoDB
                │
                ▼
      Display Insights on Dashboard
```

---

#  Tech Stack

## Frontend

- React
- Vite
- React Router
- JavaScript
- CSS

## Backend

- FastAPI
- Python
- Uvicorn
- Pydantic

## Machine Learning

- Scikit-learn
- Pandas
- NumPy
- Joblib

## Database

- MongoDB

## Deployment

- Render

---

#  Project Structure

```text
RePay/
│
├── backend/
│   │
│   ├── app/
│   │   │
│   │   ├── controllers/
│   │   │   └── payment_controller.py
│   │   │
│   │   ├── models/
│   │   │   └── payment_model.py
│   │   │
│   │   ├── routes/
│   │   │   └── payment_router.py
│   │   │
│   │   └── services/
│   │       ├── payment_service.py
│   │       └── prediction_service.py
│   │
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PaymentForm.jsx
│   │   │   ├── PaymentTable.jsx
│   │   │   └── StatsCard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── payment_recovery_model.ipynb
├── payment_recovery_model.pkl
├── recoverai_payment_recovery_dataset.csv
│
├── tests/
│   └── test_app.py
│
├── .gitignore
└── README.md
```

---

#  Run Locally

## 1. Clone the Repository

```bash
git clone https://github.com/kritikadevi/RePay---AI-.git
cd RePay
```

---

# 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run the frontend:

```bash
npm run dev
```

The application will typically run at:

```text
http://localhost:5173
```

---

# 🔌 API Overview

## Analyze Failed Payment

```http
POST /predict
```

Example request:

```json
{
  "amount": 5000,
  "payment_method": "Card",
  "failure_reason": "Card Declined",
  "previous_successful_payments": 10,
  "previous_failed_payments": 1,
  "retry_count": 0,
  "customer_success_rate": 0.9,
  "hour_of_payment": 14,
  "customer_tenure_days": 500
}
```

The API returns recovery intelligence including:

- Recovery probability
- Recommended recovery action
- Priority level
- Expected recovery amount
- Recovery strategy
- Action probabilities
- AI reasoning

---

#  Deployment

RePay is deployed using Render.

### Frontend

https://repay-ai.onrender.com

### Backend

https://repay-4teu.onrender.com

### Interactive API Documentation

https://repay-4teu.onrender.com/docs

The frontend communicates with the backend using:

```env
VITE_API_URL=https://repay-4teu.onrender.com
```

---

#  Future Scope

RePay can evolve into a more autonomous payment recovery platform with:

- Automated retry scheduling
- Email recovery workflows
- SMS and WhatsApp reminders
- Payment gateway integration
- Dynamic recovery timing
- Customer segmentation
- Reinforcement learning for recovery strategies
- Explainable AI recommendations
- Real-time notifications
- Role-based access control
- Advanced recovery analytics
- Automated recovery workflows

---

#  Why RePay?

Traditional payment recovery systems are often reactive and rule-based.

RePay introduces an **AI-driven, decision-first approach**.

Instead of asking:

> **How do we recover every failed payment?**

RePay asks:

> **Which payments are worth recovering?**

> **What action should be taken?**

> **Which recovery strategy provides the highest probability of success?**

By combining Machine Learning, recovery intelligence, persistent payment tracking, and actionable workflows, RePay transforms failed payments from passive revenue loss into prioritized recovery opportunities.

---

#  Author

**Kritika Devi**

B.Tech — Information Technology  
National Institute of Technology Srinagar

---

