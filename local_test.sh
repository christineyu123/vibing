#!/bin/bash
set -e

# Usage info
display_help() {
    echo "\nUsage: $0 [step]"
    echo "Steps:"
    echo "  backend_env     Setup backend venv and install requirements"
    echo "  frontend_env    Install frontend npm dependencies"
    echo "  erase_db        Remove backend/vibing.db (reset database)"
    echo "  launch_backend  Start backend Flask server"
    echo "  launch_frontend Start frontend React server"
    echo "  all             Do everything from scratch (default if no arg)"
    echo
}

# Step 1: Setup backend venv and install requirements
backend_env() {
    echo "[Backend] Setting up venv and installing requirements..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd - > /dev/null
}

# Step 2: Install frontend dependencies
frontend_env() {
    echo "[Frontend] Installing npm dependencies..."
    cd frontend
    npm install
    cd - > /dev/null
}

# Step 3: Erase database
erase_db() {
    echo "[Backend] Removing vibing.db..."
    rm -f backend/instance/vibing.db
}

# Step 4: Launch backend
launch_backend() {
    echo "[Backend] Launching Flask server..."
    cd backend
    source venv/bin/activate
    export FLASK_APP=app.py
    flask run
    cd - > /dev/null
}

# Step 5: Launch frontend
launch_frontend() {
    echo "[Frontend] Launching React server..."
    cd frontend
    npm start
    cd - > /dev/null
}

# Main logic
if [ "$1" == "backend_env" ]; then
    backend_env
elif [ "$1" == "frontend_env" ]; then
    frontend_env
elif [ "$1" == "erase_db" ]; then
    erase_db
elif [ "$1" == "launch_backend" ]; then
    launch_backend
elif [ "$1" == "launch_frontend" ]; then
    launch_frontend
else
    echo "[ALL] Full reset: backend env, frontend env, erase DB."
    backend_env
    frontend_env
    erase_db
    echo
    echo "[INFO] Setup complete!"
    echo "[INFO] Please open TWO new terminals and run the following commands in each:"
    echo
    echo "Terminal 1 (Backend):"
    echo "  ./local_test.sh launch_backend"
    echo
    echo "Terminal 2 (Frontend):"
    echo "  ./local_test.sh launch_frontend"
    echo
    echo "[INFO] Visit http://localhost:3000 in your browser."
fi 