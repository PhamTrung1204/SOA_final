import React from "react";
import { Box, Select, MenuItem } from "@mui/material";

const FilterBar = ({ onFilterChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
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
      {/* Category Filter */}
      <Select
        name="category"
        defaultValue="all"
        onChange={handleChange}
        size="small"
        sx={{ minWidth: "150px" }}
      >
        <MenuItem value="all">Tất cả</MenuItem>
        <MenuItem value="CAT-01">Laptap</MenuItem>
        <MenuItem value="CAT-02">Máy tính - PC</MenuItem>
        <MenuItem value="CAT-03">CPU</MenuItem>
        <MenuItem value="CAT-04">Ram Laptop</MenuItem>
        <MenuItem value="CAT-05">HDD/SSD</MenuItem>
        <MenuItem value="CAT-06">Khác</MenuItem>
      </Select>

      {/* Price Filter */}
      <Select
        name="price"
        defaultValue="all"
        onChange={handleChange}
        size="small"
        sx={{ minWidth: "150px" }}
      >
        <MenuItem value="all">Tất cả</MenuItem>
        <MenuItem value="under10tr">Dưới 10 triệu</MenuItem>
        <MenuItem value="10to20">Từ 10-20 triệu</MenuItem>
        <MenuItem value="20to50">Từ 20-50 triệu</MenuItem>
        <MenuItem value="over50">Trên 50 triệu</MenuItem>
      </Select>

      {/* Specification Filter */}
      <Select
        name="specifications"
        defaultValue="all"
        onChange={handleChange}
        size="small"
        sx={{ minWidth: "150px" }}
      >
        <MenuItem value="all">Dòng chip</MenuItem>
        <MenuItem value="i3">Chip i3</MenuItem>
        <MenuItem value="i5">Chip i5</MenuItem>
        <MenuItem value="i7">Chip i7</MenuItem>
        <MenuItem value="i9">Chip i9</MenuItem>
      </Select>

      {/* Brand Filter */}
      <Select
        name="brand"
        defaultValue="all"
        onChange={handleChange}
        size="small"
        sx={{ minWidth: "150px" }}
      >
        <MenuItem value="all">Tất cả thương hiệu</MenuItem>
        <MenuItem value="DELL">Dell</MenuItem>
        <MenuItem value="APPLE">Apple</MenuItem>

        <MenuItem value="ASUS">Asus</MenuItem>
        <MenuItem value="HP">HP</MenuItem>
      </Select>

      {/* Tag Filter */}
      <Select
        name="tag"
        defaultValue="all"
        onChange={handleChange}
        size="small"
        sx={{ minWidth: "150px" }}
      >
        <MenuItem value="all">Tất cả</MenuItem>
        <MenuItem value="bestSeller">Siêu giảm giá</MenuItem>
        <MenuItem value="new">Mới</MenuItem>
      </Select>
    </Box>
  );
};

export default FilterBar;
