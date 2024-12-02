/**
 * @file appmongoose.js
 * @description This file contains a starter implementation of a RESTful API for managing student records using MongoDB.
 * @version 1.0.0
 * @date 2024-11-20
 * @author pedromoreira
 * @organization ESTG-IPVC
 */

// mongoose setup
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the Student schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    study: { type: String, required: true },
});

// Create the Student model
const Student = mongoose.model('Student', studentSchema);

// CRUD endpoints

/// Get all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch students' });
    }
});
// Get a student by ID
app.get('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch student', details: err.message });
    }
});

// Add a new student
app.post('/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add student' });
    }
});

// Update a student by ID
app.put('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedStudent) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.send(updatedStudent);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update student' });
    }
});

// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.send({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete student' });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
