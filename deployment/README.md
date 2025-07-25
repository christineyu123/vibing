# Vibing

**A Vibe Coding Project**

---

## 🚀 Project Overview

**Tech Stack:**
- **Frontend:** React, Bootstrap
- **Backend:** Flask, SQLAlchemy, JWT, SQLite
- **Deployment:** AWS ECS Fargate

**What is Vibing?**
> Vibing is a web platform that connects Vibe Coders with domain experts, making it easy to collaborate, communicate, and share knowledge. Whether you're looking for beta testers, discovery calls, or to exchange expertise, Vibing helps you build meaningful connections and accelerate your projects.

---

## 🌐 Live Demo Screenshot

Below is a screenshot of the landing page as deployed with AWS ECS Fargate:

![Landing page screenshot](../assets/landing-page-ecs-fargate.png)

*Landing page of Vibing, deployed on AWS ECS Fargate*

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

## 5. ECS Deployment (AWS Console UI)

After pushing your Docker images to ECR, you can deploy your app using AWS ECS. Below are step-by-step guides for both ECS Fargate and ECS EC2 launch types. Both methods use the AWS Console UI and deploy both frontend and backend containers.

---

### 5.1 Deploy with ECS Fargate (Recommended for Simplicity)

#### 1. Log in to AWS Console
- Go to https://console.aws.amazon.com/
- Select your region (e.g., us-east-1).

#### 2. Create (or Use) a VPC, Subnet, and Security Group
- For Free Tier, you can use the default VPC and its subnets.
- Ensure your security group allows inbound HTTP (port 80) and, if needed, 5000 for backend.

#### 3. Create an ECS Cluster
- Go to **ECS** > **Clusters** > **Create Cluster**.
- Choose **Networking only (Fargate)**.
- Name: `vibing-fargate-cluster` (or your choice).
- Click **Create**.

#### 4. Create an IAM Role for Task Execution
- Go to **IAM** > **Roles** > **Create role**.
- Select **AWS service** > **ECS** > **ECS Task**.
- Attach the **AmazonECSTaskExecutionRolePolicy**.
- Name: `ecsTaskExecutionRole` (or your choice).
- Click **Create role**.

> **You will select this role as the "Task execution role" when creating the Task Definition in the next step.**

#### 5. Register a Task Definition
- Go to **ECS** > **Task Definitions** > **Create new Task Definition**.
- Launch type: **FARGATE**.
- Name: `vibing-fargate-task` (or your choice).
- Task role: (optional, for advanced features)
- Task execution role: **Select the IAM role you just created (`ecsTaskExecutionRole`)**.
- Network mode: `awsvpc`.
- Task size: 512 CPU, 1024 MiB memory (or adjust as needed).
- Add two containers:
  - **backend**:
    - Image: `<BACKEND_IMAGE_URI>` (from ECR)
    - Port mappings: 5000 (container and host)
    - Env: `FLASK_ENV=production`
    - **Log collection:** Under 'Storage and Logging', enable CloudWatch logs, create a new log group (e.g., `/ecs/vibing-backend`).
  - **frontend**:
    - Image: `<FRONTEND_IMAGE_URI>` (from ECR)
    - Port mappings: 80 (container and host)
    - **Log collection:** Enable CloudWatch logs, create a new log group (e.g., `/ecs/vibing-frontend`).
- Click **Create**.

#### 6. Create a Service
- Go to your cluster > **Services** > **Create**.
- Launch type: **FARGATE**.
- Task Definition: Select the one you just created.
- Service name: `vibing-fargate-service` (or your choice).
- Number of tasks: 1.
- Networking: Select your VPC, subnet, and security group.
- Assign public IP: **ENABLED**.
- Click **Create Service**.

#### 7. Access Your App
- Go to the **ECS Service** > **Tasks** > select the running task.
- Find the public IP in the ENI (Elastic Network Interface) details.
- Open `http://<public-ip>` in your browser (frontend on port 80).
- Backend will be on port 5000 if you open `http://<public-ip>:5000` and the security group allows it.

#### 8. Cleanup
- Go to **CloudFormation** > delete the stack created for your ECS service (if you used a stack), or manually delete the ECS service, cluster, and ECR repositories to avoid charges.

---

### 5.2 Deploy with ECS EC2 (Free Tier Eligible)

