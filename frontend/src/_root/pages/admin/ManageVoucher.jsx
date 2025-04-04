/* eslint-disable react/prop-types */
import { DataGrid, GridActionsCellItem, GridRowModes } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import DataGridConfirmDialog from '../../../components/dialogs/DataGridConfirmDialog.jsx';
import { CustomEditCell, CustomGridToolbar, CustomPageContainer, FilterDrawer, ManagePageSearch } from "../../../components";
import { enqueueSnackbar as toaster } from 'notistack';
import { Box, Button, ButtonGroup, Drawer, styled } from '@mui/material';
import { Cancel, Delete, Edit, FilterAlt, FilterAltOff, Save } from '@mui/icons-material';
import { useCreateVoucher, useDeleteVoucher, useReadAllVoucherAdmin, useSearchVoucherAdmin, useUpdateVoucher } from '../../../api/queries.js';
import setDeepState from '../../../util/setDeepState.js'

const StyledBox = styled('div')(({ theme }) => ({
  '& .Mui-error': {
    backgroundColor: "#ffcdd2",
    ...theme.applyStyles('dark', {
      color: "#000"
    })
  },
}));

const columnFields = [
  { field: 'voucherCode', headerName: 'Mã voucher', width: 200, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} />), isRequired: true },
  { field: 'voucherName', headerName: 'Tên voucher', width: 200, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} />), isRequired: true },
  {
    field: 'discountPercentage', headerName: 'Tỉ lệ giảm (%)',
    valueFormatter: (value) => {
      if (value == null) {
        return '';
      }
      return `${(value * 100).toLocaleString()} %`;
    },
    type: 'number',
    width: 200, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} />)
  },
  { field: 'fixedAmount', headerName: 'Số tiền giảm', type: 'number', width: 200, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} />) },
  { field: 'description', headerName: 'Mô tả', flex: 1, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} />), isRequired: true },
]

function ManageVoucher() {
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [updateCellError, setUpdateCellError] = useState({})
  const [rows, setRows] = useState()
  const [rowModesModel, setRowModesModel] = useState({})
  const [rowChanges, setRowChanges] = useState(null)

  const [searchValue, setSearchValue] = useState()
  const [searchParam, setSearchParam] = useState()

  const { mutateAsync: createRecord } = useCreateVoucher();
  const { data, isLoading } = useReadAllVoucherAdmin();
  const { mutateAsync: updateCriterion } = useUpdateVoucher();
  const { mutateAsync: deleteRecord } = useDeleteVoucher();
  const { data: searchResult } = useSearchVoucherAdmin(searchParam);

  const [deleteDialogPayload, setDeleteDialogPayload] = useState({ state: false, id: null });
  const [updateDialogPayload, setUpdateDialogPayload] = useState({ state: false, id: null });

  const breadcrumbs = [
    { path: '/', title: 'Home' },
    { path: '/manage-voucher', title: 'Quản lý mã giảm giá' },
  ]

  useEffect(() => setRows(data), [data])

  const handleEditCellProps = (arg) => {
    const { field, row, isRequired, props, type, min, max } = arg;
    const { value } = props;
    setRowChanges(prev => ({ ...prev, [field]: value !== row[field] }));

    let errorMessage = '';
    console.log(arg);


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

  useEffect(() => {
    setTimeout(() => {
      if (!searchValue && Object.keys(searchParam) < 1) {
        return;
      }
      const param = {};
      if (searchValue.startsWith('#')) {
        param[columnFields[0].field] = searchValue.substring(1)
      } else {
        param[columnFields[1].field] = searchValue
      }
      setSearchParam(param)
    }, 1500);
  }, [searchValue]);


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

  const handleAddParam = setDeepState(setSearchParam);

  const filterList = {
    discount: {
      type: 'numberGroup',
      items: {
        minDiscount: {
          label: '% Giảm tối thiểu',
          onChange: (e) => {
            const value = e.target.value;
            const newValue = value.endsWith('%') ? value / 100 : value;
            handleAddParam('minDiscount', newValue)
          },
          placeholder: '0.01 ~ 10%'
        },
        maxDiscount: {
          label: '% Giảm tối đa',
          onChange: (e) => {
            const value = e.target.value;
            const newValue = value.endsWith('%') ? value / 100 : value;
            handleAddParam('maxDiscount', newValue)
          },
          placeholder: '0.01 ~ 10%'
        },
      }
    },
    fixedAmount: {
      type: 'numberGroup',
      items: {
        minPrice: {
          label: 'Giảm tối thiểu',
          onChange: (e) => handleAddParam('minPrice', e.target.value),
          placeholder: '10000'
        },
        maxPrice: {
          label: 'Giảm tối đa',
          onChange: (e) => handleAddParam('maxPrice', e.target.value),
          placeholder: '10000'
        }
      }
    },

  }

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
    console.log("delete");

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
      const data = {};

      columnFields.forEach(col => { data[col.field] = newRow[col.field] })

      newData = await createRecord(data);
      toaster("Tạo thành công.", { variant: 'success' })
    } else {
      const updatedData = await updateCriterion(newRow);

      if (!updatedData) {
        toaster("Cập nhật thất bại.", { variant: 'error' })
        return oldRow;
      }
      newData = { ...newRow, ...updatedData };
      toaster("Cập nhật thành công.", { variant: 'success' })
    }

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


  const handleSearch = () => {
    if (!searchValue && Object.keys(searchParam) < 1) {
      return;
    }
    setSearchParam(prev => ({ ...prev, voucherName: searchValue }))
  }

  const toggleDrawer = (newState) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsOpenFilter(newState);
  };

  return (
    <CustomPageContainer
      title='Quản lý mã giảm giá'
      breadCrumbs={breadcrumbs}
      sx={{ maxWidth: { xl: 'unset', lg: '94vw', sm: '92vw', xs: '100vw' } }}
    >
      <Drawer
        sx={{
          '& .MuiDrawer-paper': { backgroundImage: 'none', py: '80px' },
        }}
        anchor={'right'}
        open={isOpenFilter}
        onClose={toggleDrawer(false)}
      >
        <FilterDrawer
          filterList={filterList}
          toggleDrawer={toggleDrawer}
        />
      </Drawer>
      <Box
        display='flex'
        width='100%'
        justifyContent='flex-end'
        mb={3}
      >
        <ButtonGroup color='blackLight' sx={{ mr: 1 }}>
          <Button
            sx={{ width: '44px', height: '44px', minWidth: '44px' }}
          >
            <FilterAltOff />
          </Button>
          <Button
            sx={{ width: '44px', height: '44px', minWidth: '44px' }}
            onClick={toggleDrawer(true)}
          >
            <FilterAlt />
          </Button>
        </ButtonGroup>
        <ManagePageSearch
          {...{ searchValue, setSearchValue, handleSearch }}
        />
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
          getRowId={(row) => row._id ? row._id : row.id}
          rows={searchResult ? searchResult : rows}
          columns={columns}
          editMode='row'
          rowModesModel={rowModesModel}
          slots={{ toolbar: CustomGridToolbar }}
          slotProps={{ toolbar: { setRows, setRowModesModel, columnFields: columns.map(column => column.field) } }}
          processRowUpdate={handleUpdate}
          onRowEditStop={handleRowEditStop}
          onProcessRowUpdateError={handleUpdateError}
          onRowModesModelChange={handleRowModesModelChange}
          loading={isLoading}
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

export default ManageVoucher