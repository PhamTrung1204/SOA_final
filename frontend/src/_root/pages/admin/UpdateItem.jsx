/* eslint-disable react/prop-types */
import { DataGrid, GridActionsCellItem, GridRowModes, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import DataGridConfirmDialog from '../../../components/dialogs/DataGridConfirmDialog.jsx';
import { CustomEditCell, CustomEditDropdownCell, CustomPageContainer } from "../../../components";
import { enqueueSnackbar as toaster } from 'notistack';
import { Box, styled } from '@mui/material';
import { Cancel, Delete, Edit, Save } from '@mui/icons-material';
import { useDeleteSpecificationKeyValue, useReadAllSpecificationKeyAdmin, useUpdateSpecificationKeyValue } from '../../../api/queries.js';
import { useLocation } from 'react-router-dom';

const StyledBox = styled('div')(({ theme }) => ({
  '& .Mui-error': {
    ...theme.applyStyles('dark', {
      color: "#000"
    })
  },
}));

const columnFields = [
  { field: 'key', header: 'Thông số', flex:1, minWidth: 150, editable: true, valueFormatter: (value) => value ? value?.key : '', renderEditCell: (params) => (<CustomEditCell {...params} />), isRequired: true },
  { field: 'value', header: 'Thông tin', flex:1, minWidth: 150, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} />), isRequired: true },
]

function UpdateItem() {
  const location = useLocation();
  const variant = location.state;
  const [updateCellError, setUpdateCellError] = useState({})
  const [rows, setRows] = useState()
  const [rowModesModel, setRowModesModel] = useState({})
  const [rowChanges, setRowChanges] = useState(null)

  const [deleteDialogPayload, setDeleteDialogPayload] = useState({ state: false, id: null });
  const [updateDialogPayload, setUpdateDialogPayload] = useState({ state: false, id: null });
  
console.log(rows);

  // const { data, isLoading } = useReadAllSpecificationAdmin();
  const { mutateAsync: updateSpecification } = useUpdateSpecificationKeyValue();
  const { mutateAsync: deleteSpecification } = useDeleteSpecificationKeyValue();
  const { data: specificationKeys, } = useReadAllSpecificationKeyAdmin();

  const breadcrumbs = [
    { path: '/', title: 'Home' },
    { path: '/manage-inventory', title: 'Quản lý kho hàng' },
    { path: '/manage-item', title: 'Thông số kỹ thuật' },
  ]

  useEffect(() => {
    columnFields[0].renderEditCell = (params) => (
      <CustomEditDropdownCell {...params} labelField="key" options={specificationKeys.map(specKey => specKey.key)} />
  );
  }, [specificationKeys]);

  useEffect(() => setRows(variant?.specifications), [variant])

  const handleEditCellProps = (arg) => {
    const { field, row, isRequired, props, type, min, max } = arg;
    const { value } = props;
    setRowChanges(prev => ({ ...prev, [field]: value !== row[field] }));

    let errorMessage;

    if (type === 'number') {
      if ((isRequired && !value) || typeof value !== 'number')
        errorMessage = `Require Number`
      else if (value < min)
        errorMessage = `Min is ${min}`
      else if (value > max)
        errorMessage = `Max is ${max}`

    } else if (isRequired && !value || !value.toString().trim()) {
      errorMessage = 'Require'
    }
    // const errorMessage = (!value || value.trim() === "") ? "Require" : ""
    setUpdateCellError(prev => ({ ...prev, [field]: errorMessage }))
    return { ...props, error: value !== row[field] && errorMessage };
  }

  const columns = [
    ...columnFields.map(column => (
      { ...column, preProcessEditCellProps: (params) => handleEditCellProps({ ...params, ...column }) })),
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      align: 'center',
      cellClassName: 'actions',
      getActions: ({ row }) => {
        const id = row.key?._id;
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={() => setUpdateDialogPayload({ state: true, id: id, row })}
              key="save"
              disabled={
                !rowChanges || !Object.values(rowChanges).some((changed) => changed) ||
                Object.values(updateCellError).some((error) => error)
              }
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="error"
              key="cancel"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            key="edit"
          />,
          <GridActionsCellItem
            icon={<Delete color='error' />}
            label="Delete"
            onClick={() => setDeleteDialogPayload({ state: true, id: id })}
            color="inherit"
            key="delete"
          />
        ];
      }
    }
  ];

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    //new => delete from rows

    const editedRow = rows.find((row) => row.id === id || row._id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleDeleteClick = async (isAccept) => {
    const { id } = deleteDialogPayload

    if (!isAccept) {
      setDeleteDialogPayload({ state: false, id: null });
      return;
    }


    const isDeleted = await deleteSpecification(`${variant._id}/${id}`);
    setDeleteDialogPayload({ state: false, id: null });

    if (!isDeleted) {
      toaster("Xóa thất bại", { variant: 'error' })
      throw new Error(isDeleted);

    }
    setRows(rows.filter((row) => row.key._id !== id));
  }

  const handleUpdate = async (newRow, oldRow) => {
    let newData;
    
    const updatedData = await updateSpecification({specificationId:`${variant._id}/${oldRow.key._id}`,specification:newRow});

    if (!updatedData) {
      toaster("Cập nhật thất bại.", { variant: 'error' })
      return oldRow;
    }
    newData = { ...newRow, ...updatedData };
    
    setRows(prev=> prev.map(row=>row.key.key === oldRow.key.key || row.value === oldRow.value ? newRow : row))
    toaster("Cập nhật thành công.", { variant: 'success' })

    return newData

  }

  function confirmUpdate(isAccept) {
    if (isAccept) {
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [updateDialogPayload.id]: { mode: GridRowModes.View },
      }))
      setUpdateDialogPayload({ state: false, id: null });
      setRowChanges(null);
    } else
      setUpdateDialogPayload((prev) => ({ ...prev, state: false }));
  }

  const handleUpdateError = (error) => {
    console.error(error);
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };




  return (
    <CustomPageContainer
      title='Thông số kỹ thuật'
      breadCrumbs={breadcrumbs}
      sx={{ maxWidth: { xl: 'unset', lg: '94vw', sm: '92vw', xs: '100vw' } }}
    >
      <Box
        display='flex'
        width='100%'
        justifyContent='flex-end'
        mb={3}
      >
      </Box>
      <DataGridConfirmDialog
        onClick={handleDeleteClick}
        state={deleteDialogPayload.state}
        title="Xác nhận xóa?"
        content="Sản phẩm, bao gồm cả thông tin sẽ bị xóa vĩnh viễn và không thể khôi phục."
      />
      <DataGridConfirmDialog
        onClick={confirmUpdate}
        state={updateDialogPayload.state}
        title="Xác nhận cập nhật?"
        content="Sau khi cập nhật, thông tin sẽ được thay đổi trên toàn bộ hệ thống."
      />
      <StyledBox>
        <DataGrid
          getRowId={(row) => row.key?._id || row.value}
          rows={rows}
          columns={columns}
          editMode='row'
          rowModesModel={rowModesModel}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { setRows, setRowModesModel, columnFields: columns.map(column => column.field) } }}
          processRowUpdate={handleUpdate}
          onRowEditStop={handleRowEditStop}
          onProcessRowUpdateError={handleUpdateError}
          onRowModesModelChange={handleRowModesModelChange}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </StyledBox>

    </CustomPageContainer>
  )
}

export default UpdateItem