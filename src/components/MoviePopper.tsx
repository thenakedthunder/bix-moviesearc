import { Popper, Fade, Paper, Typography } from "@material-ui/core";
import React, { useEffect } from "react";



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
    //const [contentLoaded, setContentLoaded] = React.useState(false)


    useEffect(() => {
        getImdbLink(props.movieId)
        getFirstWikiParagraph(props.movieTitle)
    }, []);

    
    const getImdbLink = (tmdbId: number) => {
        const queryUrl = "https://api.themoviedb.org/3/movie/"
        const apiKey = "403262ef2a327c80b988e7588d89cb06"
        const fullQuery = queryUrl + tmdbId + "?" + apiKey + "& language=en - US"

        fetch(fullQuery)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setImdbLink("https://www.imdb.com/title/" + data.imdb_id)
            })
    }

    const getFirstWikiParagraph = (movieTitle: string) => {
        //to overcome the CORS-policy block
        const proxyServer = "https://cors-anywhere.herokuapp.com/"
        const queryUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="
        const fullQuery = proxyServer + queryUrl + movieTitle + "&utf8=&format=json"

        fetch(fullQuery)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const resultsFound = data.query.search
                const assumedWikiTitle = getAssumedWikiTitle(movieTitle, resultsFound)
                const p = resultsFound.filter((x: QueryResult) => x.title === assumedWikiTitle)[0].snippet
                setWikiFirstParagraph(p)
                //setContentLoaded(true)
            });
    }


    const getAssumedWikiTitle = (movieTitle: string, results: QueryResult[]) => {
        let assumedTitle = movieTitle + " (film)"
        if (results.filter((res: QueryResult) => res.title === assumedTitle).length > 0) {
            setWikiLink("https://en.wikipedia.org/wiki/" + movieTitle + "_(film)")
            return assumedTitle
        }
        else {
            setWikiLink("https://en.wikipedia.org/wiki/" + movieTitle)
            return movieTitle
        }
    }

    const renderFirstParagraph = (paragraphElement: string) => {
        if (paragraphElement != "") {
            return(
                <div dangerouslySetInnerHTML={{ __html: paragraphElement }}></div>
            )
        }

        return paragraphElement
    }

    const popperContent = (
        <div id="popperContentTemplate">
            {renderFirstParagraph(wikiFirstParagraph)}
            <p><a>{wikiLink}</a></p>
            <p><a>{imdbLink}</a></p>
        </div>
    )

    return (
        <Popper
            open={true}
            anchorEl={props.anchorEl}
            placement="right-start"
            transition
            modifiers={{
                flip: {
                    enabled: true,
                },
                preventOverflow: {
                    enabled: true,
                    boundariesElement: 'scrollParent',
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
    )
}