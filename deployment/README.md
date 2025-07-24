# Deployment Guide: Vibing Web App (Backend + Frontend)

This guide helps you deploy your full-stack app to AWS using Docker, ECR, and ECS (EC2 launch type, Free Tier eligible).

---

## Prerequisites
- AWS account
- AWS CLI installed and configured (`aws configure`)
- Docker installed

---

## 1. Create ECR Repositories

Replace `<your-aws-account-id>` and region as needed.

```sh
aws ecr create-repository --repository-name vibing-backend --region us-east-1
aws ecr create-repository --repository-name vibing-frontend --region us-east-1
```

---

## 2. Build Docker Images

```sh
bash deployment/build_images.sh
```

---

## 3. Push Images to ECR

Edit `deployment/push_ecr.sh` and set your AWS Account ID and region.

```sh
bash deployment/push_ecr.sh
```

---

## 4. Prepare ECS Task Definition

- Edit `deployment/ecs_task_definition.json`:
  - Replace `<BACKEND_IMAGE_URI>` and `<FRONTEND_IMAGE_URI>` with your ECR image URIs (from push step).

---

## 5. Deploy to ECS (EC2 Launch Type)

- Edit `deployment/ecs_service_setup.sh`:
  - Replace `<subnet-id>` and `<sg-id>` with your VPC subnet and security group IDs (use default VPC for Free Tier).
- Run:

```sh
bash deployment/ecs_service_setup.sh
```

---

## 6. Access Your App

- Go to the EC2 instance public IP (or ECS service public endpoint) in your browser.
- Frontend: Port 80, Backend: Port 5000 (if exposed).

---

## Notes
- For Free Tier, use t2.micro EC2 instances and default VPC/subnet/SG.
- You can manage ECS/EC2 via AWS Console for easier networking setup.
- Make sure your security group allows inbound HTTP (80) and, if needed, 5000.

---

## Cleanup
To avoid charges, delete ECS services, clusters, and ECR repos when done. 

---

## Local Testing (Run with Docker)

After building the Docker images, you can test the full app locally:

```sh
bash deployment/run_local.sh
```

- Backend will be available at: http://localhost:5000
- Frontend will be available at: http://localhost:8080

To stop the containers:

```sh
docker stop vibing-backend vibing-frontend
``` 

---

## Manual ECS Deployment via AWS Console (UI)

If your Docker images are already pushed to ECR, you can deploy your app using the AWS Console UI. Here are the steps:

### 1. Log in to AWS Console
- Go to https://console.aws.amazon.com/
- Make sure you are in the correct region (e.g., us-east-1).

### 2. Create (or Use) a VPC, Subnet, and Security Group
- For Free Tier, you can use the default VPC and its subnets.
- Ensure your security group allows inbound HTTP (port 80) and, if needed, 5000 for backend.

### 3. Create an ECS Cluster
- Go to **ECS** > **Clusters** > **Create Cluster**.
- Choose **EC2 Linux + Networking**.
- Name: `vibing-cluster` (or your choice).
- Instance type: `t2.micro` (Free Tier eligible).
- Number of instances: 1 (or more if needed).
- Networking: Select your VPC, subnet, and security group.
- Click **Create**.

### 4. Register a Task Definition
- Go to **ECS** > **Task Definitions** > **Create new Task Definition**.
- Launch type: **EC2**.
- Name: `vibing-task` (or your choice).
- Network mode: `awsvpc`.
- Task size: 512 CPU, 1024 MiB memory.
- Add two containers:
  - **backend**:
    - Image: `<BACKEND_IMAGE_URI>` (from ECR, e.g., `123456789012.dkr.ecr.us-east-1.amazonaws.com/vibing-backend:latest`)
    - Port mappings: 5000 (container and host)
    - Env: `FLASK_ENV=production`
  - **frontend**:
    - Image: `<FRONTEND_IMAGE_URI>` (from ECR)
    - Port mappings: 80 (container and host)
- Click **Create**.

### 5. Create a Service
- Go to your cluster > **Services** > **Create**.
- Launch type: **EC2**.
- Task Definition: Select the one you just created.
- Service name: `vibing-service` (or your choice).
- Number of tasks: 1.
- Networking: Select the same VPC, subnet, and security group as before.
- Assign public IP: **ENABLED**.
- Click **Create Service**.

### 6. Access Your App
- Go to the **EC2 Instances** page.
- Find the public IP of the instance running your ECS task.
- Open `http://<public-ip>` in your browser (frontend on port 80).
- Backend will be on port 5000 if you open `http://<public-ip>:5000` and the security group allows it.

### 7. Cleanup
- Delete the ECS service, cluster, and ECR repositories when done to avoid charges. 