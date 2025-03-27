# Exercise Tracker API 🏋️‍♂️

Una API RESTful para registrar y consultar ejercicios de los usuarios. Este proyecto es parte de los proyectos certificados de **freeCodeCamp - Back End Development and APIs Certification**.

## 🚀 Funcionalidades

- Crear nuevos usuarios.
- Registrar ejercicios asociados a un usuario.
- Consultar el log de ejercicios de un usuario.
- Filtros opcionales por rango de fechas y límite de resultados.

## 🛠️ Tecnologías usadas

- Node.js
- Express.js
- MongoDB + Mongoose

## 📄 Endpoints

### Crear un nuevo usuario
**POST** `/api/users`
- **Body:** `username`
- **Response:**
```json
{
  "_id": "643b9a6d...",
  "username": "gerardo"
}
```

---

### Obtener todos los usuarios
**GET** `/api/users`
- **Response:** Array de usuarios.

---

### Registrar un ejercicio
**POST** `/api/users/:_id/exercises`
- **Body:** `description`, `duration`, `date` (opcional)
- **Response:**
```json
{
  "_id": "643b9a6d...",
  "username": "gerardo",
  "description": "Running",
  "duration": 30,
  "date": "Thu Mar 27 2025"
}
```

---

### Consultar el log de ejercicios
**GET** `/api/users/:_id/logs`
- **Query Params:** `from`, `to`, `limit` (opcional)
- **Response:**
```json
{
  "_id": "643b9a6d...",
  "username": "gerardo",
  "count": 3,
  "log": [
    {
      "description": "Running",
      "duration": 30,
      "date": "Thu Mar 27 2025"
    }
  ]
}
```

---

## 💾 Instalación local

```bash
git clone https://github.com/TU-USUARIO/exercise-tracker-api.git
cd exercise-tracker-api
npm install
npm start
```

Crea un archivo `.env` para la cadena de conexión a tu base de datos MongoDB:

```
MONGO_URI=tu_conexion_mongo
PORT=3000
```

---
