import { Popper, Fade, Paper, ClickAwayListener } from "@material-ui/core";
import React, { useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    popper: {
        maxWidth: 400,
        minHeight: 140
    },
});

type MoviePopperProps = {
    anchorEl: HTMLAnchorElement,
    movieTitle: string,
    movieId: number
}

interface QueryResult {
    title: string
}


export default function MoviePopper(props: MoviePopperProps) {
    const [wikiFirstParagraph, setWikiFirstParagraph] = 
        React.useState<string>("")
    const [wikiLink, setWikiLink] = React.useState("")
    const [imdbLink, setImdbLink] = React.useState("")
    const [popperOpen, setPopperOpen] = React.useState(true)

    const _api_key = "403262ef2a327c80b988e7588d89cb06"
    const classes = useStyles();


    useEffect(() => {
        getImdbLink(props.movieId)
        getWikiDetails(props.movieTitle)
    }, [props.anchorEl]);

    
    const getImdbLink = (tmdbId: number) => {
        const queryUrl = "https://api.themoviedb.org/3/movie/"
        const fullQuery = queryUrl + tmdbId + "?api_key=" + _api_key

        fetch(fullQuery)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    return Promise.reject(response)
                }
            })
            .then((data) => {
                if (!data.imdb_id) {
                    setImdbLink("")
                }
                setImdbLink("https://www.imdb.com/title/" + data.imdb_id)
            }).catch(err => {
                setImdbLink("")
            })
    }

    const getWikiDetails = (movieTitle: string) => {
        //to overcome the CORS-policy block
        const proxyServer = "https://cors-anywhere.herokuapp.com/"
        const queryUrl =
            "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="
        const fullQuery =
            proxyServer + queryUrl + movieTitle + "&utf8=&format=json"

        fetch(fullQuery)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(response)
                }
            })
            .then((data) => {
                const resultsFound = data.query.search
                const assumedWikiTitle = getAssumedWikiTitle(movieTitle, resultsFound)
                setWikiFirstParagraph(getFirstWikiParagraph(
                    resultsFound, assumedWikiTitle))
                setWikiLink(getWikiLink(assumedWikiTitle))
            }).catch(err => {
                setWikiFirstParagraph("Couldn't find the wikipedia snippet for this movie")
                setWikiLink("")
            })
    }


    const getAssumedWikiTitle = (movieTitle: string, results: QueryResult[]) => {
        let assumedTitle = movieTitle + " (film)"
        if (results.filter((res: QueryResult) => res.title === assumedTitle).length > 0) {
            return assumedTitle
        }
        else {
            return movieTitle
        }
    }

    const getFirstWikiParagraph =
        (resultsFound: any, assumedWikiTitle: string) => {
            const result = resultsFound.filter(
                (x: QueryResult) => x.title === assumedWikiTitle)[0].snippet
            return result ? result : "Couldn't find the wikipedia snippet for this movie"
    }

    const getWikiLink = (assumedWikiTitle: string) => {
        if (!assumedWikiTitle) {
            return ""
        }
        return "https://en.wikipedia.org/wiki/" +
            assumedWikiTitle.replace(" (film)", "_(film)")
    }

    const renderFirstParagraph = (paragraphElement: string) => {
        if (paragraphElement !== "") {
            paragraphElement = "<strong>From Wikipedia:</strong> " + paragraphElement + "..."
            return(
                <div dangerouslySetInnerHTML={{ __html: paragraphElement }}></div>
            )
        }

        return paragraphElement
    }

    const popperContent = (
        <div id="popperContentTemplate">
            {renderFirstParagraph(wikiFirstParagraph)}
            { wikiLink ?
                <p><a href={wikiLink} target="_blank">Wikipedia link</a></p>
                :
                <p>Couldn't find a Wikipedia link for this movie :(</p>

            }
            {imdbLink ?
                <p><a href={imdbLink} target="_blank">IMDB link</a></p>
                :
                <p>Couldn't find the IMDB link for this movie :(</p>
            }
        </div>
    )

    const handleClickAway = () => {
        setPopperOpen(false);
    };

    return (
        //<ClickAwayListener onClickAway={handleClickAway}>
        //    {popperOpen ? (
                <Popper
                    className={classes.popper}
                    open={popperOpen}
                    anchorEl={props.anchorEl}
                    placement="right-start"
                    transition
                    modifiers={{
                        flip: {
                            enabled: true,
                        },
                        preventOverflow: {
                            enabled: true,
                            boundariesElement: 'viewport',
                        },
                    }}
                >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper>
                                {popperContent}
                            </Paper>
                        </Fade>
                    )}
                </Popper>
        //    ) : null}
        //</ClickAwayListener>
    )

}