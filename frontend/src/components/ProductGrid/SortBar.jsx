import React from "react";
import { Box, Select, MenuItem } from "@mui/material";

const SortBar = ({ onSortChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onSortChange(name, value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        mb: 2,
        flexWrap: "wrap",
      }}
    >
      <Select
        name="sort"
        defaultValue="price"
        onChange={handleChange}
        size="small"
        sx={{ minWidth: "150px" }}
      >
        <MenuItem value="price">Sắp xếp theo giá</MenuItem>
        <MenuItem value="name">Sắp xếp theo tên</MenuItem>
      </Select>
    </Box>
  );
};

export default SortBar;
