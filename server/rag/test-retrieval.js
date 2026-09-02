import { retrieveRecipes } from "./retrieve-recipes.js";

async function testRetrieval() {
    try {
        const results = await retrieveRecipes(
            "I have potato, tomato and onion"
        );

        console.log("\nRetrieved recipes:");

        results.forEach((recipe, index) => {
            console.log(`\n--- Recipe ${index + 1} ---`);
            console.log(recipe);
        });

    } catch (error) {
        console.error("Test failed:", error);
    }
}

testRetrieval();