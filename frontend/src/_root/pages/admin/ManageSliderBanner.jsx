/* eslint-disable react/prop-types */
import { DataGrid, GridActionsCellItem, GridRowModes } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import DataGridConfirmDialog from '../../../components/dialogs/DataGridConfirmDialog.jsx';
import { CustomEditImageCell, CustomGridToolbar, CustomPageContainer, ManagePageSearch } from "../../../components";
import { enqueueSnackbar as toaster } from 'notistack';
import { Box, styled } from '@mui/material';
import { Cancel, Delete, Edit, Save } from '@mui/icons-material';
import { useCreateCarousel, useDeleteCarousel, useReadAllCarouselAdmin, useUpdateCarousel } from '../../../api/queries.js';
import renderImageSamples from './customRenderer/renderImageSamples.jsx';

const StyledBox = styled('div')(({ theme }) => ({
  '& .Mui-error': {
    ...theme.applyStyles('dark', {
      color: "#000"
    })
  },
}));

const columnFields = [
  {
    field: 'imgUrl',
    headerName: 'Avatar',
    display: 'flex',
    width: 200,
    renderCell: ({ value }) => renderImageSamples({ value: [value], width: '100%', height: 'auto' }),
    valueGetter: (value, row) => row.imgUrl,
    sortable: false,
    filterable: false,
    editable: true
  },
  { field: 'title', headerName: 'Tiêu đề', width: 150, editable: true, isRequired: true },
  { field: 'slug', headerName: 'Slug', flex: 1, minWidth: 150, editable: true, isRequired: true },
];

function ManageSliderBanner() {
  const [updateCellError, setUpdateCellError] = useState({})
  const [rows, setRows] = useState()
  const [rowModesModel, setRowModesModel] = useState({})
  const [rowChanges, setRowChanges] = useState(null)
  const [searchValue, setSearchValue] = useState("")

  const [deleteDialogPayload, setDeleteDialogPayload] = useState({ state: false, id: null });
  const [updateDialogPayload, setUpdateDialogPayload] = useState({ state: false, id: null });



  const { data, isLoading } = useReadAllCarouselAdmin();
  const { mutateAsync: createSliderBanner, isPending:isCreating } = useCreateCarousel();
  const { mutateAsync: updateSpecification, isPending:isUpdating } = useUpdateCarousel();
  const { mutateAsync: deleteRecord, isPending:isDeleting } = useDeleteCarousel();

  const breadcrumbs = [
    { path: '/', title: 'Home' },
    { path: '/manage-slider-banner', title: 'Quản lý slider banner' },
  ]

  useEffect(() => {
    setRows(data);
  }, [data])

  columnFields[0].renderEditCell = (params) => <CustomEditImageCell {...params} />

  const handleEditCellProps = (arg) => {
    const { field, row, isRequired, props, type, min, max } = arg;
    const { value } = props;
    setRowChanges(prev => ({ ...prev, [field]: value !== row[field] }));

    let errorMessage;
    console.log(props);

    if (type === 'number') {
      if ((isRequired && !value) || typeof value !== 'number')
        errorMessage = `Require Number`
      else if (value < min)
        errorMessage = `Min is ${min}`
      else if (value > max)
        errorMessage = `Max is ${max}`


    } else if (isRequired && (!value || !value?.toString().trim())) {
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
        const id = row._id ? row._id : row.id;
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

  console.log(rows);



  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    // navigate('manage-item', { state: rows?.find(row => row._id === id || row.id === id) })
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


    const isDeleted = await deleteRecord(id);
    setDeleteDialogPayload({ state: false, id: null });

    if (!isDeleted) {
      toaster("Xóa thất bại", { variant: 'error' })
      throw new Error(isDeleted);

    }
    setRows(rows.filter((row) => row.accountCode !== id));
  }

  const handleUpdate = async (newRow, oldRow) => {
    let newData;

    if (newRow.isNew) {
      newData = await createSliderBanner(newRow);

      if (!newData) {
        toaster("Tạo thất bại.", { variant: 'error' })
        setUpdateDialogPayload({ state: false, id: null });
        return oldRow;
      }
      toaster("Tạo thành công.", { variant: 'success' })
    } else {
      const updatedData = await updateSpecification(newRow);

      if (!updatedData) {
        toaster("Cập nhật thất bại.", { variant: 'error' })
        setUpdateDialogPayload({ state: false, id: null });

        return oldRow;
      }
      newData = { ...newRow, ...updatedData };
      toaster("Cập nhật thành công.", { variant: 'success' })
    }
    setUpdateDialogPayload({ state: false, id: null });

    return newData

  }

  function confirmUpdate(isAccept) {
    if (isAccept) {
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [updateDialogPayload.id]: { mode: GridRowModes.View },
      }))
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
      title='Quản lý kho hàng'
      breadCrumbs={breadcrumbs}
      sx={{ maxWidth: { xl: 'unset', lg: '94vw', sm: '92vw', xs: '100vw' } }}
    >
      <DataGridConfirmDialog
        isPending={isDeleting}
        onClick={handleDeleteClick}
        state={deleteDialogPayload.state}
        title="Xác nhận xóa?"
        content="Sản phẩm, bao gồm cả thông tin sẽ bị xóa vĩnh viễn và không thể khôi phục."
      />
      <DataGridConfirmDialog
        onClick={confirmUpdate}
        isPending={isUpdating || isCreating}
        state={updateDialogPayload.state}
        title="Xác nhận cập nhật?"
        content="Sau khi cập nhật, thông tin sẽ được thay đổi trên toàn bộ hệ thống."
      />
      <StyledBox>
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id ? row._id : row.id}
          rows={rows}
          columns={columns}
          editMode='row'
          rowModesModel={rowModesModel}
          slots={{ toolbar: CustomGridToolbar }}
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
          rowHeight={200}
          pageSizeOptions={[5, 10]}
        />
      </StyledBox>

    </CustomPageContainer>
  )
}

export default ManageSliderBanner