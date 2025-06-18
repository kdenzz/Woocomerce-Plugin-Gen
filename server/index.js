import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: 'llama3-70b-8192', // or 'llama3-8b-8192'
            messages: [
                {
                    role: 'system',
                    content: `You are a WordPress developer building WooCommerce mini plugins. Output only a secure, production-ready plugin in PHP.
                                Requirements:
                                - Use proper WP hooks.
                                - Do not include any explanation.
                                - No external dependencies.
                                - No markdown code
                                - No "'''" at start and end when giving code output
                                - Re-check syntax errors`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3
        });

        const code = response.choices[0].message.content;
        res.json({ code });
    } catch (err) {
        console.error('Groq error:', err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Groq + LLaMA3 server running at http://localhost:${PORT}`));
