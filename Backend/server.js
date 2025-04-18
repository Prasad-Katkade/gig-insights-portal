import express from "express";
import fs from "fs";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // ⬅️ Needed to parse JSON body
app.use(session({
    secret: process.env.SESSION_SECRET || 'super-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true if using HTTPS
}));

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Load API key from .env
});

// Function to read data from data.json
const getData = () => {
    try {
        const data = fs.readFileSync("reddit-data.json", "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading data.json:", error);
        return [];
    }
};
const getPolicies = () => {
    try {
        const data = fs.readFileSync("policies.json", "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error policies data.json:", error);
        return [];
    }
};

// Function to summarize complaints using OpenAI API
const summarizeComplaints = async (complaints) => {
    try {
        const prompt = `Summarize the following customer complaints (Make sure it dosent contain anyone's name) in about 200 words:\n\n${JSON.stringify(
            complaints
        )}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful assistant that summarizes text efficiently." },
                { role: "user", content: prompt }
            ],
            max_tokens: 300,
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error summarizing complaints:", error);
        return "Failed to generate a summary.";
    }
};

const suggestPolicies = async (policies) => {
    try {
        const prompt = `Based on the given historical policies suggest good policies for the betterment of cab drivers, \n
        Ensure that the response is a valid JSON object with following property:
        - "suggestions": list of policies as array of strings (min 5 items).
       
         \npast policies:\n\n${JSON.stringify(
            policies
        )} `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a policy maker that suggests the policis efficiently." },
                { role: "user", content: prompt }
            ],
            max_tokens: 300,
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error summarizing complaints:", error);
        return "Failed to generate a summary.";
    }
};

const analyzeComplaints = async (complaints) => {
    try {
        const prompt = `Analyze the following customer complaints and identify only 5 major concerns. 
        Group complaints that share similar issues and provide an accurate count of how many complaints fall under each concern. 
        Ensure that the response is a valid JSON array where each item has:
        - "concern": A brief description of the issue.
        - "count": The number of complaints associated with this concern.
         
        Complaints data:\n\n${JSON.stringify(complaints)}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a data analyst extracting concerns from complaints." },
                { role: "user", content: prompt }
            ],
            max_tokens: 500, // Increase tokens to allow a full response
        });

        let responseText = completion.choices[0].message.content.trim();

        // Log raw response to debug issues
        console.log("Raw OpenAI Response:", responseText);

        // Remove Markdown formatting if present
        responseText = responseText.replace(/```json|```/g, "").trim();

        // Ensure JSON is complete before parsing
        if (!responseText.endsWith("]")) {
            console.error("Error: Response was cut off, retrying...");
            return [{ concern: "Error: OpenAI response was incomplete", count: 0 }];
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error("Error analyzing complaints:", error);
        return [{ concern: "Failed to analyze data", count: 0 }];
    }
};


// API to get all complaints
app.get("/complaints", (req, res) => {
    const complaints = getData();
    res.json(complaints);
});

// API to get summarized complaints
app.get("/summary", async (req, res) => {
    let data = getData();
    let complaints = [...data]
        .sort(() => 0.5 - Math.random())
        .slice(0, 50);

    if (complaints.length === 0) {
        return res.status(500).json({ error: "No complaints found." });
    }

    const summary = await summarizeComplaints(complaints.map((complaint => complaint.complaintTitle.split(":")[1])));
    res.json({ summary });
});

app.get("/policy-suggestions", async (req, res) => {
    const policies = getPolicies();
    if (policies.length === 0) {
        return res.status(500).json({ error: "No policy found." });
    }

    const summary = await suggestPolicies(policies);
    res.json({ summary });
});

app.get("/", (req, res) => {
    res.send("Server is working")
})


// API to get analytics (major concerns)
app.get("/analytics", async (req, res) => {
    let data = getData();
    let complaints = [...data]
        .sort(() => 0.5 - Math.random())
        .slice(0, 50);
    if (complaints.length === 0) {
        return res.status(500).json({ error: "No complaints found." });
    }

    const analytics = await analyzeComplaints(complaints.map((complaint => complaint.complaintTitle.split(":")[1])));
    res.json(analytics);
});

// Preload complaint context


app.post('/chat', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        let data = getData();
        let complaints = [...data]
            .sort(() => 0.5 - Math.random())
            .slice(0, 50);
        let complaintContext = complaints.map(c => `- ${c.complaintTitle.split(":")[1]}`)
        complaintContext = complaintContext.splice(29, complaints.length - 29).join(",")
        console.log("complaintContext\n", complaintContext);

        // Initialize history if not present
        if (!req.session.chatHistory) {
            req.session.chatHistory = [
                {
                    role: "system",
                    content: `You are a helpful policy maker analyzing gig worker complaints. These are the common issues:\n${complaintContext}`,
                }
            ];
        }

        // Add user's prompt
        req.session.chatHistory.push({ role: "user", content: prompt });

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: req.session.chatHistory,
        });

        const reply = completion.choices[0].message.content;

        // Add assistant response to session
        req.session.chatHistory.push({ role: "assistant", content: reply });

        res.json({ response: reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
