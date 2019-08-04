'use strict'

const apiKey = 'aba4d87f9d45095cb05fec74c8192987';
const appId = 'a3869b37';
const searchUrl = 'https://api.edamam.com/search';
const beverageSearchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const videoSearchUrl = 'https://www.googleapis.com/youtube/v3/search';
const videoApiKey = 'AIzaSyCyodARBxXDbIXokWo_Z10Y7Ys3AWSE8IU';
let result = [];

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function displayResults() {
    $('#results-list').empty();
    $('#results').removeClass('hidden');

    for (let i = 0; i < result.length; i++) {
        const rec = result[i];
        $('#results-list').append(`<div id="js-recipes"><li><img src="${rec.image}"</img><br/>
        <a target="_blank" href="${rec.shareAs}">${rec.label}</a></li></div>`);
    };
}

function addResult(responseJson) {
    if (responseJson.hits) {
        for (let i = 0; i < responseJson.hits.length; i++) {
            const rec = responseJson.hits[i];
            result.push({
                image: rec.recipe.image,
                label: rec.recipe.label,
                shareAs: rec.recipe.shareAs
            });
        };
    }
}

function addVideoResult(responseJson) {
    if (responseJson.items) {
        for (let i = 0; i < responseJson.items.length; i++) {
            const rec = responseJson.items[i];
            console.log(rec);
            result.push({
                image: rec.snippet.thumbnails.high.url,
                label: rec.snippet.title,
                shareAs: 'https://www.youtube.com/watch?v=' + rec.id.videoId
            });
        }
    }
}
function getRecipeList(recipeList) {
    const params = {
        q: recipeList,
        app_id: appId,
        app_key: apiKey
    }
    const videoParams = {
        key: videoApiKey,
        part: 'snippet',
        q: recipeList + ' recipe',
        maxResults: 10

    }

    const queryString = formatQueryParams(params);
    const url = searchUrl + '?' + queryString;
    console.log(url);
    result = [];
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            addResult(responseJson);
            displayResults();
        })
        .catch(error => {
            $('#js-error-message').text(`Oooooops!: ${error.message}`);
        });


    const videoQueryString = formatQueryParams(videoParams);
    const videoUrl = videoSearchUrl + '?' + videoQueryString;

    fetch(videoUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            addVideoResult(responseJson);
            displayResults();
        })
        .catch(error => {
            $('#js-error-message').text(`Oooops!: ${error.message}`);
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