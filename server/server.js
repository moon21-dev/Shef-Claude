import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import 'dotenv/config';
import { getRecipeFromAI } from './aicall.js';

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

app.listen(8000, () => {
    console.log('Backend running on port 8000');
});