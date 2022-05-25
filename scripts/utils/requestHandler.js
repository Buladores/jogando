const OPTIONS = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
        'X-RapidAPI-Key': '5b30972bcamsh4845c7996bea738p19b706jsncbf0179877cf'
    }
};

const makeRequest = async params => {
    try {
        const response = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/${params}`, OPTIONS);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (err) {
        console.error(err);
        alert('Ocorreu um erro ao tentar realizar uma requisição para o servidor.');
    }
};

export default makeRequest;