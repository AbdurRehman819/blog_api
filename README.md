# 📝 Blog Platform API

A robust and scalable RESTful API for a blogging platform built with **Node.js**, **Express**, and **MongoDB**.  
Designed with modular architecture, security best practices, and production-ready features such as authentication, role-based access, logging, rate limiting, Redis caching, and more.

---

## Features

 **Authentication & Authorization**
  - JWT-based login/signup
  - Role-based access (user/admin)
  - Email verification
  - Password reset with secure tokens

 **Post Management**
  - CRUD operations for blog posts
  - Slug generation for SEO-friendly URLs
  - Category & tag linking
  - Pagination & filtering by search/tag/category

 **Comment System**
  - Authenticated users can add/delete comments
  - Ownership checks for deleting

 **Likes System**
  - Like/unlike posts
  - Dynamic like counts

 **Rate Limiting**
  - Prevent API abuse using fixed-window strategy

 **Redis Caching**
  - Upstash Redis for caching filtered post lists

 **Logging**
  - Winston-based logging system
  - Info & error logs saved to local files

 **API Documentation**
  - All endpoints documented in Postman Collection


 ## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, Bcrypt, Email Token Verification
- **Other Tools**: Multer, Redis (Upstash), Winston, dotenv, Postman

---

## 📁 Project Structure
blog_api/
├── controllers/
├── routes/
├── models/
├── middleware/
├── utils/
├── logs/
├── config/
├── .env
├── app.js
└── server.js



