# 🎬 StreamSphere

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-13AA52?style=for-the-badge&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=FF9900)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### **A Modern Cloud-Native Video Streaming Platform**

*Built with Next.js, NestJS, MongoDB, AWS S3, Docker, and TypeScript.*

</div>

---

# 📖 Overview

**StreamSphere** is a full-stack cloud-native video streaming platform that enables users to securely upload, manage, and stream multimedia content. The application follows modern software engineering principles and scalable architecture using TypeScript across both frontend and backend.

The project integrates AWS cloud services for secure object storage, Docker for containerized deployment, and JWT authentication for user security.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Password Hashing
- Role-Based Authorization

---

## 🎥 Video Management

- Upload Videos
- Stream Videos
- Update Video Information
- Delete Videos
- Video Categories
- Thumbnail Upload

---

## ☁️ Cloud Integration

- AWS S3 File Storage
- Secure Media Upload
- Optimized File Management
- Cloud-Based Asset Storage

---

## 📱 User Experience

- Responsive Design
- Modern UI
- Fast Navigation
- Secure Dashboard
- Profile Management

---

## ⚙ Backend Features

- REST API
- Modular Architecture
- DTO Validation
- Error Handling
- File Upload API
- MongoDB Integration

---

# 🏗 Architecture

```text
                  +----------------------+
                  |      Next.js         |
                  |      Frontend        |
                  +----------+-----------+
                             |
                       REST API (HTTPS)
                             |
                  +----------+-----------+
                  |      NestJS API      |
                  +----------+-----------+
                             |
          +------------------+------------------+
          |                                     |
     MongoDB Database                    AWS S3 Storage
          |                                     |
     User & Video Data                 Images & Videos
```

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React.js
- TypeScript
- Tailwind CSS

## Backend

- NestJS
- TypeScript
- Express
- JWT Authentication
- Multer

## Database

- MongoDB
- Mongoose

## Cloud

- AWS EC2
- AWS S3
- IAM

## DevOps

- Docker
- Docker Compose
- GitHub Actions

---

# 📂 Project Structure

```text
StreamSphere
│
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
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/jyoti1900/StreamSphere.git

cd StreamSphere
```

---

## Install Backend

```bash
cd backend

npm install
```

---

## Install Frontend

```bash
cd frontend

npm install
```

---

# 🔐 Environment Variables

## Backend (.env)

```env
PORT=

MONGODB_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

AWS_REGION=

AWS_ACCESS_KEY_ID=

AWS_SECRET_ACCESS_KEY=

AWS_BUCKET_NAME=

CLOUDFRONT_DOMAIN=
```

---

## Frontend (.env)

```env
NEXT_PUBLIC_API_URL=
```

---

# ▶ Run Backend

```bash
npm run start:dev
```

---

# ▶ Run Frontend

```bash
npm run dev
```

---

# 🐳 Docker

```bash
docker compose up --build
```

---

# 📡 API Endpoints

## Authentication

```http
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
```

---

## Users

```http
GET    /users/profile
PUT    /users/profile
```

---

## Videos

```http
GET    /videos
GET    /videos/:id
POST   /videos
PUT    /videos/:id
DELETE /videos/:id
```

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Role-Based Authorization
- Protected Routes
- Request Validation
- Secure AWS Storage
- Input Sanitization

---

# ⚡ Performance

- Optimized API Response
- Cloud Storage
- Dockerized Deployment
- Modular Backend
- Efficient MongoDB Queries
- Scalable Architecture

---

# 📈 Future Enhancements

- Adaptive Video Streaming (HLS)
- Video Compression
- Playlist Support
- Comments
- Likes
- Subscription System
- Notifications
- Live Streaming
- AI Recommendations
- Analytics Dashboard

---

# 📚 Learning Outcomes

This project demonstrates:

- Full-Stack TypeScript Development
- REST API Design
- Authentication & Authorization
- AWS Cloud Integration
- Docker Deployment
- MongoDB Database Design
- Backend Architecture
- Cloud Storage Management
- Secure File Upload
- Production-Level Project Structure

---

# 👨‍💻 Author

**Jyotipriya Das**

🎓 MCA Student

💻 Full Stack Developer

### Skills

- TypeScript
- Next.js
- NestJS
- React.js
- MongoDB
- AWS
- Docker
- Node.js

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/NewFeature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to the branch

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request

---

# ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

---

# 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

### ⭐ Star this repository if you found it useful!

Made with ❤️ by **Jyotipriya Das**

</div>
