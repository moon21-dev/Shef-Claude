# 🍳 Shef-Claude

**Shef-Claude** is an AI-powered recipe recommendation and cooking
assistant built with **React, Node.js, Express, LangChain, Hugging Face
embeddings, ChromaDB, and OpenRouter**.

The application lets users enter the ingredients they have available and
generates a recipe using a **Retrieval-Augmented Generation (RAG)**
pipeline. Instead of relying only on the language model's general
knowledge, Shef-Claude first retrieves relevant recipes from its recipe
knowledge base using vector similarity search and then gives those
recipes to the LLM as context.

After a recipe is generated, users can also ask follow-up questions
about that recipe through an AI cooking assistant.

------------------------------------------------------------------------

## 📌 What is Shef-Claude?

The idea behind Shef-Claude is simple:

> **Tell the application what ingredients you have, and let AI figure
> out what you can cook.**

For example, a user can enter:

``` text
potato
tomato
onion
```

Shef-Claude converts the user's query into an embedding, searches the
recipe knowledge base stored in ChromaDB, retrieves the most relevant
recipes, and passes that retrieved context along with the user's
ingredients to an LLM through OpenRouter.

The LLM then generates a recipe recommendation in Markdown format, which
is rendered in the React frontend.

The application also provides a **recipe-specific chatbot**, allowing
the user to ask questions such as:

-   "Can I replace butter?"
-   "What can I use instead of cream?"
-   "How long should I cook this?"
-   "Can I make this vegetarian?"

------------------------------------------------------------------------

## 🎯 Problem Statement

When people have a few ingredients at home, they often know what
ingredients they have but do not know what dish they can prepare with
them.

A normal LLM can generate recipes directly, but that approach has a
limitation: the response is based primarily on the model's internal
knowledge and generation.

Shef-Claude adds a small recipe knowledge base and a RAG pipeline so
that the AI can first retrieve recipes that are semantically relevant to
the user's ingredients.

This makes the project a practical demonstration of:

-   Large Language Models (LLMs)
-   Text embeddings
-   Vector databases
-   Semantic similarity search
-   Retrieval-Augmented Generation (RAG)
-   LangChain
-   AI API integration
-   Full-stack React + Node.js development

------------------------------------------------------------------------

## ✨ Features

### 🍅 Ingredient-based recipe generation

Users can add ingredients one at a time.

The application:

-   Converts ingredient names to lowercase
-   Removes unnecessary whitespace
-   Prevents duplicate ingredients
-   Displays the ingredients currently available
-   Sends the ingredient list to the backend
-   Generates a recipe using RAG + an LLM

### 👨‍🍳 Empty-state guidance

When no ingredients have been entered, the interface displays a friendly
message explaining that the user should add ingredients before
generating a recipe.

The message recommends having at least three ingredients while also
reminding users that common items such as salt, pepper, garlic, and
spices can count.

### 🧠 RAG-powered recipe generation

The application retrieves relevant recipes from ChromaDB before asking
the LLM to generate the final recipe.

### 🔎 Semantic recipe search

Recipes are represented as numerical vectors using the Hugging Face
embedding model:

``` text
sentence-transformers/all-MiniLM-L6-v2
```

The user's query is embedded using the same model, and ChromaDB performs
a similarity search.

### 💬 Recipe chatbot

After a recipe has been generated, the user can ask questions about it.

The chatbot receives:

-   The current recipe
-   The conversation messages
-   Relevant recipes retrieved from ChromaDB

The current recipe is prioritized when the question is specifically
about that recipe.

### 📝 Markdown recipe rendering

AI-generated responses are returned as Markdown and rendered in the
React UI using `react-markdown`.

### ⏳ Loading states

The frontend displays loading feedback while:

-   A recipe is being generated
-   A chatbot question is being processed

### ⚠️ Error handling

The application displays an error message if recipe generation or
chatbot requests fail.

### 🔐 Environment-based API keys

API keys are stored in environment variables rather than being
hard-coded into the frontend.

------------------------------------------------------------------------

# 🏗️ System Architecture

The application consists of three main parts:

1.  **React frontend**
2.  **Node.js + Express backend**
3.  **ChromaDB vector database running in Docker**

The AI services used by the backend are:

