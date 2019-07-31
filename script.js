'use strict'

const apiKey = 'aba4d87f9d45095cb05fec74c8192987';
const appId = 'a3869b37';
const searchUrl = 'https://api.edamam.com/search';
/*const searchUrl2 = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita';*/

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    $('#results').removeClass('hidden');

    for (let i = 0; i < responseJson.hits.length; i++) {
        const rec = responseJson.hits[i];
        $('#results-list').append(`<div id="js-recipes"><li><img src="${rec.recipe.image}"</img><br/><a target="_blank" href="${rec.recipe.shareAs}">${rec.recipe.label}</a></li></div>`);
    };
}

function getRecipeList(recipeList) {
    const params = {
        q: recipeList,
        app_id: appId,
        app_key: apiKey
    }

    const queryString = formatQueryParams(params);
    const url = searchUrl + '?' + queryString;
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => {
            $('#js-error-message').text(`Oooooops!: ${error.message}`);
        });
}

function SubmitForm() {
    $('form').on('submit', event => {
        event.preventDefault();
        const recipeList = $('#js-search-recipes').val().split(",");
        getRecipeList(recipeList);
    });
}

$(SubmitForm);