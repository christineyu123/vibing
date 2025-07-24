# Vibing

## Local Development Setup

### 1. Backend (Flask)

```sh
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

- Create a `.env` file in `backend/` with:
  ```
  SECRET_KEY=supersecretkey
  JWT_SECRET_KEY=jwtsecretkey
  EMAIL_ADDRESS=your_gmail@gmail.com
  EMAIL_PASSWORD=your_gmail_app_password
  ```

- Run the backend:
  ```sh
  export FLASK_APP=app.py
  flask run
  ```
  (API at http://127.0.0.1:5000/)

### 2. Frontend (React)

```sh
cd frontend
npm install
npm start
```
(App at http://localhost:3000/)

---

## Testing & Resetting the App

- To test from scratch (reset all data):
  1. Stop the backend server (Ctrl+C).
  2. Delete the database file:
     ```sh
     rm backend/vibing.db
     ```
  3. Restart the backend:
     ```sh
     cd backend
     source venv/bin/activate
     flask run
     ```
  4. The app will start with a fresh database (no users or data).

- You can now register, login, and test all features as a new user.

---

## Local Testing Automation

You can use the `local_test.sh` script (in the project root) to automate local setup, reset, and launch for development and testing.

### Usage

```sh
./local_test.sh [step]
```

- If no argument is given, the script will:
  - Set up backend venv and install requirements
  - Install frontend npm dependencies
  - Erase the backend database
  - Launch backend and frontend servers

- You can also run individual steps:
  - `backend_env`     — Setup backend venv and install requirements
  - `frontend_env`    — Install frontend npm dependencies
  - `erase_db`        — Remove backend/vibing.db (reset database)
  - `launch_backend`  — Start backend Flask server
  - `launch_frontend` — Start frontend React server

Example: To just reset the database and relaunch backend:
```sh
./local_test.sh erase_db
./local_test.sh launch_backend
``` 