-   **OpenRouter** for LLM generation
-   **Hugging Face** for generating embeddings

High-level architecture:

``` text
                         SHEF-CLAUDE
                              │
               ┌──────────────┴──────────────┐
               │                             │
               ▼                             ▼
        React Frontend                Node.js + Express
        Vite Development              Backend :5000
             Server                         │
                                           │
                         ┌─────────────────┴─────────────────┐
                         │                                   │
                         ▼                                   ▼
                    ChromaDB                            OpenRouter
                  Docker :8000                              │
                         │                                   │
                         │                              LLM generation
                         │                                   │
                         └──────── Retrieved Context ─────────┘
```

The frontend communicates with the Express backend through HTTP
requests.

The backend communicates with:

-   ChromaDB for retrieval
-   Hugging Face for embeddings
-   OpenRouter for LLM generation

------------------------------------------------------------------------

# 🤖 AI Stack

## 1. LLM --- OpenRouter

The application uses the **OpenRouter SDK** to communicate with a
language model.

The configured model identifier is:

``` text
openrouter/free
```

This is important: the project does **not** hard-code a specific model
such as Claude, GPT, or Gemini. It uses OpenRouter's free-model routing.

Therefore, the README refers to the generation layer as:

> **OpenRouter (`openrouter/free`)**

rather than incorrectly claiming that the application uses one specific
underlying LLM.

The LLM is responsible for:

-   Generating recipe recommendations
-   Adapting retrieved recipes to the user's ingredients
-   Producing Markdown-formatted responses
-   Answering questions about the generated recipe
-   Providing practical cooking/substitution advice

The LLM is **not responsible for performing the vector search**.
Retrieval happens separately through ChromaDB.

------------------------------------------------------------------------

# 🧠 Vector Embeddings

## What are embeddings?

An embedding converts text into a numerical vector.

For example, text such as:

``` text
I have potato, tomato and onion
```

is converted into a vector containing many numerical values.

Conceptually:

``` text
"I have potato, tomato and onion"
                │
                ▼
        Embedding Model
                │
                ▼
       [0.12, -0.08, 0.31, ...]
```

The exact numerical values are not important to the application. What
matters is that semantically similar pieces of text tend to have vectors
that are close to one another in the embedding space.

This allows the application to perform **semantic similarity search**.

------------------------------------------------------------------------

## Embedding model used

Shef-Claude uses:

``` text
sentence-transformers/all-MiniLM-L6-v2
```

through LangChain's:

``` text
HuggingFaceInferenceEmbeddings
```

The implementation is located in:

``` text
server/rag/embeddings.js
```

The Hugging Face API key is supplied through:

``` env
HUGGINGFACEHUB_API_KEY=your_huggingface_api_key
```

------------------------------------------------------------------------

# 🗄️ ChromaDB

**ChromaDB** is the vector database used by Shef-Claude.

It stores:

-   Recipe documents
-   Their vector embeddings
-   Recipe metadata

The application uses a Chroma collection named:

``` text
recipes
```

ChromaDB is accessed from Node.js through the `chromadb` package.

The application connects to:

``` text
localhost:8000
```

------------------------------------------------------------------------

# 🐳 Why Docker is Used

Docker is used specifically to run the **ChromaDB server** locally.

The React frontend and Node.js backend are run directly on the host
machine, while ChromaDB runs as a Docker container.

Conceptually:

``` text
Your Computer
│
├── React / Vite
│
├── Node.js / Express
│
└── Docker
     │
     └── ChromaDB :8000
```

## What problem does Docker solve?

Without Docker, setting up a database service can require installing and
configuring that service directly on the operating system.

Docker provides an isolated and reproducible environment for ChromaDB.

This helps with:

-   Easier setup
-   Environment isolation
-   Reproducibility
-   Avoiding local installation conflicts
-   Keeping the vector database separate from the application code
-   Making it easier for another developer to run the same service

In this project, Docker is **not** used to containerize the entire
application. It is used to run the ChromaDB service.

------------------------------------------------------------------------

# 🔎 How RAG Works in Shef-Claude

RAG stands for:

> **Retrieval-Augmented Generation**

The basic idea is:

``` text
Retrieve useful information
            +
Give it to the LLM
            =
More context-aware generation
```

