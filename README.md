# AvatarSaaS

A premium, HeyGen-inspired AI Video Generation platform MVP. This project features a beautiful React (Vite + Tailwind CSS v4) frontend and a robust Django REST Framework backend with Celery asynchronous task queues.

## Architecture

*   **Frontend:** React, React Router, Tailwind CSS v4, Lucide React (icons), Axios.
*   **Backend:** Django, Django REST Framework, SQLite.
*   **Task Queue:** Celery with a zero-install SQLAlchemy (SQLite) broker for local Windows development.

## Getting Started

Follow these steps to run the project locally.

### 1. Run the Backend (Django)

Open a terminal in the root `avatar-saas` folder:

```bash
# Activate the virtual environment
.\venv\Scripts\activate

# Navigate to the backend directory
cd backend

# Start the Django development server
python manage.py runserver
```

### 2. Run the Background Queue (Celery)

Since AI generation takes time, jobs are pushed to a background queue. You must start the Celery worker to process these jobs.

Open a **new** terminal in the root `avatar-saas` folder:

```bash
# Activate the virtual environment
.\venv\Scripts\activate

# Navigate to the backend directory
cd backend

# Start the Celery worker (using 'solo' pool for Windows compatibility)
celery -A backend worker -l info --pool=solo
```

### 3. Run the Frontend (React)

Open a **new** terminal in the root `avatar-saas` folder:

```bash
# Navigate to the frontend directory
cd frontend

# Start the Vite development server
npm run dev
```

You can now open your browser to the URL provided by Vite (usually `http://localhost:5173`) and start using AvatarSaaS!

## Current MVP Features

*   **Premium UI:** Glassmorphism, sleek dark mode, interactive hover effects, and a dual-sidebar layout mimicking top-tier SaaS platforms.
*   **Mock GPU Services:** The AI generation endpoints (`LivePortrait`, `FLUX.1`, `XTTS-v2`) are currently mocked with `time.sleep()` delays in `backend/api/ai_services.py`. This allows you to test the asynchronous Celery architecture and UI flow without spending API credits. When ready for production, simply swap the sleep delays with actual HTTP `requests.post()` calls to RunPod.
*   **Zero-Install Message Broker:** Celery is configured to use a local `sqlite` database as its message queue (`sqla+sqlite:///celerydb.sqlite`). This eliminates the need to install and run Redis via Docker on Windows during local development.
