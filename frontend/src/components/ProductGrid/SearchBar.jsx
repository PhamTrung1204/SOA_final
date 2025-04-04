import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const SearchBar = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearchChange(searchTerm);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mr: 2, width: "250px" }}
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
