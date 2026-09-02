import { ChromaClient } from "chromadb";
import embeddings from "./embeddings.js";

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
});

export async function retrieveRecipes(query, nResults = 3) {
    try {
        // Get the recipes collection
        const collection = await client.getCollection({
            name: "recipes",
            embeddingFunction: null,

        });

        // Convert the user's query into an embedding
        const queryVector = await embeddings.embedQuery(query);

        // Search Chroma
        const results = await collection.query({
            queryEmbeddings: [queryVector],
            nResults,
        });

        // Return the retrieved recipes
        return results.documents[0] || [];

    } catch (error) {
        console.error("Recipe retrieval failed:");
        console.error(error);
        throw error;
    }
}