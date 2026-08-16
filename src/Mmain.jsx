import { useState } from 'react';

import ClaudeRecipe from './ClaudeRecipe';

import Ingredients from './Ingredient';

export default function Main() {
  const [ingredient, setIngredients] = useState([]);

  const [recipe, setRecipe] = useState('');
  async function showRecipe() {
    const response = await fetch('http://localhost:8000/api/recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients: ingredient,
      }),
    });

    const data = await response.json();

    console.log(data.recipe);
    setRecipe(data.recipe);
  }

  function addIngredient(event) {
    // event.preventDefault();
    // console.log('Hello from the server side');
    // const formData = new FormData(event.currentTarget);
    const newIngredient = event.get('ingredient');

    setIngredients((prevIngredient) => [...prevIngredient, newIngredient]);
  }

  return (
    <main>
      <form action={addIngredient} className="add-ingredients-form">
        <input
          type="text"
          name="ingredient"
          aria-label="Add ingredients"
          placeholder="e.g. oregano"
        />
        <button>Add ingredients</button>
      </form>
      {/* <ul>{listmap}</ul>  */}
      {ingredient.length > 0 && (
        <Ingredients listofIngredient={ingredient} toShow={showRecipe} />
      )}

      {recipe && <ClaudeRecipe recipe={recipe} />}
    </main>
  );
}
