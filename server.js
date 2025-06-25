const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// In-memory storage (replace with database in production)
let donors = [];
let recipients = [];
let matches = [];

// Helper function to calculate compatibility score
function calculateCompatibilityScore(donor, recipient) {
    let score = 0;
    
    // Blood type compatibility (most important - 60 points)
    if (isBloodTypeCompatible(donor.blood_type, recipient.blood_type)) {
        score += 60;
    }
    
    // Organ match (essential - 30 points)
    if (donor.organ === recipient.organ) {
        score += 30;
    }
    
    // Age factor (10 points max)
    if (donor.age && recipient.age) {
        const ageDiff = Math.abs(donor.age - recipient.age);
        if (ageDiff <= 10) score += 10;
        else if (ageDiff <= 20) score += 5;
    }
    
    return Math.min(score, 100);
}

// Blood type compatibility checker
function isBloodTypeCompatible(donorType, recipientType) {
    const compatibility = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+']
    };
    
    return compatibility[donorType]?.includes(recipientType) || false;
}

// Find matches between donors and recipients
function findMatches() {
    matches = [];
    let matchId = 1;
    
    donors.forEach(donor => {
        recipients.forEach(recipient => {
            const score = calculateCompatibilityScore(donor, recipient);
            if (score >= 60) { // Only consider matches with 60% or higher compatibility
                matches.push({
                    id: matchId++,
                    donor: donor,
                    recipient: recipient,
                    score: score,
                    created_at: new Date().toISOString()
                });
            }
        });
    });
    
    // Sort by score (highest first) and urgency
    matches.sort((a, b) => {
        // First sort by urgency
        const urgencyWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
        const urgencyDiff = (urgencyWeight[b.recipient.urgency] || 0) - (urgencyWeight[a.recipient.urgency] || 0);
        if (urgencyDiff !== 0) return urgencyDiff;
        
        // Then by compatibility score
        return b.score - a.score;
    });
}

// API Routes

// Get all donors
app.get('/api/donors', (req, res) => {
    res.json(donors);
});

// Register a new donor
app.post('/api/donors', (req, res) => {
    try {
        const { name, age, blood_type, organ, phone, email } = req.body;
        
        // Validation
        if (!name || !age || !blood_type || !organ) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, age, blood_type, organ' 
            });
        }
        
        if (age < 18 || age > 65) {
            return res.status(400).json({ 
                error: 'Donor age must be between 18 and 65 years' 
            });
        }
        
        const donor = {
            id: donors.length + 1,
            name: name.trim(),
            age: parseInt(age),
            blood_type,
            organ,
            phone: phone || '',
            email: email || '',
            registered_at: new Date().toISOString()
        };
        
        donors.push(donor);
        findMatches(); // Recalculate matches
        
        res.status(201).json({
            message: 'Donor registered successfully!',
            donor: donor
        });
    } catch (error) {
        console.error('Error registering donor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all recipients
app.get('/api/recipients', (req, res) => {
    res.json(recipients);
});

// Register a new recipient
app.post('/api/recipients', (req, res) => {
    try {
        const { name, age, blood_type, organ, urgency, phone, email } = req.body;
        
        // Validation
        if (!name || !age || !blood_type || !organ || !urgency) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, age, blood_type, organ, urgency' 
            });
        }
        
        if (age < 1 || age > 80) {
            return res.status(400).json({ 
                error: 'Recipient age must be between 1 and 80 years' 
            });
        }
        
        const recipient = {
            id: recipients.length + 1,
            name: name.trim(),
            age: parseInt(age),
            blood_type,
            organ,
            urgency,
            phone: phone || '',
            email: email || '',
            registered_at: new Date().toISOString()
        };
        
        recipients.push(recipient);
        findMatches(); // Recalculate matches
        
        res.status(201).json({
            message: 'Recipient registered successfully!',
            recipient: recipient
        });
    } catch (error) {
        console.error('Error registering recipient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all matches
app.get('/api/matches', (req, res) => {
    res.json(matches);
});

// Get statistics
app.get('/api/stats', (req, res) => {
    res.json({
        donors: donors.length,
        recipients: recipients.length,
        matches: matches.length
    });
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/donor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'donor.html'));
});

app.get('/recipient', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'recipient.html'));
});

app.get('/matches', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'matches.html'));
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Prandaan Connect server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/matches`);
    console.log(`👥 Register Donor: http://localhost:${PORT}/donor`);
    console.log(`🫀 Register Recipient: http://localhost:${PORT}/recipient`);
});

module.exports = app;