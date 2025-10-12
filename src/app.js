const express = require('express');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

// Base paths per assignment
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

// Centralized error handler (keeps error shape consistent)
app.use(errorHandler);

module.exports = app;
