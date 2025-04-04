/* eslint-disable react/prop-types */
import { Typography } from "@mui/material"

function Logo(props) {
    const { margin, variant, fontSize } = props
    return (
        <Typography {...props} variant={variant || "h5"} sx={{ m: margin, fontFamily: 'Nunito', color: 'primary.main', fontWeight: 'bold', fontSize: fontSize }}>
            FCOMPUTER
        </Typography>
    )
}


export default Logo