import React, { useEffect } from 'react';
import logo from '../logo.svg';
import '../styles/App.css';
import SearchBox from './SearchBox'
import MoviesTable from './MoviesTable';
import { Movie, Genre } from './Types';




function App() {
    const _api_key = "403262ef2a327c80b988e7588d89cb06"

    const [moviesFound, setMoviesFound] = React.useState<Movie[]|null>(null)
    const [genreTypes, setGenreTypes] =
        React.useState<{ [id: number]: string } | null>(null)


    //on app load, get the genres "hash", which will help determine the genres 
    //of a movie
    useEffect(() => {
        loadGenres()
    }, []);

    // gets the genres (in a hash, to reach genre names easily by their ids)
    const loadGenres = () => {
        const query = "https://api.themoviedb.org/3/genre/movie/list?api_key="
            + _api_key
        fetch(query)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    return Promise.reject(response);
                }
            })
            .then((data) => {
                const result: { [id: number]: string } = {}
                data.genres.map((g: Genre) => {
                    result[g.id] = g.name
                })
                return result
            }).then((result) => {
                if (!Object.keys(result).length) {
                    throw Error("empty array returned from API call")
                }
                setGenreTypes(result)
            }).catch(err => {
                console.warn('could not fetch genres', err);
                throw Error('Error: could not fetch genres');
            })
    }

    // called from the SearchBox component
    const updateMoviesCallback = (searchExp: String) => {
        let queryURL = "https://api.themoviedb.org/3/search/movie?"
        const fullQuery = queryURL + "api_key=" + _api_key + "&query=" + searchExp

        fetch(fullQuery)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    return Promise.reject(response);
                }
            })
            .then((data) => {
                setMoviesFound(data.results)
            }).catch(err => {
                console.warn('could not fetch movies', err);
                throw Error('Error: could not fetch movies');
            })
    }

    const mapResultObjectsToMoviesTablePropObjects = (results: Movie[]) =>
        results.map((res: Movie) =>
            ({
                id: res.id,
                title: res.title,
                year: getYearFromDateString(res.release_date),
                rating: res.vote_average,
                genres: getGenresOfMovie(res.genre_ids)
            })
        )


    const getYearFromDateString =
        (dateString: string) => dateString.split("-")[0]

    const getGenresOfMovie = (genreIDs: number[]) => {
        if (!genreTypes) throw Error("na lefõtt a kávé")

        return genreIDs.map(id => genreTypes[id])
    }




    return (
        <div className="App">
            <SearchBox onSearchButtonCallback={updateMoviesCallback} />
            {(genreTypes && moviesFound) &&
                <MoviesTable movies={mapResultObjectsToMoviesTablePropObjects(moviesFound)} />
            }
        </div>
    );
}

export default App;