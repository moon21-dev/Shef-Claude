import { ChromaClient } from "chromadb";
import embeddings from "./embeddings.js";

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
});

async function searchRecipes(query) {
    try {
        // 1. Get our recipes collection
        const collection = await client.getCollection({
            name: "recipes",
        });

        // 2. Convert the user's query into an embedding
        const queryVector = await embeddings.embedQuery(query);

        // 3. Search Chroma for the most similar recipes
        const results = await collection.query({
            queryEmbeddings: [queryVector],
            nResults: 3,
        });

        // 4. Display the results
        console.log("\nSearch query:", query);
        console.log("\nMatching recipes:");

        results.documents[0].forEach((recipe, index) => {
            console.log(`\n--- Recipe ${index + 1} ---`);
            console.log(recipe);
        });

    } catch (error) {
        console.error("Recipe search failed:");
        console.error(error);
    }
}

// Test query
searchRecipes("I have potato, tomato and onion");