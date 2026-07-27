<div align="center">

# 🎬 StreamSphere

### Enterprise-Grade Video Streaming Platform built with Full Stack TypeScript

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-13AA52?style=for-the-badge&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=FF9900)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A scalable cloud-based video streaming platform featuring secure authentication,
high-performance media delivery, AWS cloud integration, and modern full-stack architecture.

</div>

---

# 🚀 Overview

StreamSphere is a production-ready video streaming platform inspired by modern OTT
applications. It allows users to securely upload, manage, stream, and organize
video content while leveraging AWS cloud services for scalable media storage.

The project follows industry-standard backend architecture using **NestJS**, **Next.js**,
**MongoDB**, **AWS S3**, **Docker**, and **JWT Authentication**.

---

# ✨ Features

## Authentication

- User Registration
- Secure Login
- JWT Authentication
- Refresh Tokens
- Protected APIs
- Role-Based Authorization

---

## Video Management

- Upload Videos
- Delete Videos
- Edit Metadata
- Categories
- Thumbnail Upload
- Video Details
- Streaming Support

---

## Media Storage

- AWS S3 Upload
- Secure File Storage
- Signed URLs
- Thumbnail Storage
- Automatic File Removal

---

## User Features

- Profile Management
- Watch History
- Continue Watching
- Search Videos
- Responsive UI

---

## Admin Features

- Dashboard
- User Management
- Content Management
- Analytics Ready

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

## Backend

- NestJS
- Node.js
- TypeScript

## Database

- MongoDB
- Mongoose

## Cloud

- AWS S3
- IAM
- EC2
- CloudFront (Optional)

## DevOps

- Docker
- Docker Compose
- GitHub Actions

---

# 🏗 System Architecture

<p align="center">
  <img src="System Architecture.png" alt="StreamSphere System Architecture" width="100%">
</p>

---

# 📁 Project Structure

```
StreamSphere

├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── services
│   └── utils
│
├── backend
│   ├── src
│   │   ├── auth
│   │   ├── users
│   │   ├── videos
│   │   ├── uploads
│   │   ├── common
│   │   └── config
│   │
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/jyoti1900/StreamSphere.git

cd StreamSphere
```

---

## Backend

```bash
cd backend

npm install
```

---

## Frontend

```bash
cd frontend

npm install
```

---

# 🔑 Environment Variables

Backend

```env
PORT=3000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_REFRESH_SECRET=<your_jwt_refresh_secret>
AWS_REGION=<your_aws_region>
AWS_ACCESS_KEY_ID=<your_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_secret_access_key>
AWS_BUCKET_NAME=<your_s3_bucket_name>
CLOUDFRONT_URL=<your_cloudfront_distribution_url>
```

Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

# ▶ Running Locally

Backend

```bash
npm run start:dev
```

Frontend

```bash
npm run dev
```

---

# 🐳 Docker

Build

```bash
docker-compose build
```

Run

```bash
docker-compose up -d
```

Stop

```bash
docker-compose down
```

---

# ☁ Deployment Flow

<p align="center">
  <img src="Deployment Flow.png" alt="StreamSphere Deployment Flow" width="100%">
</p>

---

# 🔐 Authentication Flow

<p align="center">
  <img src="Authentication Flow.png" alt="StreamSphere Authentication Flow" width="100%">
</p>

---

# 📦 API Modules

- Authentication
- Users
- Videos
- Uploads
- Categories
- Search
- Dashboard

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Protected Routes
- Environment Variables
- AWS IAM Permissions
- Secure File Upload
- Input Validation
- Request Validation

---

# ⚡ Performance Optimizations

- Lazy Loading
- Optimized MongoDB Queries
- Image Compression
- Efficient API Design
- Modular Architecture
- Cloud Storage
- Dockerized Deployment
- TypeScript Strict Mode

---

# 📈 Future Improvements

- Live Streaming
- Video Recommendations
- Subscription Plans
- Payment Gateway
- AI Video Search
- Notifications
- Watch Together
- Multi-language Support
- Analytics Dashboard

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push

```bash
git push origin feature/new-feature
```

5. Create Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developed By

| Team Member | Contribution |
|-------------|--------------|
| **Jyotipriya Das** | 🚀 Project Lead, Backend Development, Cloud Infrastructure (AWS), CI/CD Pipeline, Docker, System Architecture |
| **Sayan Pal** | 💻 Full Stack Development, Testing, Debugging, UI/UX Implementation |
| **Indrajit Sahu** | 🎨 Frontend Development, UI Components, User Experience |

---

<div align="center">

⭐ If you found this project helpful, consider giving it a Star!

</div>
