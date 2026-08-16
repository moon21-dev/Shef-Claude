export default function Ingredients(props) {
  const listmap = props.listofIngredient.map((element) => {
    return <li key={element}>{element}</li>;
  });

  return (
    <section>
      <h2>Ingredients on hand:</h2>
      <ul className="ingredients-list" aria-live="polite">
        {listmap}
      </ul>
      {listmap.length > 3 && (
        <div className="get-receipe-container">
          <div>
            <h3>Ready for a receipe?</h3>
            <p>Generate a receipe from your list of ingredients.</p>
          </div>
          <button onClick={props.toShow}>Get a receipe</button>
        </div>
      )}
    </section>
  );
}
