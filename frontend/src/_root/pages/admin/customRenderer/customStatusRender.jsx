import Chip from '@mui/material/Chip';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import DoneIcon from '@mui/icons-material/Done';
import { DoNotDisturbAltOutlined, Warning } from '@mui/icons-material';
import PropTypes from 'prop-types';
import {
  GridEditModes,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid';

export const STATUS_TYPES = {
  active: {
    label: 'active',
    color: 'success',
    icon: DoneIcon,
  },
  inactive: {
    label: 'inactive',
    color: 'error',
    icon: DoNotDisturbAltOutlined,
  },
  suspended: {
    label: 'suspended',
    color: 'warning',
    icon: Warning,
  },
};

const StyledChip = styled(Chip)(({ theme, color }) => ({
  justifyContent: 'left',
  color: (theme.vars || theme).palette[color].dark,
  border: `1px solid ${(theme.vars || theme).palette[color].main}`,
  '& .icon': {
    color: 'inherit',
  },
}));

const Status = ({ status, options = STATUS_TYPES }) => {
  const statusConfig = options[status] || {};
  const IconComponent = statusConfig.icon;

  return (
    <StyledChip
      className={status}
      icon={IconComponent ? <IconComponent className="icon" /> : null}
      size="small"
      label={statusConfig.label || status}
      variant="outlined"
      color={statusConfig.color || 'default'}
      sx={{ alignItems: 'center', fontFamily: 'Nunito', userSelect: 'none', textTransform: 'capitalize' }}
    />
  );
};

Status.propTypes = {
  status: PropTypes.string.isRequired,
  options: PropTypes.object,
};

function EditStatus({ id, value, field, options = STATUS_TYPES }) {
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
      {Object.keys(options).map((optionKey) => {
        const option = options[optionKey];
        const IconComponent = option.icon;

        return (
          <MenuItem key={optionKey} value={optionKey}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {IconComponent && <IconComponent fontSize="small" />}
            </ListItemIcon>
            <ListItemText primary={option.label} sx={{ overflow: 'hidden', textTransform: 'capitalize' }} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

EditStatus.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  options: PropTypes.object,
};

export function renderCustomStatus(params, options) {
  if (params.value == null) {
    return '';
  }

  return <Status status={params.value} options={options} />;
}

export function renderEditCustomStatus(params, options) {
  return <EditStatus {...params} options={options} />;
}
