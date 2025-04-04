/* eslint-disable react/prop-types */
import { FormControl, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";

export default function ExpandableSearch({ isSearchFocused, setIsSearchFocused, onChange, children }) {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        onChange(query);
    }

    const handleKeydown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
        else if (e.key === 'Escape') {
            setIsSearchFocused(false);
        }
    }

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
        // setTimeout(setIsSearchFocused(false),500)
    };


    const handleOnChange = (e) => {
        setIsSearchFocused(true);
        setQuery(e.target.value);
    }

    const handleClear = () => {
        setQuery("")
    }

    useEffect(() => {
        if(query)
            setTimeout(handleSearch(),1500);
    }, [query]);

    return (
        <FormControl sx={{ width: '100%' }} variant="outlined">
            <OutlinedInput
                size="medium"
                id="search"
                placeholder="Search…"
                color='black.light'
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onChange={handleOnChange}
                onKeyDown={handleKeydown}
                value={query}
                sx={{
                    alignItems: 'center',
                    flexGrow: 1,
                    borderRadius: '32px',
                    color: 'black.light',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black.light',
                        transition: 'all 0.3s ease' // Default outline color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black.light',
                        color: 'black.light',
                        boxShadow: 'inset 0 0 3px ',
                        transition: 'all 0.3s ease' // Default outline color
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px',
                        borderColor: 'black.light',
                        color: 'black.light',
                        transition: 'all 0.3s ease' // Default outline color
                    }
                }}
                startAdornment={
                    <InputAdornment position="start">
                        <IconButton onMouseDown={handleSearch}>
                            <SearchRoundedIcon sx={{ color: 'black.light' }} />
                        </IconButton>
                    </InputAdornment>
                }
                endAdornment=
                {
                    (isSearchFocused || query !== "") &&
                    (<InputAdornment position="end">
                        <IconButton onMouseDown={handleClear}>
                            <Close sx={{ color: 'black.light' }} />
                        </IconButton>
                    </InputAdornment>)
                }
                inputProps={{
                    'aria-label': 'search',
                }}
            />
            {children}
        </FormControl>
    );
}