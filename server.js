const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();  // Import SQLite

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Set up SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.');
});

// Create a table to store data
db.run('CREATE TABLE uploads (id INTEGER PRIMARY KEY AUTOINCREMENT, make TEXT, model TEXT, badge TEXT, logbook TEXT)', (err) => {
    if (err) {
        console.error("Could not create table", err.message);
    }
});

app.post('/upload', (req, res) => {
    const { make, model, badge } = req.body;
    const logbook = req.files ? req.files.logbook.data.toString('utf8') : '';

    // Insert the submitted data into the SQLite database
    db.run(`INSERT INTO uploads (make, model, badge, logbook) VALUES (?, ?, ?, ?)`, [make, model, badge, logbook], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Fetch all the data from the database to send as response
        db.all('SELECT * FROM uploads', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });
});

app.get('/upload', (req, res) => {
    // Fetch all the submitted data from the SQLite database
    db.all('SELECT * FROM uploads', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
