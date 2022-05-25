import * as requests from './requests/requests.js';
import { GAMES_DIV } from './utils/domElements.js';
import { addClass, append, removeClass } from './utils/domManipulator.js';


let gamesList = [];
let loadGames;

// Lida com o estado de carregamento da página
const setIsLoading = isLoading => {
    if (isLoading) addClass(GAMES_DIV, 'is-loading');
    else removeClass(GAMES_DIV, 'is-loading');
}

// Generator function que carrega os cards
function* loadGames_(games) {
    GAMES_DIV.innerHTML = "";

    for (let i = 0; i < games.length; i++) {
        append(GAMES_DIV, append('li', games[i].title));
        if (!(i % 9) && i) yield;
    }
}

// Função que filtra a gamesList. Os filtros são objetos com key e value
const filterGames = (filterA, filterB) => {
    return gamesList.filter(game => {
        let hasFilterA = false;
        let hasFilterB = false;

        if (!filterA?.value) hasFilterA = true;
        else if (game?.[filterA.key]?.toLowerCase()?.includes(filterA.value.toLowerCase())) hasFilterA = true;
        if (!filterB?.value) hasFilterB = true;
        else if (game?.[filterB.key]?.toLowerCase()?.includes(filterB.value.toLowerCase())) hasFilterB = true;      
        
        if (hasFilterA && hasFilterB) return true;
    })
};

// Essa função altera um parametro da URL e carrega os cards mediante os parâmetros
const changeParam = (name, value) => {
    const params = new URLSearchParams(window.location.search);
    params.set(name, value);
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));

    const urlParams = new URLSearchParams(window.location.search);

    const filterA = { key: 'genre', value: urlParams.get('genre') };
    const filterB = { key: 'platform', value: urlParams.get('platform') };

    loadGames = loadGames_(filterGames(filterA, filterB))
    window.loadGames = loadGames;
    loadGames.next();
}
window.changeParam = changeParam;

// Essa função serve para setar as configurações iniciais da página
(async () => {
    setIsLoading(true);
    gamesList = await requests.fetchGamesList();
    setIsLoading(false);

    loadGames = loadGames_(gamesList);
    window.loadGames = loadGames;
    loadGames.next();

    Array.from(new Set(gamesList.map(game => game.genre.trim()))).map(genre => {
        const BUTTON = append('button', genre);
        BUTTON.addEventListener('click', () => changeParam('genre', genre))
        append(document.getElementById('buttons'), BUTTON);
    })
})()