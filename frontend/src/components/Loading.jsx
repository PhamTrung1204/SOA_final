import { Box } from '@mui/material';
import { LoadingIcon } from '../assets';

function Loading() {
    const isLight = window.localStorage.getItem('toolpad-mode');
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mx: 'auto', filter: isLight && "brightness(0)" }} component='img' src={LoadingIcon} />
    )
}

export default Loading