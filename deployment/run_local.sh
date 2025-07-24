#!/bin/bash
set -e

# Create a Docker network for communication
docker network create vibing-net || true

# Run backend container
docker run -d --rm \
  --name vibing-backend \
  --network vibing-net \
  -p 5000:5000 \
  vibing-backend:latest

# Run frontend container
docker run -d --rm \
  --name vibing-frontend \
  --network vibing-net \
  -p 8080:80 \
  vibing-frontend:latest

echo "Backend running at http://localhost:5000"
echo "Frontend running at http://localhost:8080"

echo "To stop: docker stop vibing-backend vibing-frontend" 