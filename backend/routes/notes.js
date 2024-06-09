const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Crear una nota
router.post('/', async (req, res) => {
    const newNote = new Note({
        title: req.body.title,
        content: req.body.content
    });

    try {
        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (err) {
        res.json({ message: err });
    }
});

// Obtener todas las notas
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.json({ message: err });
    }
});

// Actualizar una nota


// Actualizar una nota por su ID
router.put('/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params; // Obtener el ID de la nota desde los parámetros de la URL
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            {
                title: req.body.title,
                content: req.body.content
            },
            { new: true }
        );
        
        if (!updatedNote) {
            return res.status(404).json({ message: 'Nota no encontrada' });
        }

        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Eliminar una nota
router.delete('/:noteId', async (req, res) => {
    try {
        const removedNote = await Note.findByIdAndDelete(req.params.noteId);
        res.json(removedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
