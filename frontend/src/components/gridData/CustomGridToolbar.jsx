/* eslint-disable react/prop-types */
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { GridRowModes, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";

function CustomGridToolbar(props) {
  const { setRows, setRowModesModel, columnFields, onClick } = props;

  const handleClick = onClick ? onClick :
    () => {
      const id = new Date().toISOString();;

      setRows((oldRows) => [
        ...oldRows,
        { ...columnFields, id, isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: columnFields.find(field => field.endsWith('Code')) },
      }));
    };

  return (
    <GridToolbarContainer
      sx={{ justifyContent: 'space-between' }}
    >
      <GridToolbar />
      <Button color="primary" variant="contained" startIcon={<Add />} onClick={handleClick} sx={{ fontFamily: 'inter' }}>
        Add
      </Button>
    </GridToolbarContainer>
  );
}

export default CustomGridToolbar