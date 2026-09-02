import { useState, useRef, useEffect } from 'react';

import ClaudeRecipe from './ClaudeRecipe';

import Ingredients from './Ingredient';

export default function Main() {
  const [ingredient, setIngredients] = useState([]);

  const [recipe, setRecipe] = useState('');

  const recipeSection = useRef(null);

  useEffect(() => {
    if (recipe != '' && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView();
    }
  }, [recipe]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function showRecipe() {
    setLoading(true);
    setError('');
    setRecipe('');
    try {
      const response = await fetch('http://localhost:5000/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredient,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

      setRecipe(data.recipe);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  // async function showRecipe() {
  //   const response = await fetch('http://localhost:5000/api/recipe', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       ingredients: ingredient,
  //     }),
  //   });

  //   const data = await response.json();

  //   console.log(data.recipe);
  //   setRecipe(data.recipe);
  // }

  function addIngredient(event) {
    const newIngredient = event.get('ingredient').trim().toLowerCase();

    if (!newIngredient) return;

    setIngredients((prevIngredients) => {
      if (prevIngredients.includes(newIngredient)) {
        return prevIngredients;
      }

      return [...prevIngredients, newIngredient];
    });
  }

  // function addIngredient(event) {
  //   // event.preventDefault();
  //   // console.log('Hello from the server side');
  //   // const formData = new FormData(event.currentTarget);
  //   const newIngredient = event.get('ingredient');

  //   setIngredients((prevIngredient) => [...prevIngredient, newIngredient]);
  // }

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
      {ingredient.length === 0 && (
        <div className="ingredient-hint">
          <div className="hint-icon">👨‍🍳</div>

          <h3>Shef-Claude is waiting...</h3>

          <p>
            Give me at least <strong>3 ingredients</strong> and I'll see what
            magic we can make.
          </p>

          <p className="hint-small">
            Fridge looking suspiciously empty? 👀 Salt, pepper, garlic and
            spices count too. I'm a chef, not a magician... mostly. 😄
          </p>
        </div>
      )}
      {/* <ul>{listmap}</ul>  */}
      {ingredient.length > 0 && (
        <Ingredients
          ref={recipeSection}
          listofIngredient={ingredient}
          toShow={showRecipe}
        />
      )}

      {loading && <p>Generating your recipe...</p>}

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>
          <button onClick={showRecipe}>Try again</button>
        </div>
      )}

      {recipe && !loading && <ClaudeRecipe recipe={recipe} />}
    </main>
  );
}
