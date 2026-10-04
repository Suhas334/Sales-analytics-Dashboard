# SalesFlow — Sales Analytics Dashboard

A full-stack web application for visualizing and analyzing sales data. Admins can upload CSV sales data, and all users can explore interactive charts, reports, and analytics.

**Live Demo:** [https://sales-analytics-dashboard-tlwa.onrender.com](https://sales-analytics-dashboard-tlwa.onrender.com)

---

## Features

- **Authentication** — Register, login, forgot/reset password via email
- **Role-based access** — Admin and Sales Manager roles with different permissions
- **Dashboard** — Key KPIs: total revenue, orders, top products, regional breakdown
- **Analysis** — Interactive charts (bar, line, pie) powered by Chart.js and Recharts
- **Reports** — Filterable, paginated sales table with CSV export
- **Upload** — Admin-only CSV upload with history and delete controls
- **Profile** — View and edit user profile details

---

## Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Chart.js + Recharts | Data visualizations |
| Framer Motion | Animations |
| Lucide React | Icons |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| PostgreSQL + pg | Database |
| bcryptjs | Password hashing |
| JSON Web Tokens | Authentication |
| Multer | CSV file uploads |
| Nodemailer / Brevo | Password reset emails |

---

## Project Structure

```
Sales-analytics-Dashboard/
├── backend/
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── authController.js   # Register, login, password reset
│   │   └── salesController.js  # Upload, stats, analysis, reports
│   ├── database/
│   │   └── schema.sql          # Table definitions
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── roleMiddleware.js   # Role-based access control
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── salesRoutes.js
│   ├── utils/
│   │   └── emailService.js     # Password reset email sender
│   └── server.js               # Express app entry point
│
└── frontend/
    └── src/
        ├── components/         # Navbar, Sidebar, ProtectedRoute, ErrorBoundary
        ├── context/
        │   └── AuthContext.jsx # Global auth state + axios base URL
        ├── layout/             # MainLayout, AuthLayout
        └── pages/              # Dashboard, Analysis, Reports, Upload, Profile, Login, Register
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Create a new account |
| POST | `/login` | Public | Login and receive JWT |
| POST | `/forgotpassword` | Public | Send password reset email |
| PUT | `/resetpassword/:token` | Public | Reset password with token |
| PUT | `/profile` | Protected | Update name/email |

### Sales — `/api/sales`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/upload` | Admin | Upload CSV sales file |
| GET | `/uploads` | Admin | Get upload history |
| DELETE | `/uploads/:id` | Admin | Delete an upload |
| DELETE | `/clear` | Admin | Clear all sales data |
| GET | `/stats` | Protected | Dashboard KPI stats |
| GET | `/analysis` | Protected | Chart data |
| GET | `/filters` | Protected | Filter options |
| GET | `/` | Protected | Paginated sales records |
| POST | `/download` | Protected | Track CSV export |

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repository
```bash
git clone https://github.com/Suhas334/Sales-analytics-Dashboard.git
cd Sales-analytics-Dashboard
```

### 2. Setup the backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=salesdashboard
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
```

### 3. Setup the frontend
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:
```env
# Leave empty for local dev (Vite proxy handles /api/* calls)
# Set this only for production pointing to your deployed backend
VITE_API_URL=
```

### 4. Run both servers

Backend (runs on port 5000):
```bash
cd backend
npm run dev
```

Frontend (runs on port 5173):
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment

### Backend — Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set **Root Directory** to `backend`
3. Set **Build Command** to `npm install`, **Start Command** to `node server.js`
4. Add environment variables:
   - `DATABASE_URL` — from your Render PostgreSQL service (Internal URL)
   - `JWT_SECRET` — any strong random string
   - `NODE_ENV` — `production`

### Frontend — Vercel
1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `VITE_API_URL` — your Render backend URL (e.g. `https://your-app.onrender.com`)
4. Deploy

---

## Roles

| Role | Permissions |
|------|-------------|
| `admin` | Full access — upload CSV, delete data, view all pages |
| `salesmanager` | View dashboard, analysis, reports, profile |

---

## CSV Upload Format

The uploaded CSV file should have these columns:

```
date, product, category, region, quantity, price
```

Example:
```csv
date,product,category,region,quantity,price
2024-01-15,Laptop Pro,Electronics,North,5,1200.00
2024-01-16,Wireless Mouse,Accessories,South,20,25.99
```

---

## License

MIT
