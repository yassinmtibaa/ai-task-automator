require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// API endpoint to process tasks
app.post('/api/process-task', async (req, res) => {
    try {
        const { task } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a highly capable AI assistant. The user will give you tasks to complete. Do your best to accomplish whatever they ask, whether it's creative writing, problem solving, data analysis, or other tasks. Provide detailed, helpful responses."
                },
                {
                    role: "user",
                    content: task
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });
        
        const result = completion.choices[0].message.content;
        
        res.json({
            success: true,
            result
        });
    } catch (error) {
        console.error('Error processing task:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});