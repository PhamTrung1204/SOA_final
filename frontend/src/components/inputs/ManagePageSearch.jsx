import { Box } from "@mui/material"
import Search from "./Search"
import PropTypes from "prop-types"

function ManagePageSearch({ searchValue, setSearchValue, handleSearch }) {
  return (
    <Box width='300px'  >
      <Search {...{ searchValue, setSearchValue, handleSearch }} />
    </Box>
  )
}


ManagePageSearch.propTypes = {
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired
}

export default ManagePageSearch