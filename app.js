const express = require('express');
const mysql = require('mysql2');
const app = express();

// 1. Set view engine
app.set('view engine', 'ejs');

// 2. Enable static files
app.use(express.static('public'));

// 3. Enable form processing middleware (required for POST)
app.use(express.urlencoded({ extended: false }));

// 4. Set up MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shawn_t0070863h', 
    database: 'c237_studentlistapp'
});

// --- ROUTES ---

// Route 1: Display all students
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM student';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error Retrieving students');
        }
        res.render('index', { students: results });
    });
});

// Route 2: Display the "Add New Student" form
app.get('/addStudent', (req, res) => {
    res.render('addStudent');
});

// Route 3: Handle form submission to add a new student
app.post('/addStudent', (req, res) => {
    // Extract data from the form
    const { name, dob, contact, image } = req.body;
    const sql = 'INSERT INTO student (name, dob, contact, image) VALUES (?, ?, ?, ?)';
    
    connection.query(sql, [name, dob, contact, image], (error, results) => {
        if (error) {
            console.error("Error adding student:", error);
            return res.send('Error adding student');
        } else {
            res.redirect('/'); // Send user back to the home page
        }
    });
});

// Route 4: Display details of a single student
app.get('/student/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'SELECT * FROM student WHERE studentId = ?';
    connection.query(sql, [studentId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error retrieving student by ID');
        }
        if (results.length > 0) {
            res.render('student', { student: results[0] });
        } else {
            res.send('Student not found');
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});