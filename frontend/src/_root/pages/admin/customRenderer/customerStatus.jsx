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
import { DoNotDisturbAltOutlined, Warning } from '@mui/icons-material';

export const STATUS_OPTIONS = ['active', 'inactive', 'suspended'];

const StyledChip = styled(Chip)(({ theme }) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit',
  },
  '&.': {
    color: (theme.vars || theme).palette.info.dark,
    border: `1px solid ${(theme.vars || theme).palette.info.main}`,
  },
  '&.active': {
    color: (theme.vars || theme).palette.success.dark,
    border: `1px solid ${(theme.vars || theme).palette.success.main}`,
  },
  '&.suspended': {
    color: (theme.vars || theme).palette.warning.dark,
    border: `1px solid ${(theme.vars || theme).palette.warning.main}`,
  },
  '&.inactive': {
    color: (theme.vars || theme).palette.error.dark,
    border: `1px solid ${(theme.vars || theme).palette.error.main}`,
  },
}));

const Status = (props) => {
  const { status } = props;

  let icon = null;
  if (status === 'inactive') {
    icon = <DoNotDisturbAltOutlined className="icon" />;
  } else if (status === 'active') {
    icon = <DoneIcon className="icon" />;
  } else if (status === 'suspended') {
    icon = <Warning className="icon" />;
  }

  return (
    <StyledChip
      className={status}
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
        if (option === 'active') {
          IconComponent = DoneIcon;
        } else if (option === 'inactive') {
          IconComponent = DoNotDisturbAltOutlined;
        } else if (option === 'suspended') {
          IconComponent = Warning;
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

export function renderCustomerStatus(params) {
  if (params.value == null) {
    return '';
  }

  return <Status status={params.value} />;
}

export function renderEditCustomerStatus(params) {
  return <EditStatus {...params} />;
}
