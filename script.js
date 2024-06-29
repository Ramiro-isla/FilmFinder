const movieListElement = document.querySelector(".movie-list");
const searchInputElement = document.querySelector(".input");
const loaderElement = document.querySelector(".loader-container");

const fetchApi = async () => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=7be72508776961f3948639fbd796bccd&page=1"
    );
    const apiDataJSON = await response.json();
    const movies = apiDataJSON.results;
    showLoader(true);
    await loadImages(movies);
    showLoader(false);
    renderMovies(movies);
    searchInputElement.addEventListener("input", () => searchMovies(movies));
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

const loadImages = (movies) => {
  return new Promise((resolve) => {
    let loadedImages = 0;
    movies.forEach((movie) => {
      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
      img.onload = () => {
        loadedImages++;
        if (loadedImages === movies.length) {
          resolve();
        }
      };
    });
  });
};

const showLoader = (show) => {
  loaderElement.style.display = show ? "block" : "none";
  movieListElement.style.display = show ? "none" : "flex";
};

const showDetails = (movie, cardElement) => {
  const allCards = document.querySelectorAll(
    ".movie-card, .movie-card-clicked"
  );
  allCards.forEach((card) => {
    if (card !== cardElement) {
      card.className = "movie-card";
      const cardMovie = JSON.parse(card.dataset.movie);
      card.innerHTML = `
        <img class="image" src="https://image.tmdb.org/t/p/original/${cardMovie.poster_path}" alt="${cardMovie.title}">
        <h2 class="title">${cardMovie.title}</h2>
        <div class="info">
          <p>Year: ${cardMovie.release_date}</p>
          <p>Rating: ${cardMovie.vote_average}</p>
        </div>`;
    }
  });

  if (cardElement.className === "movie-card") {
    cardElement.className = "movie-card-clicked";
    cardElement.innerHTML = `
    <img class="image" src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" alt="${movie.title}">
      <h2 class="title">${movie.title}</h2>
      <div class="info">
        <p>Overview</p>
        <p class="movie-overview">${movie.overview}</p>
      </div>`;
  } else {
    cardElement.className = "movie-card";
    cardElement.innerHTML = `
      <img class="image" src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="${movie.title}">
      <h2 class="title">${movie.title}</h2>
      <div class="info">
        <p>Year: ${movie.release_date}</p>
        <p>Rating: ${movie.vote_average}</p>
      </div>`;
  }
};

const searchMovies = (movies) => {
  const query = searchInputElement.value.toLowerCase().trim();
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(query)
  );
  renderMovies(filteredMovies);
};

const renderMovies = (movies) => {
  movieListElement.innerHTML = "";
  for (let movie of movies) {
    const cardElement = document.createElement("div");
    cardElement.dataset.movie = JSON.stringify(movie);
    const titleElement = document.createElement("h2");
    const imageElement = document.createElement("img");
    const infoElement = document.createElement("div");
    const yearElement = document.createElement("p");
    const ratingElement = document.createElement("p");

    cardElement.classList.add("movie-card");
    cardElement.addEventListener("click", () =>
      showDetails(movie, cardElement)
    );
    titleElement.classList.add("title");
    titleElement.textContent = movie.title;
    imageElement.classList.add("image");

    imageElement.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/original/${movie.poster_path}`
    );
    imageElement.setAttribute("alt", movie.title);
    infoElement.classList.add("info");
    yearElement.innerHTML = `Year: ${movie.release_date}`;
    ratingElement.innerHTML = `Rating: ${movie.vote_average}`;

    infoElement.appendChild(yearElement);
    infoElement.appendChild(ratingElement);
    cardElement.appendChild(imageElement);
    cardElement.appendChild(titleElement);
    cardElement.appendChild(infoElement);
    movieListElement.appendChild(cardElement);
  }
};

fetchApi();
