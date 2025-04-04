import { Box } from '@mui/material'

function renderImageSamples({ value, width, height }) {
    return (
        <Box display="flex" gap={1} maxWidth="100%" sx={{ overflowX: "auto" }}>
            {
                value.map((url, index) => (
                    <Box
                        key={index}
                        component="img"
                        alt="product-image"
                        sx={{
                            width: width || '48px',
                            height: height || '48px',
                            objectFit: 'cover',
                        }}
                        src={url}
                    />
                ))
            }
        </Box>
    )
}

export default renderImageSamples