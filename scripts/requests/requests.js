import makeRequest from "../utils/requestHandler.js";

export const getGamesList = async () => {
    const games = await makeRequest('games');
    return games;
}