/**
 * @file appmongodb.js
 * @description This file contains a starter implementation of a RESTful API for managing student records using MongoDB.
 * @version 1.0.0
 * @date 2024-11-20
 * @author pedromoreira
 * @organization ESTG-IPVC
 */

// mongodb native driver setup
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

const url = 'mongodb://localhost:27017';
const dbName = 'studentsdb';
let db;


// Start the server
async function startServer() {
    try {
        const client = await MongoClient.connect(url);
        db = client.db(dbName);
        console.log('Connected to MongoDB');

        // middleware to use connection in every route
        function setCollection(req, res, next) {
            req.collection = db.collection('students');
            next();
        };
        app.use(setCollection);


        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

await startServer();

// CRUD endpoints


// Get a student by ID
app.get('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const student = await db.collection('students').findOne({ _id: new ObjectId(id) });
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch student', details: err.message });
    }
});

// Get all students
app.get('/students', async (req, res) => {
    try {
        const students = await db.collection('students').find().toArray();
        res.json(students);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch students' });
    }
});

// Add a new student
app.post('/students', async (req, res) => {
    try {
        const student = req.body;
        const result = await db.collection('students').insertOne(student);
        res.status(201).json({ _id: result.insertedId, ...student });
    } catch (err) {
        res.status(500).send({ error: 'Failed to add student' });
    }
});

// Update a student by ID
app.put('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const result = await db.collection('students').updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.send({ message: 'Student updated successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to update student' });
    }
});

// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.collection('students').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.send({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete student' });
    }
});
