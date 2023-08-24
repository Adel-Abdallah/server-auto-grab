const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Temp storage for the last submitted data
let lastSubmittedData = {};

app.post('/upload', (req, res) => {
    const { make, model, badge } = req.body;
    const logbook = req.files ? req.files.logbook.data.toString('utf8') : '';

    // Store the submitted data
    lastSubmittedData = {
        make,
        model,
        badge,
        logbook
    };
    
    res.json(lastSubmittedData);
});

app.get('/upload', (req, res) => {
    // Convert the last submitted data to text and send it
    res.send(JSON.stringify(lastSubmittedData, null, 2));
});

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
