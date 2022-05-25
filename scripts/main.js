import * as requests from './requests/requests.js';
import { GAMES_DIV } from './utils/domElements.js';
import { addClass, append, removeClass } from './utils/domManipulator.js';


let gamesList = [];

const setIsLoading = isLoading => {
    if (isLoading) addClass(GAMES_DIV, 'is-loading');
    else removeClass(GAMES_DIV, 'is-loading');
}

function* loadGames(games) {
    let counter = 0;

    for (let game of games) {
        const LI = document.createElement('li');
        append(LI, game.title);
        append(GAMES_DIV, LI);
        counter++;

        if (counter === 3) {
            counter = 0;
            yield;
        }
    }
}

let loadPopularGames;

(async () => {
    setIsLoading(true);
    gamesList = await requests.fetchGamesList();
    setIsLoading(false);

    loadPopularGames = loadGames(gamesList);
    loadPopularGames.next();
    window.loadPopularGames = loadPopularGames;
})();

