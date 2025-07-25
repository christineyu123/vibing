#!/bin/bash
set -e

# Create a Docker network for communication
docker network create vibing-net || true

# Stop any existing containers with the same names
docker stop vibing-backend-new-ui vibing-frontend-new-ui 2>/dev/null || true

# Run backend container with new UI tag
docker run -d --rm \
  --name vibing-backend-new-ui \
  --network vibing-net \
  -p 5000:5000 \
  vibing-backend:latest-new-ui

# Run frontend container with new UI tag
docker run -d --rm \
  --name vibing-frontend-new-ui \
  --network vibing-net \
  -p 8080:80 \
  vibing-frontend:latest-new-ui

echo "🚀 New UI deployment started!"
echo "Backend running at http://localhost:5000"
echo "Frontend running at http://localhost:8080"
echo ""
echo "To test in Chrome, open: http://localhost:8080"
echo ""
echo "To stop: docker stop vibing-backend-new-ui vibing-frontend-new-ui"