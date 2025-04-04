import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { renderProductStatus } from './customRenderer/productStatus.jsx';
import { useEffect, useState } from 'react';
import DataGridConfirmDialog from '../../../components/dialogs/DataGridConfirmDialog.jsx';
import { CustomGridToolbar, CustomPageContainer, ManagePageSearch } from "../../../components";
import { enqueueSnackbar as toaster } from 'notistack';
import { Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useDeleteProduct, useReadAllProductAdmin, useReadAllReviewsAdmin, useSearchProductAdmin } from '../../../api/queries.js';
import { useNavigate } from 'react-router-dom';
import renderImageSamples from './customRenderer/renderImageSamples.jsx';

// const carouselSchema = mongoose.Schema({
//   title: {
//     type: String,
//     required: true, // Bắt buộc
//   },
//   imgUrl: {
//     type: String,
//     required: true, // Bắt buộc
//   },
//   slug: {
//     type: String,
//     unique: true, // Không được trùng
//   },
// });

const columnFields = [
  {
    field: 'imageUrls',
    headerName: 'Avatar',
    display: 'flex',
    renderCell: renderImageSamples,
    valueGetter: (value, row) => row.imageURLs,
    sortable: false,
    filterable: false,
   },
  { field: 'productCode', headerName: 'Id', width: 100 },
  { field: 'productName', headerName: 'Tên sản phẩm', flex: 1, minWidth: 150 },
  { field: 'description', headerName: 'Mô tả', width: 150 },
  {
    field: 'productStatus',
    headerName: 'Trạng thái',
    width: 150,
    renderCell: renderProductStatus,
    type: 'singleSelect',
    align: 'center'
  },
]

function ManageProduct() {
  const navigate = useNavigate()
  const [rows, setRows] = useState()
  const [searchValue, setSearchValue] = useState('')
  const [searchParam, setSearchParam] = useState({})
  const [detailId, setDetailId] = useState()

  
  const { data, isPending: isLoading } = useReadAllProductAdmin();
  const [dialogPayload, setDialogPayload] = useState({ state: false, id: null });
  
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { data: searchResult } = useSearchProductAdmin(searchParam);
  
  useEffect(() => {
    if(data){
      setDetailId(data[0].specs[2])
    }
  }, [data]);

  const breadcrumbs = [
    { path: '/', title: 'Home' },
    { path: '/manage-product', title: 'Quản lý sản phẩm' },
  ]

  useEffect(() => setRows(data?.map(item=>({...item, category:item?.category?.categoryName}))), [data])
  
  const columns = [
    ...columnFields,
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      align: 'center',
      cellClassName: 'actions',
      getActions: ({ row, id}) => {
        const { productCode } = row
        
        return [
          <GridActionsCellItem
            icon={<Edit/>}
            label="Edit"
            onClick={() => navigate('product-detail/'+productCode.toLowerCase(),{state:{productId: id}})}
            color="inherit"
            key="edit"
          />,
          <GridActionsCellItem
            icon={<Delete color='error' />}
            label="Delete"
            onClick={() => setDialogPayload({ state: true, id: id })}
            color="inherit"
            key="delete"
          />
        ];
      }
    }
  ];


  const handleDeleteClick = async (isAccept) => {

    const { id } = dialogPayload

    if (!isAccept) {
      setDialogPayload({ state: false, id: null });
      return;
    }


    await deleteProduct(id)
    setRows(rows.filter((row) => row.accountCode !== id));
    setDialogPayload({ state: false, id: null });
  }

  const handleUpdateError = () => {
    toaster("Cập nhật trạng thái tài khoản thất bại", { variant: 'error' })
  }

  const handleSearch = () => {
    if (!searchValue && Object.keys(searchParam).length <= 2) {
      return;
    }

    const param = {};
    if (searchValue.startsWith('#')) {
      param[columnFields[1].field] = searchValue.substring(1)
    }
    else if(searchValue.startsWith('&')){
      param[columnFields[4].field] = searchValue.substring(1)
    } 
    else {
      param[columnFields[2].field] = searchValue
    }
    setSearchParam(param)
  }

  useEffect(() => {
    setTimeout(() => {
      const param = {};
      if (searchValue.startsWith('#')) {
        param[columnFields[1].field] = searchValue.substring(1)
      }
      else if(searchValue.startsWith('&')){
        param[columnFields[4].field] = searchValue.substring(1)
      } 
      else {
        param[columnFields[2].field] = searchValue
      }
      setSearchParam(param)
    }, 1500);
  }, [searchValue]);  


  return (
    <CustomPageContainer
      title='Quản lý sản phẩm'
      breadCrumbs={breadcrumbs}
      sx={{ maxWidth: { xl: 'unset', lg: '94vw', sm: '92vw', xs: '100vw' } }}
    >
      <Box
        display='flex'
        width='100%'
        justifyContent='flex-end'
        alignItems='center'
        mb={3}
      >
        <ManagePageSearch
          {...{ searchValue, setSearchValue, handleSearch }}
        />
      </Box>
      <DataGridConfirmDialog
        isPending={isDeleting}
        onClick={handleDeleteClick}
        state={dialogPayload.state}
        title="Xác nhận xóa?"
        content="Sản phẩm, bao gồm cả thông tin sẽ bị xóa vĩnh viễn và không thể khôi phục."
      />
      <DataGrid
        getRowId={(row) => row._id ? row._id : row.id}
        rows={searchResult ? searchResult : rows}
        columns={columns}
        slots={{ toolbar: CustomGridToolbar }}
        slotProps={{ toolbar: { onClick: () => navigate('create-product') } }}
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

export default ManageProduct