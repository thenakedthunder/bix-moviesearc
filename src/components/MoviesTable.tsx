import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MoviePopper from './MoviePopper';

const useStyles = makeStyles({
    table: {
        maxWidth: 650,
        margin: "auto"
    },
});

type MoviesTableProps = {
    movies: {
        id: number,
        title: string,
        year: string,
        rating: number,
        genres: string[]
    }[]
}


export default function MoviesTable(props: MoviesTableProps) {
    // state variables for MoviePopper
    const [anchorEl, setAnchorEl] = React.useState<HTMLAnchorElement | null>(null);
    const [popperMovieTitle, setPopperMovieTitle] = React.useState("");
    const [movieId, setMovieId] = React.useState(0)

    useEffect(() => {
        // make MoviePopper disappear when a new search is being made
        setAnchorEl(null)
    }, [props.movies]);

    const classes = useStyles();

    const rows = props.movies

    const displayGenres = (genres: string[]) => genres.join(", ");

    const handleClick = (movieTitle: string, id: number) =>
        (event: React.MouseEvent<HTMLAnchorElement>, ) => {
            event.preventDefault()

            // specifying the position of the popper
            setAnchorEl(event.currentTarget)
            setPopperMovieTitle(movieTitle)
            setMovieId(id)
    };


    return (
        <div>
            {rows.length === 0 ?
                "no movies found" :

                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Title</TableCell>
                                <TableCell align="right">Year</TableCell>
                                <TableCell align="right">Rating</TableCell>
                                <TableCell align="right">Genres</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => (
                                <TableRow key={row.title}>
                                    <TableCell align="right">
                                        <a
                                            href=""
                                            onClick={handleClick(row.title, row.id)}
                                        >{row.title}</a>
                                    </TableCell>
                                    <TableCell align="right">{row.year}</TableCell>
                                    <TableCell align="right">{row.rating}</TableCell>
                                    <TableCell align="right">
                                        {displayGenres(row.genres)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            {anchorEl &&
                <MoviePopper
                    anchorEl={anchorEl}
                    movieTitle={popperMovieTitle}
                    movieId={movieId}
                />
            }
        </div>
    );

}