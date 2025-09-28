const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#search');
const resultsList = document.querySelector('#results');
const loader = document.querySelector('#loader');
const loadMoreButton = document.querySelector('#loadMore');

let currentPage = 0;
let recipes = [];
let searchValue = '';
const recipesPerPage = 6;

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentPage = 0;
    recipes = [];
    searchValue = searchInput.value.trim();
    resultsList.innerHTML = '';
    searchRecipes();
});

async function searchRecipes() {
    if (!searchValue) return;
    loader.style.display = 'block';
    loadMoreButton.style.display = 'none';

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchValue}`);
        const data = await response.json();
        
        if (!data.meals) {
            resultsList.innerHTML = '<p>No results found. Try a different search.</p>';
            loader.style.display = 'none';
            return;
        }

        recipes = data.meals;
        displayRecipes();
    } catch (error) {
        console.error(error);
        resultsList.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    } finally {
        loader.style.display = 'none';
    }
}

function displayRecipes() {
    const start = currentPage * recipesPerPage;
    const end = start + recipesPerPage;
    const paginatedRecipes = recipes.slice(start, end);

    let html = '';
    paginatedRecipes.forEach(recipe => {
        html += `
        <div>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
            <a href="https://www.themealdb.com/meal/${recipe.idMeal}" target="_blank">View Recipe</a>
        </div>
        `;
    });

    resultsList.innerHTML += html;

    currentPage++;
    if (recipes.length > currentPage * recipesPerPage) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }
}

loadMoreButton.addEventListener('click', displayRecipes);
