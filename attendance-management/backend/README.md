# Attendance Backend (Spring Boot + H2 + JWT)

## Requirements
- Java 17+
- Maven (or use the included Maven Wrapper)

## Run
```bash
./mvnw spring-boot:run
```
Backend: http://localhost:8080

## H2 Console
- URL: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:attendancedb
- User: sa
- Password: (blank)

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

## Login
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email":"admin@school.com",
  "password":"admin123"
}
```

After login, send the token in:
`Authorization: Bearer <token>`
