import { Typography } from "@mui/material"


const CustomTypography
    = ({ children, fontSize, wrap, ...props }) => {
        return <Typography
            {...props}
            sx={{ '&.MuiTypography-root': { fontSize: fontSize + " !important" }, textWrap: wrap && 'wrap !important' }}
        >
            {children}
        </Typography>
    }

CustomTypography.propTypes

export default CustomTypography;