#### 1. Log in to AWS Console
- Go to https://console.aws.amazon.com/
- Select your region (e.g., us-east-1).

#### 2. Create (or Use) a VPC, Subnet, and Security Group
- For Free Tier, you can use the default VPC and its subnets.
- Ensure your security group allows inbound HTTP (port 80) and, if needed, 5000 for backend.

#### 3. Create an ECS Cluster
- Go to **ECS** > **Clusters** > **Create Cluster**.
- Choose **EC2 Linux + Networking**.
- Name: `vibing-ec2-cluster` (or your choice).
- Instance type: `t2.micro` (Free Tier eligible).
- Number of instances: 1 (or more if needed).
- Networking: Select your VPC, subnet, and security group.
- **EC2 Instance Role:** When prompted, select or create an IAM role named `ecsInstanceRole` (or similar) with the **AmazonEC2ContainerServiceforEC2Role** policy attached. This allows EC2 instances to join the ECS cluster and pull images from ECR.
- Click **Create**.

#### 4. Create an IAM Role for Task Execution
- Go to **IAM** > **Roles** > **Create role**.
- Select **AWS service** > **ECS** > **ECS Task**.
- Attach the **AmazonECSTaskExecutionRolePolicy**.
- Name: `ecsTaskExecutionRole` (or your choice).
- Click **Create role**.

> **You will select this role as the "Task execution role" when creating the Task Definition in the next step.**

#### 5. Register a Task Definition
- Go to **ECS** > **Task Definitions** > **Create new Task Definition**.
- Launch type: **EC2**.
- Name: `vibing-ec2-task` (or your choice).
- Task role: (optional, for advanced features)
- Task execution role: **Select the IAM role you just created (`ecsTaskExecutionRole`)**.
- Network mode: `awsvpc`.
- Task size: 512 CPU, 1024 MiB memory (or adjust as needed).
- Add two containers:
  - **backend**:
    - Image: `<BACKEND_IMAGE_URI>` (from ECR)
    - Port mappings: 5000 (container and host)
    - Env: `FLASK_ENV=production`
    - **Log collection:** Under 'Storage and Logging', enable CloudWatch logs, create a new log group (e.g., `/ecs/vibing-backend`).
  - **frontend**:
    - Image: `<FRONTEND_IMAGE_URI>` (from ECR)
    - Port mappings: 80 (container and host)
    - **Log collection:** Enable CloudWatch logs, create a new log group (e.g., `/ecs/vibing-frontend`).
- Click **Create**.

#### 6. Create a Service
- Go to your cluster > **Services** > **Create**.
- Launch type: **EC2**.
- Task Definition: Select the one you just created.
- Service name: `vibing-ec2-service` (or your choice).
- Number of tasks: 1.
- Networking: Select your VPC, subnet, and security group.
- Assign public IP: **ENABLED**.
- Click **Create Service**.

#### 7. Access Your App
- Go to the **EC2 Instances** page.
- Find the public IP of the instance running your ECS task.
- Open `http://<public-ip>` in your browser (frontend on port 80).
- Backend will be on port 5000 if you open `http://<public-ip>:5000` and the security group allows it.

#### 8. Cleanup
- Go to **CloudFormation** > delete the stack created for your ECS service (if you used a stack), or manually delete the ECS service, cluster, and ECR repositories to avoid charges.

---

## 6. Access Your App

- Go to the EC2 instance public IP (or ECS service public endpoint) in your browser.
- Frontend: Port 80, Backend: Port 5000 (if exposed).

---

## Notes
- For Free Tier, use t2.micro EC2 instances and default VPC/subnet/SG.
- You can manage ECS/EC2 via AWS Console for easier networking setup.
- Make sure your security group allows inbound HTTP (80) and, if needed, 5000.
- **Docker image architecture:** If you build Docker images on a MacBook (Apple Silicon), the default architecture is arm64. ECS EC2 instances and Fargate tasks typically use x86_64 (amd64) by default. To avoid compatibility issues, either:
  - Build and push multi-architecture images (arm64 and amd64) using Docker Buildx, or
  - When creating your ECS cluster/service, select an ARM-compatible AMI/OS for EC2, or set the correct platform/architecture for Fargate tasks.
- If you see errors about platform incompatibility, check your image architecture and ECS instance/task settings.

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