Shef-Claude implements this in two stages.

------------------------------------------------------------------------

## Stage 1 --- Building the Recipe Knowledge Base

The recipe data is stored in:

``` text
server/data/recipes.json
```

The current knowledge base contains **44 recipes**.

Each recipe contains information such as:

``` json
{
  "name": "Aloo Tomato Curry",
  "ingredients": ["potato", "tomato", "onion"],
  "cuisine": "Indian",
  "difficulty": "easy",
  "cookingTime": "30 minutes",
  "instructions": "..."
}
```

------------------------------------------------------------------------

## Stage 2 --- Creating Recipe Documents

The ingestion script:

``` text
server/rag/ingest-recipes.js
```

reads `recipes.json` and converts each recipe into a text document.

A recipe is represented approximately as:

``` text
Recipe: Aloo Tomato Curry

Ingredients:
potato, tomato, onion

Cuisine: Indian
Difficulty: easy
Cooking Time: 30 minutes

Instructions:
...
```

### Important implementation detail

The current project treats **each complete recipe as one document**.

It does not perform a separate paragraph/chunk splitting stage.

So the flow is:

``` text
One recipe
    ↓
One document
    ↓
One embedding
```

This is appropriate for the relatively small recipe knowledge base used
in this project.

------------------------------------------------------------------------

# 🔢 Generating Vector Embeddings

After the recipe documents are created, the application calls:

``` text
HuggingFaceInferenceEmbeddings
```

to generate embeddings for all recipe documents.

Conceptually:

``` text
Recipe Document
      │
      ▼
all-MiniLM-L6-v2
      │
      ▼
Numerical Vector
      │
      ▼
ChromaDB
```

The embeddings and recipe documents are then stored in the ChromaDB
`recipes` collection.

Recipe metadata such as:

-   Name
-   Cuisine
-   Difficulty
-   Cooking time

is also stored.

------------------------------------------------------------------------

# 🔍 Retrieval Process

When a user submits ingredients, the backend creates a query such as:

``` text
I have potato, tomato and onion
```

This query is converted into an embedding using the **same embedding
model**:

``` text
all-MiniLM-L6-v2
```

Then the query vector is sent to ChromaDB.

ChromaDB searches for the most similar recipe vectors.

The current implementation retrieves:

``` text
3 recipes
```

by default.

The relevant implementation is:

``` text
server/rag/retrieve-recipes.js
```

The retrieval flow is:

``` text
User Ingredients
       │
       ▼
"I have potato, tomato and onion"
       │
       ▼
Hugging Face Embedding Model
       │
       ▼
Query Vector
       │
       ▼
ChromaDB Similarity Search
       │
       ▼
Top 3 Relevant Recipes
```

------------------------------------------------------------------------

# 🤝 Retrieval + Generation

After the relevant recipes are retrieved, they are joined into a context
string.

The backend then sends the following information to OpenRouter:

1.  System instructions
2.  User ingredients
3.  Retrieved recipes

The LLM uses those retrieved recipes as context and generates the final
recommendation.

The important idea is:

``` text
             Retrieval
                │
                ▼
       Relevant Recipes
                │
                ▼
User Ingredients ────────┐
                         │
                         ▼
                    OpenRouter
                        LLM
                         │
                         ▼
                  Final Recipe
```

The LLM is instructed not to blindly copy the retrieved recipes.
Instead, it should adapt them to the user's available ingredients.

------------------------------------------------------------------------

# 💬 RAG-Powered Recipe Chatbot

Shef-Claude also contains a second RAG workflow for recipe-related
questions.

The frontend sends:

``` text
POST /api/chat
```

with:

-   The current recipe
-   The conversation messages

The backend retrieves the top three relevant recipes using the user's
latest question.

The LLM then receives:

``` text
Current Recipe
       +
Retrieved Recipes
       +
Conversation Messages
       ↓
    OpenRouter
       ↓
   AI Answer
```

The chatbot is instructed to:

-   Answer in the context of the current recipe
-   Prioritize the current recipe for recipe-specific questions
-   Use retrieved recipes when relevant
-   Avoid claiming that a recipe exists in the knowledge base unless it
    was retrieved
