import makeRequest from "../utils/requestHandler.js";

export const fetchGamesList = async () => {
    const games = await makeRequest('games');
    return games;
}