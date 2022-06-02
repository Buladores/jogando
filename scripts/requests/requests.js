import makeRequest from "../utils/requestHandler.js";

export const fetchGamesList = async () => {
    const games = await makeRequest('games?sort-by=popularity');

    const favoriteGames = JSON.parse(localStorage.getItem("favorite-games")) || [];
    games.forEach(game => game.favorite = favoriteGames.includes(game.id));

    return games;
}