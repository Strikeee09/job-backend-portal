# 📄 Job Portal Backend

This is the backend server for a **Job Portal Application**, built with **Node.js**, **Express**, and **MongoDB**.  
It provides RESTful APIs for job seekers and recruiters to post jobs, apply for jobs, and manage job postings.

---

## 🚀 Features

- User authentication (login/signup) [*assuming it's handled*]
- Post new jobs
- Fetch all jobs
- Search jobs by city, niche, or keyword
- Fetch single job details
- Delete posted jobs
- View jobs posted by the logged-in user
- Proper error handling and validation
- CORS and cookie-based session support

---

## 📂 Project Structure (Expected)

```
backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── utils/
├── server.js (or index.js)
├── package.json
```

---

## ⚙️ API Endpoints

### ➤ Job Routes

| Method | Endpoint | Description |
|:------:|:--------:|:----------- |
| `GET`  | `/api/v1/job/getall` | Fetch all jobs (with optional search, city, and niche filters) |
| `GET`  | `/api/v1/job/get/:id` | Fetch a single job by ID |
| `POST` | `/api/v1/job/post` | Post a new job (Recruiters) |
| `GET`  | `/api/v1/job/getmyjobs` | Fetch jobs posted by the logged-in recruiter |
| `DELETE` | `/api/v1/job/delete/:id` | Delete a job by ID |

### ➤ Query Parameters for `GET /getall`

| Parameter | Type | Description |
|:---------:|:----:|:----------- |
| `city` | String | Filter jobs by city |
| `niche` | String | Filter jobs by niche |
| `searchKeyword` | String | Search in job title or description |

---

## 📦 Installation

```bash
git clone https://github.com/your-username/job-portal-backend.git
cd job-portal-backend
npm install
```

### ➤ Create a `.env` file with these variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

---

## 🚀 Run the Server

```bash
# For development
npm run dev

# For production
npm start
```

Server will start at `http://localhost:5000`

---

## 🛡️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (with Mongoose)
- **JWT** Authentication
- **Bcrypt.js** (for password hashing)
- **CORS**
- **Cookie-Parser**

---

## 🌐 Deployment

You can deploy the backend easily on:

- **Render** (currently used)
- **Vercel** (with serverless functions)
- **Heroku**
- **AWS EC2**

---

## 🤝 Contribution

Feel free to submit Issues or Pull Requests!  
Let's make this project even better 🚀

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