-   Give practical substitution and cooking advice
-   Maintain conversation context
-   Avoid creating a completely new recipe unless the user asks for one

This makes the chatbot more than a generic question-answering interface:
it is connected to the recipe generated for the current session and to
the recipe knowledge base.

------------------------------------------------------------------------

# 🔄 Complete Recipe Generation Flow

Here is the complete flow from the user's browser to the final recipe:

``` text
1. User enters ingredients
          │
          ▼
2. React stores ingredients in state
          │
          ▼
3. User clicks "Get a recipe"
          │
          ▼
4. React sends POST /api/recipe
          │
          ▼
5. Express receives the ingredient array
          │
          ▼
6. Backend creates a search query
   "I have potato, tomato and onion"
          │
          ▼
7. Query is converted into an embedding
          │
          ▼
8. ChromaDB searches the recipe vectors
          │
          ▼
9. Top 3 relevant recipes are retrieved
          │
          ▼
10. Retrieved recipes become LLM context
          │
          ▼
11. Ingredients + context are sent to OpenRouter
          │
          ▼
12. LLM generates a Markdown recipe
          │
          ▼
13. Express returns the recipe as JSON
          │
          ▼
14. React receives the response
          │
          ▼
15. ReactMarkdown renders the recipe
```

------------------------------------------------------------------------

# 🌐 API Endpoints

The Express backend currently exposes two main endpoints.

## `POST /api/recipe`

Generates a recipe from the user's ingredients.

### Request

``` json
{
  "ingredients": [
    "potato",
    "tomato",
    "onion"
  ]
}
```

### Response

``` json
{
  "recipe": "## Potato Tomato Curry\n\n..."
}
```

------------------------------------------------------------------------

## `POST /api/chat`

Answers a question about the currently generated recipe.

### Request

``` json
{
  "recipe": "## Potato Tomato Curry\n\n...",
  "messages": [
    {
      "role": "user",
      "content": "Can I replace butter with oil?"
    }
  ]
}
```

### Response

``` json
{
  "answer": "Yes, you can replace butter with oil..."
}
```

------------------------------------------------------------------------

# 🧪 Testing the API with Postman

You can test the recipe endpoint independently of the React frontend.

### Method

``` text
POST
```

### URL

``` text
http://localhost:5000/api/recipe
```

### Header

``` text
Content-Type: application/json
```

### Body

Select:

``` text
Body → raw → JSON
```

and use:

``` json
{
  "ingredients": [
    "potato",
    "tomato",
    "onion"
  ]
}
```

The backend should return a JSON response containing the generated
recipe.

------------------------------------------------------------------------

# 📁 Project Structure

