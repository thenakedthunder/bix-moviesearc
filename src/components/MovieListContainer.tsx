import React, { useEffect } from "react";
import { Movie } from "./App";
import MoviesTable from "./MoviesTable";


type MovieListContainerProps = {
    moviesListed: Movie[]
}

type Genre = {
    id: number,
    name: string
}


export default function MovieListContainer(props: MovieListContainerProps) {
    const [genreTypes, setGenreTypes] = React.useState<{[id: number] :string} | null>(null)


    useEffect(() => {
        loadGenres()
    }, []);

    const mapResultObjectsToMovieObjects = (results: Movie[]) =>
        results.map((res: Movie) =>
            ({
                id: res.id,
                title: res.title,
                year: getYearFromDateString(res.release_date),
                rating: res.vote_average,
                genres: getGenresOfMovie(res.genre_ids)
            })
        )

    const loadGenres = () => {
        const query = "https://api.themoviedb.org/3/genre/movie/list?api_key=403262ef2a327c80b988e7588d89cb06&language=en-US"

        fetch(query)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let resObj: { [id: number]: string } = {}
                data.genres.map((g: Genre) => {
                    resObj[g.id] = g.name
                })
                return resObj
            }).then((result) => setGenreTypes(result))
    }

    const getYearFromDateString =
        (dateString: string) => dateString.split("-")[0]

    const getGenresOfMovie = (genreIDs: number[]) => {
        if (!genreTypes) throw Error("na most van gáz")

        return genreIDs.map(id => genreTypes[id])
    }

    return (
        <div>
            {genreTypes &&
                <MoviesTable movies={mapResultObjectsToMovieObjects(props.moviesListed)} />
            }
        </div>
    )
}