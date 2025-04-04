import { Close, SearchRounded } from '@mui/icons-material'
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import PropTypes from 'prop-types';

function Search({ searchValue, setSearchValue, handleSearch }) {
    
    const handleKeydown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleOnChange = (e) => {
        setSearchValue(e.target.value);
    }

    const handleClear = () => {
        setSearchValue("")
    }

    return (<OutlinedInput
        size='small'
        id="search"
        placeholder="Search…"
        value={searchValue}
        onKeyDown={handleKeydown}
        onChange={handleOnChange}
        sx={{
            alignItems: 'center',
            flexGrow: 1,
            color: 'black',
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
                    <SearchRounded sx={{ color: 'black.light' }} />
                </IconButton>
            </InputAdornment>
        }
        endAdornment=
        {
            !!searchValue &&
            searchValue !== "" &&
            (<InputAdornment position="end">
                <IconButton onMouseDown={handleClear}>
                    <Close sx={{ color: 'black.light' }} />
                </IconButton>
            </InputAdornment>)
        }
        inputProps={{
            'aria-label': 'search',
        }}
    />)
}

Search.propTypes = {
    searchValue: PropTypes.string.isRequired,
    setSearchValue: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired
}

export default Search