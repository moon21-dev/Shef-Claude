import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import 'dotenv/config';
import {
    getRecipeFromAI,
    answerRecipeQuestion,
} from './aicall.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/recipe', async (req, res) => {
    try {
        const { ingredients } = req.body;

        const recipe = await getRecipeFromAI(ingredients);

        res.json({
            recipe: recipe,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Failed to generate recipe',
        });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { recipe, messages } = req.body;

        if (!recipe ||
            !Array.isArray(messages) || !messages) {
            return res.status(400).json({
                error: 'Recipe and question are required',
            });
        }

        const answer = await answerRecipeQuestion(
            recipe,
            messages
        );

        res.json({
            answer,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Failed to answer question',
        });
    }
});

app.listen(5000, () => {
    console.log('Backend running on port 5000');
});