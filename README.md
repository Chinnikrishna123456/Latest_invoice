# 📊 Invoice Management System - Full Stack Application

> A complete, production-ready Invoice Management System built with React, Spring Boot, and MongoDB.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)

## ✨ Features

### 💼 Invoice Management

- ✅ Create professional invoices
- ✅ Edit existing invoices
- ✅ Delete invoices with confirmation
- ✅ Search and filter by employee
- ✅ Automatic ID generation
- ✅ Tax calculation

### 📄 PDF Generation

- ✅ Server-side PDF generation
- ✅ Professional formatting
- ✅ Employee details included
- ✅ Work details table
- ✅ Automatic calculations
- ✅ One-click download

### 📧 Email Service

- ✅ Send invoices via email
- ✅ Automatic PDF attachment
- ✅ HTML formatted emails
- ✅ Gmail SMTP integration
- ✅ Custom email support

### 💾 Data Persistence

- ✅ MongoDB database
- ✅ Persistent data storage
- ✅ Audit trail (timestamps)
- ✅ Employee tracking
- ✅ Automatic backups

### 🎨 User Interface

- ✅ Modern, responsive design
- ✅ Tailwind CSS styling
- ✅ Smooth animations
- ✅ Professional layout
- ✅ Mobile friendly
- ✅ Dark mode ready

### 🔒 Security

- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling
- ✅ Environment variables
- ✅ Secure email credentials

## 🏗️ Tech Stack

### Frontend

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Fetch API** - HTTP Client

### Backend

- **Spring Boot 3.2** - Framework
- **Java 17** - Language
- **Spring Data MongoDB** - ORM
- **iText 7** - PDF Generation
- **JavaMail** - Email Service
- **Maven** - Build Tool

### Database

- **MongoDB** - NoSQL Database
- **MongoDB Atlas** - Cloud Option

## 🚀 Quick Start

### Prerequisites

- Node.js 14+
- Java 17+
- Maven 3.6+
- MongoDB 4.4+

### Step 1: Start MongoDB

```powershell
mongod
```

### Step 2: Start Backend

```powershell
cd backend
mvn spring-boot:run
```

Backend: `http://localhost:8080`

### Step 3: Start Frontend

```powershell
npm install
npm run dev
```

Frontend: `http://localhost:3002`

### Step 4: Open Browser

Open `http://localhost:3002` and start creating invoices! 🎉

## 📚 Documentation

| Document                 | Purpose                      |
| ------------------------ | ---------------------------- |
| **QUICKSTART.md**        | Get running in 5 minutes     |
| **INTEGRATION_GUIDE.md** | Full API integration details |
| **ARCHITECTURE.md**      | System design and data flow  |
| **BACKEND_SETUP.md**     | Backend setup summary        |
| **DEPLOYMENT.md**        | Production deployment guide  |
| **backend/README.md**    | Backend API documentation    |
| **backend/SETUP.md**     | Detailed backend setup       |

## 🌐 API Endpoints

All endpoints available at: `http://localhost:8080/api/invoices`

### Invoice Operations

```
POST   /                    Create invoice
GET    /                    Get all invoices
GET    /{id}                Get single invoice
PUT    /{id}                Update invoice
DELETE /{id}                Delete invoice
```

### PDF & Email

```
GET    /{id}/download       Download PDF
POST   /{id}/send-email     Send invoice email
```

## 🎯 Key Features

### 1. Create Invoice

- Fill form with employee and work details
- Automatically calculates totals and tax
- Saves to MongoDB
- Returns with auto-generated ID

### 2. Edit Invoice

- Click on any invoice to edit
- Update details
- Changes persist to database
- Timestamps updated automatically

### 3. Download PDF

- Server-side PDF generation
- Professional formatting
- Invoice number in filename
- One-click download

### 4. Send Email

- Send invoices directly to employees
- Automatic PDF attachment
- HTML formatted email
- Gmail SMTP integration

### 5. Delete Invoice

- Confirmation dialog prevents accidents
- Removes from database
- Updates UI immediately

## 🔧 Configuration

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8080/api/invoices
```

### Backend (application.properties)

```properties
server.port=8080
spring.data.mongodb.uri=mongodb://localhost:27017/invoice_db
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

## 📧 Email Setup (Optional)

To enable email feature:

1. **Generate Gmail App Password**

   - myaccount.google.com → Security
   - Enable 2-Step Verification
   - App passwords → Generate (Mail + Windows)

2. **Set Environment Variables**

   ```powershell
   $env:MAIL_USERNAME="your-email@gmail.com"
   $env:MAIL_PASSWORD="your-app-password"
   ```

3. **Restart Backend**
   ```powershell
   mvn spring-boot:run
   ```

## 🧪 Testing

### Test Backend

```bash
curl http://localhost:8080/api/invoices
```

### Test Frontend

1. Open http://localhost:3002
2. Create invoice → Should appear in list
3. Click edit → Form updates
4. Click download → PDF downloads
5. Click email → Email sent (if configured)
6. Click delete → Removed from list

## 🚢 Deployment

### Backend

```bash
cd backend
mvn clean package -DskipTests
java -jar target/invoice-backend-1.0.0.jar
```

### Frontend

```bash
npm run build
# Deploy dist/ folder to Netlify, Vercel, etc.
```

See **DEPLOYMENT.md** for complete deployment guide.

## 🆘 Troubleshooting

### Backend won't start

```bash
# Check MongoDB is running
mongod

# Check port 8080 is free
netstat -ano | findstr :8080

# Check Java version
java -version  # Should be 17+
```

### Frontend can't reach backend

```bash
# Check backend is running
curl http://localhost:8080/api/invoices

# Check .env file
REACT_APP_API_URL=http://localhost:8080/api/invoices

# Restart frontend
npm run dev
```

### Email not working

```
1. Verify Gmail app password set
2. Check 2-FA enabled
3. Verify SMTP 587 port not blocked
4. Check spam/junk folder
```

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## ✅ Project Status

**Complete & Production Ready**

- ✅ Frontend: Fully functional with professional UI
- ✅ Backend: Complete REST API with all features
- ✅ Database: MongoDB integration working
- ✅ Email: Gmail SMTP integration ready
- ✅ PDF: Server-side generation ready
- ✅ Documentation: Comprehensive

**Ready for immediate use and deployment.**

---

**Built with ❤️ for efficient invoice management**

_Start with QUICKSTART.md for 5-minute setup!_## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
