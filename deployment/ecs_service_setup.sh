#!/bin/bash
set -e

# Variables
CLUSTER_NAME="vibing-cluster"
SERVICE_NAME="vibing-service"
TASK_DEF_FILE="deployment/ecs_task_definition.json"
AWS_REGION="us-east-1" # Change if needed

# Register task definition
echo "Registering ECS task definition..."
TASK_DEF_ARN=$(aws ecs register-task-definition --cli-input-json file://$TASK_DEF_FILE --region $AWS_REGION --query 'taskDefinition.taskDefinitionArn' --output text)

echo "Creating ECS cluster..."
aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $AWS_REGION || true

echo "Running ECS service..."
aws ecs create-service \
  --cluster $CLUSTER_NAME \
  --service-name $SERVICE_NAME \
  --task-definition $TASK_DEF_ARN \
  --desired-count 1 \
  --launch-type EC2 \
  --network-configuration 'awsvpcConfiguration={subnets=[<subnet-id>],securityGroups=[<sg-id>],assignPublicIp=ENABLED}' \
  --region $AWS_REGION

echo "ECS service created." 