# Attendance Management System (Spring Boot + React)

This folder contains:
- `backend/` Spring Boot API (H2 + JWT)
- `frontend/` React UI

## Run Backend
```bash
cd backend
./mvnw spring-boot:run
```

## Bootstrap first ADMIN
```http
POST http://localhost:8080/api/bootstrap
Content-Type: application/json

{
  "name":"Admin",
  "email":"admin@school.com",
  "password":"admin123"
}
```

## Run Frontend
```bash
cd ../frontend
npm install
npm start
```

Frontend: http://localhost:3000
Backend:  http://localhost:8080
