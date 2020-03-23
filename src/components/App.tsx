import React from 'react';
import logo from '../logo.svg';
import '../styles/App.css';
import SearchBox from './SearchBox'
import MovieListContainer from './MovieListContainer'


export declare interface Movie {
    id: number,
    title: string,
    release_date: string,
    vote_average: number,
    genre_ids: number[]
}

function App() {
    const [moviesFound, setMoviesFound] = React.useState<Movie[]|null>(null)


    const updateMoviesCallback = (searchExp: String) => {
        let moviesFound: {}[] = []

        let queryURL = "https://api.themoviedb.org/3/search/movie?"
        const apiKey = "403262ef2a327c80b988e7588d89cb06"
        const fullQuery = queryURL + "api_key=" + apiKey + "&query=" + searchExp

        fetch(fullQuery)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setMoviesFound(data.results)
            });
    }


    return (
    <div className="App">
        <SearchBox onSearchButtonCallback={updateMoviesCallback} />
        {moviesFound &&
            <MovieListContainer moviesListed={moviesFound} />
        }
    </div>
    );
}

export default App;