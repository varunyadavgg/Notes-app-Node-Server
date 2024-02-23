const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const NOTES_FILE = './notes/notes-8/notes.json';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS Middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Load notes from the JSON file
function loadNotes() {
    try {
        const data = fs.readFileSync(NOTES_FILE);
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading notes file:', err);
        return {};
    }
}

// Save notes to the JSON file
function saveNotes(notes) {
    try {
        const data = JSON.stringify(notes, null, 2);
        fs.writeFileSync(NOTES_FILE, data);
    } catch (err) {
        console.error('Error saving notes:', err);
    }
}

// Add or update a note
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

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files (CSS, JS)
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
