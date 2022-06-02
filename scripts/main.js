import * as requests from './requests/requests.js';
import { addClass, append, removeClass } from './utils/domManipulator.js';


let gamesList = [];
let loadGames;

const gamesDiv = document.getElementById('games'),
    topNavbarOptions = document.querySelector('.top-navbar .items'),
    sidebarMenuOptions = document.querySelector('.sidebar .menu .menu-links'),
    searchInput = document.getElementById('search');

const onScroll = () => {
    if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight) {
        loadGames.next();
    }
}

// Atualiza a classe active dos itens da navbar acima
const updateSelectedNavbarItem = newSelectedItem => {
    removeClass(topNavbarOptions.querySelector('.active'), 'active');
    addClass(topNavbarOptions.querySelector(`[value="${newSelectedItem}"]`), 'active');
}

// Atualiza a classe active dos itens da sidebar
const updateSelectedSidebarItem = newSelectedItem => {
    removeClass(sidebarMenuOptions.querySelector('.active'), 'active');
    addClass(sidebarMenuOptions.querySelector(`[value="${newSelectedItem}"]`), 'active');
}

// Lida com o estado de carregamento da página
const setIsLoading = isLoading => {
    if (isLoading) addClass(gamesDiv, 'is-loading');
    else removeClass(gamesDiv, 'is-loading');
}

// Altera ou deleta um parâmetro da url
const setParam = (name, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(name, value.toLowerCase());
    else params.delete(name);
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
}

const onImgError = source => {
    source.src = event.target.src.replace("background", "thumbnail");
    source.onerror = "";
    return true;
}

// Generator function que carrega os cards
function* loadGames_(games) {
    gamesDiv.innerHTML = "";

    for (let i = 0; i < games.length; i++) {
        const LI = document.createElement('li');
        LI.innerHTML = `
            <${i ? `a href="${games[i].game_url}" title="${games[i].title}"` : "div"} class="game-wrapper">
                <img class="thumbnail" src="${i ? games[i].thumbnail : games[i].thumbnail.replace("thumbnail", "background")}" onerror='onImgError(this);' />
                <span class="game-title text">${games[i].title}</span>
                <div class="description text">${games[i].short_description}</div>
            <${i ? "/a" : "/div"}>
        `;

        append(gamesDiv, LI);
        if (!(i % 9) && i) {
            window.addEventListener('scroll', onScroll);
            yield;
        }
    }

    window.removeEventListener('scroll', onScroll);
}

const loadGamesByParams = isFirstLoad => {
    const urlParams = new URLSearchParams(window.location.search);

    let filters = [];
    const groupBy = urlParams.get('group-by');
    const list = urlParams.get('list');
    const search = urlParams.get('search');

    if (isFirstLoad) {
        updateSelectedNavbarItem(groupBy || 'all');
        updateSelectedSidebarItem(list || 'popular');
    }

    if (list)
        filters.push({ key: 'genre', value: list });

    if (search) {
        filters.push({ key: 'title', value: search });
        filters.push({ key: 'publisher', value: search });
        filters.push({ key: 'genre', value: search });
        searchInput.value = search;
    } else searchInput.value = '';

    if (groupBy === 'favorites')
        filters.push({ key: 'favorite', value: true });
    else if (groupBy)
        filters.push({ key: 'platform', value: groupBy });

    loadGames = loadGames_(filterGames(filters, search ? true : false));
    window.loadGames = loadGames;
    loadGames.next();
}

// Função que filtra a gamesList
// Caso needOne seja true, um ou mais dos fitros precisa estar presente.
// Caso needOne não seja true TODOS os filtros precisam estar presentes
const filterGames = (filters, needOne) => {
    return gamesList.filter(game => {
        for (let filter of filters) {
            if (!filter?.value) continue;

            if (typeof filter.value === "string") {
                if (game[filter.key].toLowerCase().includes(filter.value.toLowerCase())) {
                    if (needOne) return true;
                } else {
                    if (!needOne) return false;
                    else if (filters[filters.length - 1].key === filter.key) return false; // Verifica se é o último filter da lista de filters
                }
            } else {
                if (game[filter.key] !== filter.value) return false;
            }
        }

        return true;
    })
}

const changeGroupBy = event => {
    setParam('search');
    setParam('group-by', event.target.value === 'all' ? null : event.target.value);
    if (event.target.value === 'favorites') setParam('list', 'popular');

    updateSelectedNavbarItem(event.target.value);
    loadGamesByParams();
}

const changeList = event => {
    setParam('search');
    setParam('list', event.target.value === 'popular' ? null : event.target.value);

    updateSelectedSidebarItem(event.target.value);
    loadGamesByParams();
}

const changeSearch = newSearch => {
    setParam('list');
    setParam('group-by');
    setParam('search', newSearch);

    updateSelectedSidebarItem('popular');
    updateSelectedNavbarItem('all');

    loadGamesByParams();
}

const verifyEnter = event => {
    if (event.keyCode === 13)
        changeSearch(event.target.value);
}

// Essa função serve para setar as configurações iniciais da página
(async () => {
    setIsLoading(true);
    gamesList = await requests.fetchGamesList();
    setIsLoading(false);

    loadGamesByParams(true);
})();

window.changeGroupBy = changeGroupBy;
window.changeList = changeList;
window.onImgError = onImgError;
window.verifyEnter = verifyEnter;