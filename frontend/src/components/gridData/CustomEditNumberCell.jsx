import { Box, styled, Tooltip, tooltipClasses } from '@mui/material';
import { GridEditInputCell } from '@mui/x-data-grid';

const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip arrow {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.error.main,
    }
}));

function CustomEditCell(props) {
    const { error, isRequired } = props;

    return (
        <StyledTooltip open={!!error} title={error} {...props}>
            <Box position='relative' p={0}>
                <GridEditInputCell {...props} />
                {isRequired && <span style={{ position: 'absolute', right: '4px', color: 'red' }}>*</span>}
            </Box>
        </StyledTooltip>
    )
}
export default CustomEditCell