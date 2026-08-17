import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import db from "./db.js";

// Users table requires: title, location, github_url, bio (nullable VARCHAR/TEXT columns)
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Pronet backend is running"
    });
});


app.post("/api/auth/register", async (req, res) => {
    try {
        const { user_name, email, password, title, location, github_url, bio } = req.body;

        if (!user_name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const [existingUsers] = await db.execute(
            "SELECT * FROM Users WHERE email = ? OR user_name = ?",
            [email, user_name]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            "INSERT INTO Users (user_name, email, password, title, location, github_url, bio) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [user_name, email, hashedPassword, title || null, location || null, github_url || null, bio || null]
        );

        res.status(201).json({
            message: "Account created successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const [users] = await db.execute(
            "SELECT * FROM Users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                user_name: user.user_name,
                email: user.email,
                title: user.title,
                location: user.location,
                github_url: user.github_url,
                bio: user.bio
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


const PORT = process.env.PORT || 5000;

app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM Users");

        res.json(rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
});

app.get("/api/users/:user_name/projects", async (req, res) => {
    try {
        const userName = req.params.user_name;

        const [projects] = await db.execute(
            "SELECT * FROM Projects WHERE owner_id = ?",
            [userName]
        );

        res.json(projects);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch projects"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Pronet backend running on http://localhost:${PORT}`);
});

