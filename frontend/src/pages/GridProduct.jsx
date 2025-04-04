import React, { useState } from "react";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Rating,
  Container,
  useMediaQuery,
  useTheme,
  TextField, // For Search Input
  Button, // For Search Button
} from "@mui/material";
import { TopAppBar } from "../components";

// Search Component
const SearchBar = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearchChange(searchTerm);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
      <TextField
        label="Search by name or tag"
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

// FilterBar Component
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
        <MenuItem value="all">Dòng máy </MenuItem>
        <MenuItem value="gaming">Gaming</MenuItem>
        <MenuItem value="office">Văn phòng</MenuItem>
        {/* Add more categories here */}
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
        name="specification"
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
        {/* Add more specs here */}
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
        <MenuItem value="dell">Dell</MenuItem>
        <MenuItem value="apple">Apple</MenuItem>
        <MenuItem value="samsung">SamSung</MenuItem>
        <MenuItem value="acer">Acer</MenuItem>
        <MenuItem value="asus">Asus</MenuItem>
        <MenuItem value="hp">HP</MenuItem>
        {/* Add more brands here */}
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

// SortBar Component
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

// ProductCard Component
const ProductCard = ({ product, onClick }) => {
  if (!product) return null;

  // Tính phần trăm giảm giá
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.discountPrice) /
          product.originalPrice) *
          100
      )
    : 0;

  return (
    <Card sx={{ width: "100%", border: "1px solid #1976d2" }}>
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          sx={{ height: "250px", objectFit: "cover" }}
          image={product.imageUrl || "https://via.placeholder.com/300"}
          alt={product.title || "Product Image"}
        />
        <CardContent>
          <Box sx={{ textAlign: "center" }}>
            <Typography gutterBottom variant="h6">
              {product.title || "Unknown Title"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.description || "No description available."}
            </Typography>

            {/* Giá hiển thị */}
            {product.discountPrice && product.originalPrice && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ textDecoration: "line-through", color: "gray" }}
                >
                  {`${product.originalPrice.toLocaleString()} VND`}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "red", fontWeight: "bold" }}
                >
                  {`${product.discountPrice.toLocaleString()} VND`}
                </Typography>
                {discountPercentage > 0 && (
                  <Typography
                    variant="body2"
                    sx={{ color: "green", fontWeight: "bold", mt: 1 }}
                  >
                    {`-${discountPercentage}%`}
                  </Typography>
                )}
              </Box>
            )}

            <Typography sx={{ mt: 1 }}>
              Status: {product.status || "N/A"}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Specs: {product.specs || "N/A"}
            </Typography>
            <Rating
              name="read-only"
              value={product.rating || 0}
              readOnly
              sx={{ mt: 1 }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

// ProductGrid Component
const ProductGrid = ({ products, onProductClick }) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={3} key={product.id}>
          <ProductCard
            product={product}
            onClick={() => onProductClick(product)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

// ProductGrid Component
const GridProduct = () => {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    price: "all",
    specification: "all",
    brand: "all",
    tag: "all",
    sort: "price",
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Laptop Dell XPS",
      description: "Powerful laptop for professionals.",
      originalPrice: 12000000, // Giá gốc
      discountPrice: 10000000, // Giá đã giảm
      status: "In Stock",
      category: "gaming",
      specs: "Core i5, 8GB RAM",
      specification: "i5",
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/300",

      brand: "dell",
      tag: "bestSeller",
    },
    {
      id: 2,
      title: "Laptop HP Spectre",
      description: "Sleek design and powerful performance.",
      originalPrice: 17000000,
      discountPrice: 15000000,
      status: "In Stock",
      category: "office",
      specs: "Core i7, 16GB RAM",
      specification: "i7",
      rating: 4.7,
      imageUrl: "https://via.placeholder.com/300",

      brand: "hp",
      tag: "new",
    },
    {
      id: 3,
      title: "Laptop Dell XPS",
      description: "Powerful laptop for professionals.",
      originalPrice: 12000000, // Giá gốc
      discountPrice: 10000000, // Giá đã giảm
      status: "In Stock",
      category: "gaming",
      specs: "Core i9, 8GB RAM",
      specification: "i9",
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/300",

      brand: "asus",
      tag: "bestSeller",
    },
    {
      id: 4,
      title: "Laptop HP Spectre",
      description: "Sleek design and powerful performance.",
      originalPrice: 17000000,
      discountPrice: 15000000,
      status: "In Stock",
      category: "office",
      specs: "Core i7, 16GB RAM",
      specification: "i7",
      rating: 4.7,
      imageUrl: "https://via.placeholder.com/300",

      brand: "hp",
      tag: "new",
    },
    {
      id: 5,
      title: "Laptop Acer XPS",
      description: "Powerful laptop for professionals.",
      originalPrice: 12000000, // Giá gốc
      discountPrice: 10000000, // Giá đã giảm
      status: "In Stock",
      category: "gaming",
      specs: "Core i5, 8GB RAM",
      specification: "i5",
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/300",

      brand: "acer",
      tag: "bestSeller",
    },
    {
      id: 6,
      title: "Laptop HP Spectre",
      description: "Sleek design and powerful performance.",
      originalPrice: 17000000,
      discountPrice: 15000000,
      status: "In Stock",
      category: "office",
      specs: "Core i7, 16GB RAM",
      specification: "i7",
      rating: 4.7,
      imageUrl: "https://via.placeholder.com/300",

      brand: "hp",
      tag: "new",
    },
    {
      id: 7,
      title: "Laptop Dell XPS",
      description: "Powerful laptop for professionals.",
      originalPrice: 12000000, // Giá gốc
      discountPrice: 10000000, // Giá đã giảm
      status: "In Stock",
      category: "office",
      specs: "Core i3, 8GB RAM",
      specification: "i3",
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/300",

      brand: "dell",
      tag: "bestSeller",
    },
    {
      id: 8,
      title: "Laptop HP Spectre",
      description: "Sleek design and powerful performance.",
      originalPrice: 17000000,
      discountPrice: 15000000,
      status: "In Stock",
      category: "gaming",
      specs: "Core i7, 16GB RAM",
      specification: "i7",
      rating: 4.7,
      imageUrl: "https://via.placeholder.com/300",

      brand: "hp",
      tag: "new",
    },
    {
      id: 9,
      title: "Laptop SamSung",
      description: "Powerful laptop for professionals.",
      originalPrice: 12000000, // Giá gốc
      discountPrice: 10000000, // Giá đã giảm
      status: "In Stock",
      category: "gaming",
      specs: "Core i5, 8GB RAM",
      specification: "i5",
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/300",

      brand: "samsung",
      tag: "bestSeller",
    },
    {
      id: 10,
      title: "Laptop HP Spectre",
      description: "Sleek design and powerful performance.",
      originalPrice: 17000000,
      discountPrice: 15000000,
      status: "In Stock",
      category: "office",
      specs: "Core i9, 16GB RAM",
      specification: "i9",
      rating: 4.7,
      imageUrl: "https://via.placeholder.com/300",

      brand: "hp",
      tag: "new",
    },
  ]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearchChange = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleSortChange = (name, value) => {
    setFilters({ ...filters, sort: value });
  };

  const handleProductClick = (product) => {
    alert(`Clicked on ${product.title}`);
  };

  const filteredProducts = products.filter((product) => {
    // Apply search filter
    const matchesSearch =
      product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.toLowerCase());

    // Apply category, price, specification, brand, tag filters
    const matchesCategory =
      filters.category === "all" || product.category === filters.category;
    const matchesPrice =
      filters.price === "all" || product.priceRange === filters.price;
    const matchesSpec =
      filters.specification === "all" ||
      product.specification === filters.specification; // Sửa ở đây
    const matchesBrand =
      filters.brand === "all" || product.brand === filters.brand;
    const matchesTag = filters.tag === "all" || product.tag === filters.tag;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesSpec && // Sửa ở đây
      matchesBrand &&
      matchesTag
    );
  });

  // Sort products based on filters.sort
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (filters.sort === "price") {
      return parseFloat(a.price) - parseFloat(b.price);
    }
    if (filters.sort === "name") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <>
      <TopAppBar />
      <Container
        sx={{
          marginTop: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* Search Bar */}
        <SearchBar onSearchChange={handleSearchChange} />

        {/* Filter Bar */}
        <FilterBar onFilterChange={handleFilterChange} />

        {/* Sort Bar */}
        <SortBar onSortChange={handleSortChange} />

        {/* Product Grid */}
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <ProductGrid
              products={sortedProducts}
              onProductClick={handleProductClick}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default GridProduct;
