#!/bin/bash
set -e

# Variables
BACKEND_IMAGE_NAME="vibing-backend"
FRONTEND_IMAGE_NAME="vibing-frontend"
TAG="latest"

# Build backend image
docker build -f deployment/Dockerfile.backend -t $BACKEND_IMAGE_NAME:$TAG .

# Build frontend image
docker build -f deployment/Dockerfile.frontend -t $FRONTEND_IMAGE_NAME:$TAG .

echo "Images built: $BACKEND_IMAGE_NAME:$TAG, $FRONTEND_IMAGE_NAME:$TAG" 