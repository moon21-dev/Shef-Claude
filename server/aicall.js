import "dotenv/config";
import { OpenRouter } from "@openrouter/sdk";
import { retrieveRecipes } from "./rag/retrieve-recipes.js";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has
and suggests a recipe they could make with some or all of those ingredients.

You don't need to use every ingredient they mention in your recipe.

The recipe can include additional ingredients they didn't mention,
but try not to include too many extra ingredients.

You will also receive recipes retrieved from a recipe knowledge base.

Use the retrieved recipes as helpful context when generating your answer.
Do not blindly copy them. Adapt the recipe to the user's ingredients.

Format your response in markdown to make it easier to render to a web page.
`;

const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function getRecipeFromAI(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");

    try {
        // 1. Retrieve relevant recipes from Chroma
        const relevantRecipes = await retrieveRecipes(
            `I have ${ingredientsString}`
        );

        // 2. Convert retrieved recipes into context for the AI
        const recipeContext = relevantRecipes.join("\n\n---\n\n");

        console.log("\nRetrieved recipes for AI:");
        console.log(recipeContext);

        // 3. Send ingredients + retrieved context to OpenRouter
        const response = await openrouter.chat.send({
            chatRequest: {
                model: "openrouter/free",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT,
                    },
                    {
                        role: "user",
                        content: `
I have these ingredients:

${ingredientsString}

Here are some relevant recipes from the recipe knowledge base:

${recipeContext}

Using my ingredients and the retrieved recipes as context,
please recommend a recipe I can make.
                        `,
                    },
                ],
            },
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


export async function answerRecipeQuestion(recipe, messages) {
    try {
        // Get the latest user question
        const latestMessage = messages[messages.length - 1];

        const userQuestion = latestMessage.content;

        // Retrieve relevant recipes from Chroma
        const relevantRecipes = await retrieveRecipes(
            userQuestion,
            3
        );

        const recipeContext = relevantRecipes.join(
            "\n\n---\n\n"
        );

        console.log("\nRetrieved recipes for chatbot:");
        console.log(recipeContext);

        const response = await openrouter.chat.send({
            chatRequest: {
                model: "openrouter/free",

                messages: [
                    {
                        role: "system",
                        content: `
You are a helpful cooking assistant.

The user is currently discussing the recipe below.

CURRENT RECIPE:
${recipe}

You also have access to recipes retrieved from the recipe knowledge base.

RETRIEVED RECIPES:
${recipeContext}

Use the retrieved recipes when they are relevant to the user's question.

Important rules:

1. Answer the user's question in the context of the current recipe.
2. Use the retrieved recipes as additional knowledge when relevant.
3. Do not claim that a recipe exists in the knowledge base unless it appears in the retrieved recipes.
4. If the question is about the current recipe, prioritize the current recipe.
5. Maintain the conversation context.
6. For substitutions or cooking modifications, provide practical advice.
7. Do not create a completely new recipe unless the user asks for one.
8. If the retrieved recipes are not relevant, simply answer using the current recipe and general cooking knowledge.
9. Keep the answer clear and concise.
                        `,
                    },

                    ...messages,
                ],
            },
        });

        return response.choices[0].message.content;

    } catch (err) {
        console.error(err);
        throw err;
    }
}




// /* eslint-disable no-undef */
// import 'dotenv/config';
// import { OpenRouter } from '@openrouter/sdk';

// const SYSTEM_PROMPT = `
// You are an assistant that receives a list of ingredients that a user has
// and suggests a recipe they could make with some or all of those ingredients.

// You don't need to use every ingredient they mention in your recipe.

// The recipe can include additional ingredients they didn't mention,
// but try not to include too many extra ingredients.

// Format your response in markdown to make it easier to render to a web page.
// `;

// const openrouter = new OpenRouter({
//     apiKey: process.env.OPENROUTER_API_KEY,
// });

// export async function getRecipeFromAI(ingredientsArr) {
//     const ingredientsString = ingredientsArr.join(', ');

//     try {
//         const response = await openrouter.chat.send({
//             chatRequest: {
//                 model: 'openrouter/free',
//                 messages: [
//                     {
//                         role: 'system',
//                         content: SYSTEM_PROMPT,
//                     },
//                     {
//                         role: 'user',
//                         content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
//                     },
//                 ],
//             },
//         });

//         return response.choices[0].message.content;
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }
// // /* eslint-disable no-undef */
// // import 'dotenv/config';
// // import { InferenceClient } from '@huggingface/inference';

// // const SYSTEM_PROMPT = `
// // You are an assistant that receives a list of ingredients that a user has
// // and suggests a recipe they could make with some or all of those ingredients.

// // You don't need to use every ingredient they mention in your recipe.

// // The recipe can include additional ingredients they didn't mention,
// // but try not to include too many extra ingredients.

// // Format your response in markdown to make it easier to render to a web page.
// // `;

// // const hf = new InferenceClient(
// //     process.env.Shef_Claude
// // );

// // export async function getRecipeFromAI(ingredientsArr) {
// //     const ingredientsString = ingredientsArr.join(', ');

// //     try {
// //         const response = await hf.chatCompletion({
// //             model: 'Qwen/Qwen2.5-7B-Instruct',
// //             provider: 'together',
// //             messages: [
// //                 {
// //                     role: 'system',
// //                     content: SYSTEM_PROMPT,
// //                 },
// //                 {
// //                     role: 'user',
// //                     content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
// //                 },
// //             ],
// //             max_tokens: 1024,
// //         });

// //         return response.choices[0].message.content;
// //     } catch (err) {
// //         // console.dir(err.httpResponse?.body, { depth: null });
// //         // console.error(err);
// //         console.log(
// //             JSON.stringify(err.httpResponse?.body, null, 2)
// //         );
// //         throw err;
// //     }
// // }