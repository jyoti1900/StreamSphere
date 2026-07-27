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

# ✨ Features

| 🔐 Authentication | 🎥 Video Management | ☁️ Media Storage |
|-------------------|---------------------|------------------|
| ✅ User Registration | ✅ Upload Videos | ✅ AWS S3 Upload |
| ✅ Secure Login | ✅ Delete Videos | ✅ Secure File Storage |
| ✅ JWT Authentication | ✅ Edit Metadata | ✅ Signed URLs |
| ✅ Refresh Tokens | ✅ Categories | ✅ Thumbnail Storage |
| ✅ Protected APIs | ✅ Thumbnail Upload | ✅ Automatic File Removal |
| ✅ Role-Based Authorization | ✅ Video Details | |

| 👤 User Features | 🛠 Admin Features |
|------------------|-------------------|
| ✅ Profile Management | ✅ Dashboard |
| ✅ Watch History | ✅ User Management |
| ✅ Continue Watching | ✅ Content Management |
| ✅ Search Videos | ✅ Analytics Ready |
| ✅ Responsive UI | |

# 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) |
| **Backend** | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-13AA52?style=flat-square&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square) ![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-13AA52?style=flat-square&logo=mongodb&logoColor=white) |
| **Cloud** | ![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=flat-square&logo=amazons3&logoColor=white) ![Amazon EC2](https://img.shields.io/badge/Amazon_EC2-FF9900?style=flat-square&logo=amazonec2&logoColor=white) ![AWS IAM](https://img.shields.io/badge/AWS_IAM-FF9900?style=flat-square&logo=amazonaws&logoColor=white) ![CloudFront](https://img.shields.io/badge/CloudFront-FF9900?style=flat-square&logo=amazonaws&logoColor=white) |
| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=flat-square&logo=docker&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white) |
| **API Documentation & Testing** | ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white) |
| **Version Control** | ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white) |

# 🏗 System Architecture

<p align="center">
  <img src="StreamSphere System Architecture.png" alt="StreamSphere System Architecture" width="100%">
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

## Backend

```bash
cd backend

npm install
```

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

| Module | Description |
|--------|-------------|
| 🔐 Authentication | User registration, login, JWT, refresh tokens |
| 👤 Users | User profile and account management |
| 🎥 Videos | Upload, update, delete, and stream videos |
| ☁️ Uploads | Media upload and file handling |
| 🗂 Categories | Video categorization and organization |
| 🔍 Search | Search and filter videos |
| 📊 Dashboard | Analytics and administrative overview |

# 🔒 Security

| Security Feature | Purpose |
|------------------|---------|
| 🔑 JWT Authentication | Secure user authentication |
| 🔒 Password Hashing | Encrypt user passwords |
| 🛡 Protected Routes | Restrict unauthorized access |
| ⚙ Environment Variables | Secure configuration management |
| ☁️ AWS IAM Permissions | Controlled cloud resource access |
| 📤 Secure File Upload | Safe media upload handling |
| ✅ Input Validation | Prevent invalid or malicious input |
| 📋 Request Validation | Ensure API request integrity |

# ⚡ Performance Optimizations

| Optimization | Benefit |
|-------------|---------|
| ⚡ Lazy Loading | Faster initial page load |
| 🍃 Optimized MongoDB Queries | Reduced database response time |
| 🖼 Image Compression | Lower bandwidth usage |
| 🔗 Efficient API Design | Improved backend performance |
| 🏗 Modular Architecture | Better scalability and maintainability |
| ☁️ Cloud Storage | Reliable and scalable media storage |
| 🐳 Dockerized Deployment | Consistent development and production environments |
| 📘 TypeScript Strict Mode | Improved code quality and reliability |

# 📈 Future Improvements

| Feature | Description |
|---------|-------------|
| 📡 Live Streaming | Real-time video broadcasting |
| 🤖 Video Recommendations | AI-powered personalized suggestions |
| 💳 Subscription Plans | Premium membership support |
| 💰 Payment Gateway | Secure online payments |
| 🔎 AI Video Search | Intelligent content discovery |
| 🔔 Notifications | Real-time user alerts |
| 👥 Watch Together | Shared viewing experience |
| 🌐 Multi-language Support | Localization for global users |
| 📊 Analytics Dashboard | Advanced insights and reporting |
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
