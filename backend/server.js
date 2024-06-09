const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/notesDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Importar rutas
const notesRoutes = require('./routes/notes');
app.use('/api/notes', notesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