``` text
Shef-Claude/
│
├── public/
│   ├── icons.svg
│   ├── images/
│   │   └── chef-claude-icon.png
│   └── favicon.svg
│
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── ClaudeRecipe.jsx
│   ├── Header.jsx
│   ├── Ingredient.jsx
│   ├── Mmain.jsx
│   ├── RecipeChat.jsx
│   ├── index.css
│   └── main.jsx
│
├── server/
│   ├── aicall.js
│   ├── server.js
│   │
│   ├── data/
│   │   └── recipes.json
│   │
│   └── rag/
│       ├── embeddings.js
│       ├── ingest-recipes.js
│       ├── retrieve-recipes.js
│       ├── search-recipes.js
│       ├── test-chroma.js
│       ├── test-embeddings.js
│       └── test-retrieval.js
│
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

------------------------------------------------------------------------

# 🧩 Important Files

## `src/Mmain.jsx`

Main frontend component.

Responsible for:

-   Ingredient state
-   Ingredient submission
-   Calling `/api/recipe`
-   Loading state
-   Error handling
-   Displaying the ingredient list
-   Displaying the generated recipe
-   Scrolling to the recipe area

------------------------------------------------------------------------

## `src/Ingredient.jsx`

Displays the ingredients currently available.

It also shows the option to generate a recipe once at least three
ingredients have been entered.

------------------------------------------------------------------------

## `src/ClaudeRecipe.jsx`

Displays the generated recipe using `ReactMarkdown`.

It also loads the recipe chatbot.

------------------------------------------------------------------------

## `src/RecipeChat.jsx`

Provides the conversational interface for asking questions about the
generated recipe.

It sends questions and conversation history to:

``` text
POST /api/chat
```

------------------------------------------------------------------------

## `server/server.js`

Express server responsible for:

-   Starting the backend
-   Enabling CORS
-   Parsing JSON requests
-   Handling `/api/recipe`
-   Handling `/api/chat`
-   Returning JSON responses

The backend runs on:

``` text
http://localhost:5000
```

------------------------------------------------------------------------

## `server/aicall.js`

Contains the AI generation logic.

It:

-   Connects to OpenRouter
-   Calls the recipe retrieval function
-   Builds the recipe context
-   Sends the context and user ingredients to the LLM
-   Handles recipe chatbot questions

------------------------------------------------------------------------

## `server/rag/embeddings.js`

Creates the Hugging Face embedding model:

``` text
sentence-transformers/all-MiniLM-L6-v2
```

------------------------------------------------------------------------

## `server/rag/ingest-recipes.js`

Responsible for building the vector knowledge base.

It:

1.  Reads `recipes.json`
2.  Converts recipes into documents
3.  Generates embeddings
4.  Creates/gets the Chroma collection
5.  Stores documents, vectors, and metadata

------------------------------------------------------------------------

## `server/rag/retrieve-recipes.js`

Responsible for runtime retrieval.

It:

1.  Receives a text query
2.  Generates a query embedding
3.  Searches ChromaDB
4.  Returns the retrieved recipe documents

------------------------------------------------------------------------

## `server/data/recipes.json`

The application's recipe knowledge base.

It currently contains **44 recipes** spanning Indian and international
cuisines.

------------------------------------------------------------------------

# 🛠️ Technology Stack

## Frontend

-   React 19
-   JavaScript
-   HTML5
-   CSS3
-   Vite
-   React Markdown

## Backend

-   Node.js
-   Express 5
-   CORS
-   dotenv

## AI / RAG

-   OpenRouter SDK
-   OpenRouter `openrouter/free`
-   LangChain
-   Hugging Face Inference
-   `sentence-transformers/all-MiniLM-L6-v2`
-   ChromaDB

## Development Tools

-   npm
-   Git
-   GitHub
-   Docker
-   Postman

------------------------------------------------------------------------

# 🔐 Environment Variables

The backend requires two API keys.

Create a `.env` file in the project root:

``` env
OPENROUTER_API_KEY=your_openrouter_api_key
HUGGINGFACEHUB_API_KEY=your_huggingface_api_key
```

### OpenRouter

Used for LLM generation.

``` env
OPENROUTER_API_KEY=...
```

### Hugging Face

Used for generating recipe and query embeddings.

``` env
HUGGINGFACEHUB_API_KEY=...
```

> **Never commit your real `.env` file or API keys to GitHub.**

The project already includes `.env` in `.gitignore`.

For a public repository, you can create an `.env.example` file
containing placeholders:

``` env
OPENROUTER_API_KEY=your_openrouter_api_key
HUGGINGFACEHUB_API_KEY=your_huggingface_api_key
```

------------------------------------------------------------------------

# 🚀 Running Shef-Claude Locally

## Prerequisites

Make sure you have installed:

-   Node.js
-   npm
-   Docker Desktop
-   Git

You also need API keys from:

-   OpenRouter
-   Hugging Face

------------------------------------------------------------------------

## 1. Clone the repository

``` bash
git clone https://github.com/YOUR_USERNAME/shef-claude.git
```

Move into the project:

``` bash
cd shef-claude
```

------------------------------------------------------------------------

## 2. Install dependencies

From the project root:

``` bash
npm install
```

This installs both the frontend dependencies and the backend
dependencies because they are managed by the project's root
`package.json`.

------------------------------------------------------------------------

## 3. Configure environment variables

Create:

``` text
.env
```

in the project root.

Add:

``` env
OPENROUTER_API_KEY=your_openrouter_api_key
HUGGINGFACEHUB_API_KEY=your_huggingface_api_key
```

------------------------------------------------------------------------

# 🐳 4. Start ChromaDB with Docker

ChromaDB must be running on:

``` text
localhost:8000
```

The Node.js backend is configured to connect to:

``` text
host: localhost
port: 8000
```

Start a ChromaDB Docker container and expose port `8000`.

A typical Docker setup is:

``` bash
docker run -d -p 8000:8000 chromadb/chroma
```

You can verify that the container is running with:

``` bash
docker ps
```

The project also includes a Chroma connection test:

``` bash
node server/rag/test-chroma.js
```

A successful connection prints a message indicating that Chroma is
working.

> If the Chroma Docker image or its startup command changes in a future
> version, check the current ChromaDB documentation for the
> corresponding image/command.

------------------------------------------------------------------------

# 📚 5. Ingest the recipes into ChromaDB

Before generating recipes for the first time, populate the ChromaDB
collection.

Run:

``` bash
node server/rag/ingest-recipes.js
```

This script:

``` text
recipes.json
     ↓
