import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { PageContainer } from '@toolpad/core';
import { renderEditCustomerStatus, renderCustomerStatus, STATUS_OPTIONS } from './customRenderer/customerStatus.jsx';
import { useDeleteAccount, useReadAllAccount, useUpdateAccountStatus } from '../../../api/queries.js';
import { Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import DataGridConfirmDialog from '../../../components/dialogs/DataGridConfirmDialog.jsx';
import { CustomPageContainer, ManagePageSearch } from "../../../components";
import { enqueueSnackbar as toaster } from 'notistack';
import { Box } from '@mui/material';
import { formatDDMMYYY } from '../../../util/datetimeHandler.js';


function ManageAccount() {
  const [searchValue, setSearchValue] = useState('')
  const [rows, setRows] = useState()
  const { data, isLoading } = useReadAllAccount();
  const [dialogPayload, setDialogPayload] = useState({ state: false, id: null });
  const { mutateAsync: deleteAccount } = useDeleteAccount();
  const { mutateAsync: updateAccountStatus } = useUpdateAccountStatus();


  const breadcrumbs = [
    { path: '/', title: 'Home' },
    { path: '/manage-account', title: 'Quản lý tài khoản' },
  ]

  useEffect(() => setRows(data), [data])
  console.log(data);
  

  const columns = [
    { field: 'accountCode', headerName: 'Id', width: 150 },
    { field: 'username', headerName: 'Tên tài khoản', width: 150 },
    { field: 'firstName', headerName: 'Họ', width: 80 },
    { field: 'lastName', headerName: 'Tên', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phoneNumber', headerName: 'Số điện thoại', width: 150 },
    { field: 'dateOfBirth', headerName: 'Ngày sinh', width: 150, valueFormatter: (value) => formatDDMMYYY(new Date(value)) },
    {
      field: 'accountStatus', headerName: 'Trạng thái', width: 150, renderCell: renderCustomerStatus,
      renderEditCell: renderEditCustomerStatus,
      type: 'singleSelect',
      valueOptions: STATUS_OPTIONS,
      editable: true,
      align: 'center'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      align: 'center',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [<GridActionsCellItem
          icon={<Delete color='error' />}
          label="Delete"
          onClick={() => setDialogPayload({ state: true, id: id })}
          color="inherit"
          key="delete"
        />]
      }
    }
  ];

  const handleDeleteClick = async (isAccept) => {
    console.log(isAccept);

    const { id } = dialogPayload

    if (!isAccept) {
      setDialogPayload({ state: false, id: null });
      return;
    }


    await deleteAccount(id)
    setRows(rows.filter((row) => row.accountCode !== id));
    setDialogPayload({ state: false, id: null });
  }

  const handleUpdate = async (updatedRow) => {
    await updateAccountStatus(updatedRow)
    toaster("Cập nhật trạng thái tài khoản thành công", { variant: 'success' })
    return updatedRow;
  }

  const handleUpdateError = () => {
    toaster("Cập nhật trạng thái tài khoản thất bại", { variant: 'error' })
  }

  const handleSearch = () => {
    console.log(searchValue);

  }


  return (
    <CustomPageContainer
      title='Quản lý tài khoản'
      breadCrumbs={breadcrumbs}
      sx={{ maxWidth: { xl: 'unset', lg: '94vw', sm: '92vw', xs: '100vw' } }}
    >
      <Box
        display='flex'
        width='100%'
        justifyContent='flex-end'
        mb={3}
      >
        <ManagePageSearch
          {...{ searchValue, setSearchValue, handleSearch }}
        />
      </Box>
      <DataGridConfirmDialog
        onClick={handleDeleteClick}
        state={dialogPayload.state}
        title="Xác nhận xóa?"
        content="Người dùng, bao gồm cả thông tin sẽ bị xóa vĩnh viễn và không thể khôi phục."
      />
      <DataGrid
        getRowId={(row) => row.accountCode}
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        processRowUpdate={handleUpdate}
        onProcessRowUpdateError={handleUpdateError}
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

    </CustomPageContainer>
  )
}

export default ManageAccount