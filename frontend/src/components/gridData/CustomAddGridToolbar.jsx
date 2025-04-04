/* eslint-disable react/prop-types */
import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";

function CustomAddGridToolbar(props) {
  const { setRows, rows, setRowModesModel, columnFields, onClick } = props;

  const handleClick = onClick ? onClick :
    () => {
      const id = new Date().toISOString();

      setRows([
        ...rows,
        { ...columnFields, id, isNew: true },
      ]);
      setRowModesModel({
        ...rows,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: columnFields.find(field => field.endsWith('Code')) },
      });
    };

  return (
    <GridToolbarContainer
      sx={{ justifyContent: 'flex-end' }}
    >
      <IconButton color="primary" variant="outlined" onClick={handleClick} sx={{ fontFamily: 'inter' }}>
        <Add/>
      </IconButton>
    </GridToolbarContainer>
  );
}

export default CustomAddGridToolbar