Recipe Documents
     ↓
Hugging Face Embeddings
     ↓
ChromaDB
```

You should see messages indicating that the recipes were loaded,
embeddings were generated, and the recipes were stored in Chroma.

If the Chroma collection is recreated or its data is removed, run the
ingestion script again.

------------------------------------------------------------------------

# 🧪 6. Test the embedding system

You can test whether the Hugging Face embedding service is working:

``` bash
node server/rag/test-embeddings.js
```

The test generates an embedding for:

``` text
I have potato, tomato and onion
```

and prints information about the resulting vector.

------------------------------------------------------------------------

# 🔎 7. Test retrieval

To test whether semantic retrieval is working:

``` bash
node server/rag/test-retrieval.js
```

This performs a search for:

``` text
I have potato, tomato and onion
```

and prints the retrieved recipes.

You can also use:

``` bash
node server/rag/search-recipes.js
```

for a similar retrieval test.

------------------------------------------------------------------------

# 🟢 8. Start the backend

Open a terminal in the project root and run:

``` bash
node server/server.js
```

The backend should start on:

``` text
http://localhost:5000
```

You should see:

``` text
Backend running on port 5000
```

Keep this terminal running.

------------------------------------------------------------------------

# ⚛️ 9. Start the frontend

Open another terminal in the project root:

``` bash
npm run dev
```

Vite will provide a local development URL, normally similar to:

``` text
http://localhost:5173
```

Open the displayed URL in your browser.

------------------------------------------------------------------------

# ▶️ Complete Local Setup

The complete setup requires three running pieces:

### Terminal 1 --- ChromaDB

``` bash
docker run -d -p 8000:8000 chromadb/chroma
```

### Terminal 2 --- Backend

``` bash
node server/server.js
```

### Terminal 3 --- Frontend

``` bash
npm run dev
```

Before using recipe generation for the first time, make sure the recipe
data has been ingested:

``` bash
node server/rag/ingest-recipes.js
```

The final architecture on your machine is:

``` text
Browser
   │
   ▼
React / Vite :5173
   │
   │ HTTP
   ▼
Express Backend :5000
   │
   ├──────────────► OpenRouter
   │                  │
   │                  ▼
   │                 LLM
   │
   └──────────────► ChromaDB :8000
                       │
                       ▼
                    Docker
```

------------------------------------------------------------------------

# 🧪 Useful Development Commands

### Start frontend

``` bash
npm run dev
```

### Build frontend

``` bash
npm run build
```

### Preview production build

``` bash
npm run preview
```

### Run ESLint

``` bash
npm run lint
```

### Start backend

``` bash
node server/server.js
```

### Ingest recipes

``` bash
node server/rag/ingest-recipes.js
```

### Test ChromaDB

``` bash
node server/rag/test-chroma.js
```

### Test embeddings

``` bash
node server/rag/test-embeddings.js
```

### Test retrieval

``` bash
node server/rag/test-retrieval.js
```

------------------------------------------------------------------------

# 🆚 Normal LLM vs RAG in This Project

A simple AI recipe generator could work like this:

``` text
Ingredients
     ↓
LLM
     ↓
Recipe
```

Shef-Claude adds a retrieval layer:

``` text
Ingredients
     ↓
Embedding
     ↓
ChromaDB
     ↓
Relevant Recipes
     ↓
LLM + Retrieved Context
     ↓
