import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { PopperPlacementType, Popper, Fade, Typography } from '@material-ui/core';
import MoviePopper from './MoviePopper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function createData(title: string, year: number, director: string, rating: number) {
    return { title, year, director, rating };
}

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

    const classes = useStyles();

    const rows = props.movies

    const handleClick = (movieTitle: string, id: number) =>
        (event: React.MouseEvent<HTMLAnchorElement>, ) => {
            event.preventDefault()

            setAnchorEl(event.currentTarget)
            setPopperMovieTitle(movieTitle)
            setMovieId(id)
    };

    return (
        <div>
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
                                    <a href="" onClick={handleClick(row.title, row.id)}>{row.title}</a>
                                </TableCell>
                                <TableCell align="right">{row.year}</TableCell>
                                <TableCell align="right">{row.rating}</TableCell>
                                <TableCell align="right">{row.genres.join(", ")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {anchorEl &&
                <MoviePopper
                    anchorEl={anchorEl}
                    movieTitle={popperMovieTitle}
                    movieId={movieId}>
                </MoviePopper>
            }
        </div>
    );
}