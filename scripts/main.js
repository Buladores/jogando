import * as requests from './requests/requests.js';
import { GAMES_DIV } from './utils/domElements.js';
import { addClass, append, removeClass } from './utils/domManipulator.js';


let gamesList = [];
let loadGames;

const setIsLoading = isLoading => {
    if (isLoading) addClass(GAMES_DIV, 'is-loading');
    else removeClass(GAMES_DIV, 'is-loading');
}

function* loadGames_(games) {
    let counter = 0;
    GAMES_DIV.innerHTML = "";

    for (let game of games) {
        append(GAMES_DIV, append('li', game.title));
        counter++;

        if (counter === 3) {
            counter = 0;
            yield;
        }
    }
}

// Os filtros são objetos com key e value
const filterGames = (filterA, filterB) => {
    return gamesList.filter(game => {
        let hasFilterA = false;
        let hasFilterB = false;

        if (!filterA?.value) hasFilterA = true;
        if (!filterB?.value) hasFilterB = true;

        if (game?.[filterA.key]?.toLowerCase()?.includes(filterA.value.toLowerCase())) hasFilterA = true;
        if (game?.[filterB.key]?.toLowerCase()?.includes(filterB.value.toLowerCase())) hasFilterB = true;

        if (hasFilterA && hasFilterB) return true;
    })
};

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
})();