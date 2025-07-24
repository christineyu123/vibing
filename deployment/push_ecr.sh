#!/bin/bash
set -e

# Variables
AWS_REGION="us-east-1" # Change if needed
AWS_ACCOUNT_ID="" # Replace with your AWS Account ID
BACKEND_REPO="vibing-backend"
FRONTEND_REPO="vibing-frontend"
TAG="latest"

# Authenticate Docker to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Tag images
docker tag vibing-backend:$TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:$TAG
docker tag vibing-frontend:$TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:$TAG

# Push images
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:$TAG
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:$TAG

echo "Images pushed to ECR." 