const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Adjust the port to match your Render service settings
const NOTES_FILE = 'notes.json';

// Increase the payload limit for URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

// CORS Middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Function to load notes from the JSON file
function loadNotes() {
    try {
        const data = fs.readFileSync(NOTES_FILE);
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading notes file:', err);
        return {};
    }
}

// Function to save notes to the JSON file
function saveNotes(notes) {
    try {
        const data = JSON.stringify(notes, null, 2);
        fs.writeFileSync(NOTES_FILE, data);
    } catch (err) {
        console.error('Error saving notes:', err);
    }
}

// Route to add or update a note
app.post('/add-note', (req, res) => {
    const { subject, chapter, subheading, content } = req.body;

    const notes = loadNotes();

    if (!notes[subject]) {
        notes[subject] = {};
    }
    if (!notes[subject][chapter]) {
        notes[subject][chapter] = {};
    }

    notes[subject][chapter][subheading] = content;

    saveNotes(notes);

    res.send('Note added successfully');
});

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware to serve static files from 'public' directory
app.use(express.static('public'));

// Route to serve the `notes.json` file directly
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, NOTES_FILE)); // Ensure the path matches your directory structure
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
