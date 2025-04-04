import { Box, Stack, Typography } from "@mui/material"
import { LoadingIcon } from "../../assets"
import CustomTypography from "../typography/CustomTypography"

function HighLightCard({ title, value, isLoading }) {
  const isLight = window.localStorage.getItem('toolpad-mode') === 'light';
  return (
    <Stack alignItems='center' height="100%">
      <CustomTypography textAlign="center" lineHeight={1} wrap maxWidth="100%" fontSize="1.2rem" fontWeight="400">{title}</CustomTypography>
      {
        isLoading ?
          <Box display='flex' alignItems='center' height="100%" width="100%" justifyContent='center'>
            <Box sx={{ filter: isLight && "brightness(0)" }} component='img' src={LoadingIcon} />
          </Box> :
          <Box display='flex' alignItems='center' height="100%" width="100%" justifyContent='center'>
            <Typography my='auto' variant="body1">{value}</Typography>
          </Box>
      }
    </Stack>
  )
}

export default HighLightCard