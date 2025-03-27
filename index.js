require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


// Middlewares
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }
});

const exerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date
});

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

// Rutas

// Página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Crear nuevo usuario
app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body;
    const newUser = new User({ username });
    const savedUser = await newUser.save();
    console.log(`🟢 Usuario creado: ${savedUser.username} (${savedUser._id})`);
    res.json({ username: savedUser.username, _id: savedUser._id });
  } catch (err) {
    console.error('❌ Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('_id username');
    console.log(`📄 Usuarios encontrados: ${users.length}`);
    res.json(users);
  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Agregar ejercicio
app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const exercise = new Exercise({
      username: user.username,
      description,
      duration: parseInt(duration),
      date: date ? new Date(date) : new Date()
    });

    const savedExercise = await exercise.save();
    console.log(`🟢 Ejercicio agregado a ${user.username}: ${savedExercise.description}`);

    res.json({
      _id: user._id,
      username: user.username,
      date: savedExercise.date.toDateString(),
      duration: savedExercise.duration,
      description: savedExercise.description
    });
  } catch (err) {
    console.error('❌ Error al agregar ejercicio:', err);
    res.status(500).json({ error: 'Error al agregar ejercicio' });
  }
});

// Obtener log de ejercicios
app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    let exercises = await Exercise.find({ username: user.username });

    // Filtro por fechas
    if (from) {
      const fromDate = new Date(from);
      exercises = exercises.filter(e => e.date >= fromDate);
    }

    if (to) {
      const toDate = new Date(to);
      exercises = exercises.filter(e => e.date <= toDate);
    }

    // Aplicar límite
    if (limit) {
      exercises = exercises.slice(0, parseInt(limit));
    }

    const log = exercises.map(e => ({
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString()
    }));

    console.log(`📄 Log solicitado para ${user.username}: ${log.length} ejercicios`);

    res.json({
      _id: user._id,
      username: user.username,
      count: log.length,
      log
    });
  } catch (err) {
    console.error('❌ Error al obtener log:', err);
    res.status(500).json({ error: 'Error al obtener log' });
  }
});

// ==========================
// Listener
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
