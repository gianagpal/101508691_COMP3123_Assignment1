const express = require('express');
const path = require('path'); 
const cors = require('cors');    
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Base paths per assignment
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

// Centralized error handler (keeps error shape consistent)
app.use(errorHandler);

module.exports = app;
