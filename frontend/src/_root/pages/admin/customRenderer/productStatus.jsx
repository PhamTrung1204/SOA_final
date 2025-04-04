/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import Chip from '@mui/material/Chip';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import DoneIcon from '@mui/icons-material/Done';
import {
  GridEditModes,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import { ErrorOutlined, HourglassTopOutlined, WarningOutlined } from '@mui/icons-material';

export const STATUS_OPTIONS = ['available', 'out of stock', 'unavailable', 'incoming'];

const StyledChip = styled(Chip)(({ theme }) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit',
  },
  '&.incoming': {
    color: (theme.vars || theme).palette.secondary.main,
    border: `1px solid ${(theme.vars || theme).palette.secondary.main}`,
  },
  '&.available': {
    color: (theme.vars || theme).palette.success.main,
    border: `1px solid ${(theme.vars || theme).palette.success.main}`,
  },
  '&.unavailable': {
    color: (theme.vars || theme).palette.warning.main,
    border: `1px solid ${(theme.vars || theme).palette.warning.main}`,
  },
  '&.out-of-stock': {
    color: (theme.vars || theme).palette.error.main,
    border: `1px solid ${(theme.vars || theme).palette.error.main}`,
  },
}));

const Status = (props) => {
  const { status } = props;

  let icon = null;
  if (status === 'out of stock') {
    icon = <ErrorOutlined className="icon" />;
  } else if (status === 'available') {
    icon = <DoneIcon className="icon" />;
  } else if (status === 'unavailable') {
    icon = <WarningOutlined className="icon" />;
  } else if (status === 'incoming') {
    icon = <HourglassTopOutlined className="icon" />;
  }

  return (
    <StyledChip
      className={status.replace(/\s/g, '-')}
      icon={icon}
      size="small"
      label={status}
      variant="outlined"
      sx={{ alignItems: 'center', fontFamily: 'Nunito', userSelect: 'none', textTransform: 'capitalize' }}
    />
  );
};

Status.propTypes = {
  status: PropTypes.string
}

function EditStatus(props) {
  const { id, value, field } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const handleChange = async (event) => {
    const isValid = await apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });

    if (isValid && rootProps.editMode === GridEditModes.Cell) {
      apiRef.current.stopCellEditMode({ id, field, cellToFocusAfter: 'below' });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      sx={{
        height: '100%',
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          pl: 1,
        },
      }}
      autoFocus
      fullWidth
      open
    >
      {STATUS_OPTIONS.map((option) => {
        let IconComponent = null;
        if (option === 'available') {
          IconComponent = DoneIcon;
        } else if (option === 'out of stock') {
          IconComponent = ErrorOutlined;
        } else if (option === 'unavailable') {
          IconComponent = WarningOutlined;
        } else if (option === 'incoming') {
          IconComponent = HourglassTopOutlined;
        }

        return (
          <MenuItem key={option} value={option}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <IconComponent fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={option} sx={{ overflow: 'hidden', textTransform: 'capitalize' }} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function renderProductStatus(params) {
  if (params.value == null) {
    return '';
  }

  return <Status status={params.value} />;
}

export function renderEditProductStatus(params) {
  return <EditStatus {...params} />;
}