Recipe
```

The advantage of this architecture is that the model receives
information from the application's own recipe knowledge base before
generating the answer.

This also makes the knowledge source easier to update: new recipes can
be added to `recipes.json`, embedded, and ingested into ChromaDB.

------------------------------------------------------------------------

# 📈 Current Knowledge Base

The application currently contains:

``` text
44 recipes
```

The recipes include a mixture of:

-   Indian cuisine
-   Italian cuisine
-   Greek cuisine
-   Middle Eastern cuisine
-   Chinese cuisine
-   Japanese cuisine
-   Thai cuisine
-   Mexican cuisine

Examples include:

-   Aloo Tomato Curry
-   Paneer Butter Masala
-   Vegetable Fried Rice
-   Aloo Gobi
-   Chana Masala
-   Dal Tadka
-   Vegetable Pasta
-   Palak Paneer
-   Chicken Curry
-   Margherita Pizza
-   Risotto Primavera
-   Greek Salad
-   Hummus with Pita
-   Chicken Teriyaki
-   Thai Green Curry
-   Shakshuka
-   Butter Chicken
-   Masala Dosa
-   Vegetable Biryani

------------------------------------------------------------------------

# ⚠️ Current Limitations

Shef-Claude is a small educational/full-stack RAG project, so there are
some limitations.

### 1. Small knowledge base

The application currently uses 44 recipes. A larger production knowledge
base would require more extensive data preparation and evaluation.

### 2. Fixed retrieval count

The current retrieval function normally returns the top 3 recipes.

### 3. No advanced filtering

The current implementation does not expose filters for:

-   Dietary restrictions
-   Allergies
-   Maximum cooking time
-   Difficulty
-   Cuisine

### 4. External AI dependencies

Recipe generation and embedding generation depend on external APIs:

-   OpenRouter
-   Hugging Face

Therefore, valid API keys and network connectivity are required.

### 5. Local ChromaDB

ChromaDB currently runs locally through Docker rather than as a deployed
production database.

### 6. No authentication

There is currently no user authentication or account system.

### 7. No persistent user recipe history

Generated recipes are not currently stored as user-specific history.

------------------------------------------------------------------------

# 🔮 Future Improvements

Possible improvements include:

-   Add authentication
-   Save recipe history
-   Favorite recipes
-   Dietary preference support
-   Allergy-aware recipe generation
-   Cuisine filters
-   Cooking-time filters
-   Difficulty filters
-   Ingredient quantity input
-   Recipe images
-   Voice-based ingredient input
-   Better recipe evaluation
-   Larger knowledge base
-   Production vector database
-   Streaming LLM responses
-   Deployment of frontend and backend
-   Dockerize the complete application
-   Add automated tests
-   Add monitoring and logging

------------------------------------------------------------------------

# 🔒 Security Notes

API keys must remain private.

Never put real API keys directly into:

-   React source code
-   GitHub repositories
-   README files
-   Screenshots
-   Client-side environment variables that are exposed to the browser

Use backend environment variables instead:

``` env
OPENROUTER_API_KEY=...
HUGGINGFACEHUB_API_KEY=...
```

If an API key is ever accidentally committed to a public repository,
revoke/rotate it immediately.

------------------------------------------------------------------------

# 🎓 What This Project Demonstrates

Shef-Claude demonstrates the complete basic architecture of a modern RAG
application:

``` text
Knowledge Base
      ↓
Document Preparation
      ↓
Embeddings
      ↓
Vector Database
      ↓
Semantic Retrieval
      ↓
Retrieved Context
      ↓
LLM
      ↓
Generated Response
```

It also demonstrates how an AI system can be integrated into a
traditional full-stack application:

``` text
React
  +
Node.js / Express
  +
LangChain
  +
Hugging Face Embeddings
  +
ChromaDB
  +
OpenRouter
  =
AI-powered RAG Web Application
```

------------------------------------------------------------------------

# 📄 License

This project is licensed under the license included in the repository.

------------------------------------------------------------------------

# 👨‍💻 Author

**Shefali**

Built as a hands-on project to explore:

-   React
-   Node.js
-   Express
-   LangChain
-   RAG
-   Vector embeddings
-   ChromaDB
-   OpenRouter
-   Hugging Face
-   Docker
-   AI application development

------------------------------------------------------------------------

## ⭐ If you found the project interesting, consider giving the repository a star!
