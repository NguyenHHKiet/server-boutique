class Session {
    constructor(username, expiresAt) {
        this.username = username;
        this.expiresAt = expiresAt;
    }

    // Check if the session has expired
    isExpired() {
        return this.expiresAt < new Date();
    }
}

// Store user sessions (you can use a database for larger applications)
const sessions = {}; // req.session
// Handling Sign-In
app.post("/signin", (req, res) => {
    const { username, password } = req.body;

    // Validate credentials (for simplicity, use an in-memory object)
    if (users[username] === password) {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const session = new Session(username, expiresAt);
        sessions[sessionToken] = session;

        // Set the session token as a cookie
        res.cookie("session", sessionToken, { maxAge: 24 * 60 * 60 * 1000 });
        res.send("Logged in successfully!");
    } else {
        res.status(401).send("Invalid credentials");
    }
});

// Accessing Session Data
app.get("/welcome", (req, res) => {
    const sessionToken = req.cookies.session;

    // Look up the session and get user-specific data
    const session = sessions[sessionToken];
    if (session && !session.isExpired()) {
        res.send(`Welcome, ${session.username}!`);
    } else {
        res.status(401).send("Session expired or invalid");
    }
});
