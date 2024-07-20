window.getPokeData = async function() {
    try {
      const pokemon = await getPokemon();
      const randomPokemon = shuffle(pokemon);
      const pokemonChoices = get4Pokemon(randomPokemon);
      const [firstPokemon] = pokemonChoices;
      const image = getPokemonImage(firstPokemon);
  
      return { 
        pokemonChoices: shuffle(pokemonChoices),
        correct: {
          image,
          name: firstPokemon.name,
        }
      };
    } catch (error) {
      console.error('Error in getPokeData:', error);
    }
  };
  
  async function getPokemon() {
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const pokemon = await res.json();
      return pokemon.results;
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    }
  }
  
  function shuffle(unshuffled) {
    return unshuffled
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
  
  function get4Pokemon(randomPokemon) {
    return randomPokemon.slice(0, 4);
  }
  
  function getPokemonImage({ url }) {
    const number = getNumber(url);
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png`;
  }
  
  function getNumber(url) {
    const numberRegEx = /(\d+)\/$/;
    return (url.match(numberRegEx) || [])[1];
  }