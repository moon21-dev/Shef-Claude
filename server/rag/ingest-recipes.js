import { ChromaClient } from "chromadb";
import fs from "fs/promises";
import embeddings from "./embeddings.js";

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
});

async function ingestRecipes() {
    try {
        // 1. Read recipes.json
        const data = await fs.readFile(
            "./server/data/recipes.json",
            "utf-8"
        );

        const recipes = JSON.parse(data);

        console.log(`Loaded ${recipes.length} recipes`);

        // 2. Create/get a Chroma collection
        const collection = await client.getOrCreateCollection({
            name: "recipes",
            embeddingFunction: null,

        });

        // 3. Prepare recipe data
        const documents = recipes.map((recipe) => {
            return `
Recipe: ${recipe.name}

Ingredients:
${recipe.ingredients.join(", ")}

Cuisine: ${recipe.cuisine}
Difficulty: ${recipe.difficulty}
Cooking Time: ${recipe.cookingTime}

Instructions:
${recipe.instructions}
            `.trim();
        });

        // 4. Generate embeddings
        console.log("Generating embeddings...");

        const vectors = await embeddings.embedDocuments(documents);

        console.log("Embeddings generated!");

        // 5. Store everything in Chroma
        await collection.upsert({
            ids: recipes.map((recipe, index) => `recipe-${index}`),
            documents: documents,
            embeddings: vectors,
            metadatas: recipes.map((recipe) => ({
                name: recipe.name,
                cuisine: recipe.cuisine,
                difficulty: recipe.difficulty,
                cookingTime: recipe.cookingTime,
            })),
        });

        console.log("Recipes successfully stored in Chroma!");
    } catch (error) {
        console.error("Failed to ingest recipes:");
        console.error(error);
    }
}

ingestRecipes();