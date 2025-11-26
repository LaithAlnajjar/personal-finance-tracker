# Personal Finance & ML Tracker

This is a full-stack financial management platform designed to track expenses, visualize spending habits, and leverage machine learning for auto-categorization and future spending predictions.

- A **backend API** (Node.js, Express, PostgreSQL)
- A **frontend dashboard** (React, Tailwind, TypeScript)
- A **machine learning service** (Python, FastAPI)

## 🚀 Features

### Backend (API)

- Authentication (JWT & bcrypt)
- Expense CRUD (Create, Read, Update, Delete)
- Bulk CSV Import & Parsing
- Custom transaction categorization logic
- Secure database management with Prisma ORM

### Frontend (Dashboard)

- Interactive Dashboard with financial overviews
- Data visualization (Spending trends & Category breakdowns)
- Secure Login & Signup flows

### ML Service (Python)

- **Auto-Categorization:** Predicts categories based on merchant names using text classification.
- **Anomaly Detection:** Flags unusual spending behaviors.
- **Forecasting:** Time-series analysis to predict future monthly spending.

### 🚧 Features To Be Added

- [ ] Auto-Categorization: Predicts categories based on merchant names using text classification
- [ ] Anomaly Detection: Flags unusual spending behaviors.
- [ ] Forecasting: Time-series analysis to predict future monthly spending.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **ML Service:** Python, FastAPI, Pandas, Scikit-learn, Uvicorn
- **Authentication:** JWT, bcrypt
- **Deployment:** Vercel (Client), Railway/Render (Server & ML)

---
