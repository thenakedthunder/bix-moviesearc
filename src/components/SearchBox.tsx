import React, { KeyboardEvent, ChangeEvent, MouseEvent } from "react";
import { TextField, SvgIcon, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles({
    searchBoxContainer: {
        marginTop: 40,
        minHeight: 140
    },
    textInput: {
        width: 240,
        marginRight: 24
    },
    searchButton: {
        height: 50,
        marginTop: 3
    }
});

type SearchBoxProps = {
    onSearchButtonCallback: (searchedText: String) => void
}

export default function SearchBox(props: SearchBoxProps) {
    const [inputValue, setInputValue] = React.useState("")

    const classes = useStyles();


    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault()
        props.onSearchButtonCallback(inputValue)
    }

    return (
        <div>
            <form
                autoComplete="off"
                onSubmit={handleSubmit}
                className={classes.searchBoxContainer}
            >
                <TextField
                    id="search-input"
                    className={classes.textInput}
                    label="Type in the title of the movie"
                    variant="outlined"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <Button
                    className={classes.searchButton}
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    endIcon={<SearchIcon>search</SearchIcon>}
                >
                    Search
                </Button>
            </form>
        </div>
    )
}