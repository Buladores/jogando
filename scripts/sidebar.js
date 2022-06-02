const body = document.querySelector('body'),
    search = body.querySelector('#search'),
    sidebar = body.querySelector('.sidebar'),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");


// Fecha a sidebar quando clica e altera 
toggle.addEventListener("click", () => {
    body.style = sidebar.classList.toggle("close") ? 'margin-left: 113px' : 'margin-left: 273px';
})

// Ao clicar na pesquisa abre a sidebar e foca o input de pesquisa
searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
    body.style = 'margin-left: 273px';
    setTimeout(() => search.focus(), 300);
})

// Lida com o botão de ativar e desativar dark-mode
modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark"))
        modeText.innerText = "Light mode";
    else
        modeText.innerText = "Dark mode";
});