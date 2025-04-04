import { Box, Button, CircularProgress, Divider, FormControl, Grid2, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useReadAllBrand, useReadAllCategory, useReadAllSpecificationAdmin } from '../../api/queries'
import setDeepState, { } from '../../util/setDeepState'

function FilterNav({ setFilterParams, params }) {
    const setFilter = setDeepState(setFilterParams);


    const { data: brands, isLoading: isLoadingBrands } = useReadAllBrand();
    const { data: categories, isLoading: isLoadingCategories } = useReadAllCategory();
    if (isLoadingBrands || isLoadingCategories) return <Box display="flex" justifyContent="center" width="100%">
        <CircularProgress />
    </Box>;

    return (
        <Box sx={{ mb: 2 }}>  {/* Add margin bottom for spacing */}
            <Box display='inline-flex' gap={2} overflow="auto" width="100%" mb={1}>
                {
                    brands.map(brand => {

                        return (
                            <Button
                                key={brand._id} variant='outlined'
                                onClick={() => setFilter('brand', brand)}
                            >
                                <Typography variant='button'>{brand.brandName}</Typography>
                            </Button>
                        )
                    })
                }
            </Box>
            <Box display='inline-flex' gap={2} overflow="auto" width="100%" mb={1}>
                {
                    categories.map(category => {
                        return (
                            <Button
                                key={category._id}
                                variant="outlined"
                                onClick={() => setFilter("category", category)}
                            >
                                <Typography
                                    variant="button"
                                    sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "visible",
                                        textOverflow: "unset"
                                    }}
                                >
                                    {category.categoryName}
                                </Typography>
                            </Button>
                        )
                    })
                }
            </Box>


        </Box>
    )
}
// <Typography variant="h6" sx={{ mb: 1 }}>Chọn theo tiêu chí</Typography> {/* Section title */}
// <Grid2 container gap={1}>
//     <Grid2 size={{ xs: 4, sm: 3, md: 12 / 5 }}>
//         <FormControl fullWidth>
//             <InputLabel id="brand-label">Nhãn hiệu</InputLabel>
//             <Select
//                 sx={{ minWidth: '200px' }}
//                 labelId="brand-label"
//                 id="brand"
//                 name="brand"
//                 value={selectedFilters?.brand || ''}
//                 label="Brand"
//                 onChange={(e) => setFilter('brand', e.target.value)}
//             >
//                 {brands.map(({ brandName }) => (
//                     <MenuItem key={brandName} value={brandName}>{brandName}</MenuItem>
//                 ))}
//             </Select>
//         </FormControl>
//     </Grid2>
// </Grid2>


export default FilterNav