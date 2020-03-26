//to make sure movie data contains the expected information
export type Movie = {
    id: number,
    title: string,
    release_date: string,
    vote_average: number,
    genre_ids: number[]
}

//genre objects should have at least these properties:
export type Genre = {
    id: number,
    name: string
}