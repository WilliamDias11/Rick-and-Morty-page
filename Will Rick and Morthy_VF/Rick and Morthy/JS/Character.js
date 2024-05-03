const personagemNome = document.getElementById('personagemNome');
const content = document.getElementById('content');
let characters = []; // Variável para armazenar todos os personagens
let totalPages = 0; // Variável para armazenar o número total de páginas disponíveis
const charactersLimit = 100; // Limite de personagens a serem exibidos

const fetchAllCharacters = async () => {
  let allCharacters = [];
  let currentPage = 1;
  let charactersCount = 0;

  while (true) {
    const result = await fetch(`https://rickandmortyapi.com/api/character/?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    if (!result.results) break; // Verifica se o resultado possui a propriedade "results", caso contrário, sai do loop

    allCharacters = [...allCharacters, ...result.results];
    charactersCount += result.results.length;
    currentPage++;

    if (!totalPages) {
      totalPages = result.info.pages; // Atualiza totalPages apenas na primeira página
    }
    
    if (charactersCount >= charactersLimit || currentPage > totalPages) break; // Se alcançar o limite de personagens ou o final das páginas, saia do loop
  }

  return allCharacters.slice(0, charactersLimit); // Retorna no máximo 100 personagens
}

const fetchCharacterByName = async (name) => {
  const url = `https://rickandmortyapi.com/api/character/?name=${name}`;

  const result = await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results[0]);
      return data.results[0];
    });

  return result;
}

const buildResult = (characters) => {
  content.innerHTML = '';

  characters.forEach(character => {
    const characterDiv = document.createElement('div');
    characterDiv.classList.add('character');

    const characterImg = document.createElement('img');
    characterImg.src = character.image;
    characterImg.alt = character.name;

    const characterName = document.createElement('p');
    characterName.textContent = character.name;

    characterDiv.appendChild(characterImg);
    characterDiv.appendChild(characterName);

    content.appendChild(characterDiv);
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  characters = await fetchAllCharacters();
  buildResult(characters);
});

personagemNome.addEventListener('input', async () => {
  const name = personagemNome.value.trim().toLowerCase(); // Removemos espaços em branco extras e convertemos para minúsculas

  if (name === '') {
    buildResult(characters); // Se o campo estiver vazio, exibimos todos os personagens novamente
  } else {
    const filteredCharacters = characters.filter(character => character.name.toLowerCase().includes(name));
    buildResult(filteredCharacters);
  }
});
