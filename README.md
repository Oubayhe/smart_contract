# Smart Contract API

A backend API built with Hono (TypeScript) and Drizzle ORM for managing users, teams, and smart contract packages. Containerized with Docker and connected to a PostgreSQL database.

## Table of Contents

- [Tech Stack and Objective](#tech-stack-and-objective)
- [Quick Start](#quick-start)
- [Endpoints](#endpoints)

---

## Tech Stack and Objective

**Stack:**
- **Framework:** Hono (TypeScript)
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Containerization:** Docker, Docker Compose
- **Validation:** Zod
- **Testing (Planned):** Vitest or Jest

**Objective:**
This project provides a modular backend structure for handling user registration, authentication, team membership, and smart contract package storage. It was created as a personal learning project to explore Hono, Drizzle ORM, and Docker-based development environments.

---

## Quick Start

#### Prerequisites

Before starting, ensure you have the following installed on your local machine:
- Docker: https://www.docker.com/products/docker-desktop
- Docker Compose (usually comes with Docker Desktop)

### Setup


1. **Clone the repository**
```bash
git clone https://github.com/Oubayhe/smart_contract.git
```
2. **Navigate to the project directory**
```bash
cd smart_contract
```
3. **Create environment variables**
```bash
cp .env.example .env
```
4. **Start the containers**
```bash
docker-compose up --build
```

The API will be available at http://localhost:3000

## Endpoints

### Authentication

| Method | Endpoint       | Description                             |
|--------|----------------|-----------------------------------------|
| POST   | /auth/login    | Authenticate user and return JWT token  |
| GET    | /auth/me       | Get profile of authenticated user       |

---

### User Management

| Method | Endpoint     | Description             |
|--------|--------------|-------------------------|
| POST   | /users       | Register a new user     |
| GET    | /users/:id   | Get user details by ID  |

---

### Team Management

| Method | Endpoint                          | Description               |
|--------|-----------------------------------|---------------------------|
| POST   | /teams                            | Create a new team         |
| POST   | /teams/:teamId/members            | Add a member to a team    |

---

### Package Management

| Method | Endpoint            | Description                                      |
|--------|---------------------|--------------------------------------------------|
| POST   | /packages           | Create a new smart contract package              |
| GET    | /packages           | Search all packages (optional: query, isPublic)  |
| GET    | /packages/:id       | Get package details by ID                        |
