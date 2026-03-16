require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');

// Debugging: This will print your URI to the console (remove this once fixed!)
console.log("DEBUG: MONGODB_URI is:", process.env.MONGODB_URI);

const app = express();

// 2. Logic to prevent the crash
const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 8080;

if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGODB_URI is not defined in environment variables.");
    process.exit(1); // Stop the server immediately if DB URI is missing
}

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.get('/api/status', (req, res) => {
    res.json({ status: "Online", db: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" });
});

// 4. Serve Static Frontend (Production)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));