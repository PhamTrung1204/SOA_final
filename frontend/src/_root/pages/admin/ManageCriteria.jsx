/* eslint-disable react/prop-types */
import { DataGrid, GridActionsCellItem, GridEditInputCell, GridRowModes } from '@mui/x-data-grid';
import { PageContainer } from '@toolpad/core';
import { useEffect, useState } from 'react';
import DataGridConfirmDialog from '../../../components/dialogs/DataGridConfirmDialog.jsx';
import { CustomEditCell, CustomGridToolbar, CustomPageContainer, ManagePageSearch, SplitButton } from "../../../components";
import { enqueueSnackbar as toaster } from 'notistack';
import { Badge, Box, styled, Tooltip, tooltipClasses } from '@mui/material';
import { Cancel, Delete, Edit, Save } from '@mui/icons-material';
import { useCreateBrand, useCreateCategory, useCreateSpecificationKey, useCreateTag, useDeleteBrand, useDeleteCategory, useDeleteSpecificationKey, useDeleteTag, useReadAllBrand, useReadAllCategory, useReadAllSpecificationKeyAdmin, useReadAllTagAdmin, useSearchBrand, useSearchCategoryAdmin, useSearchSpecificationKey, useSearchTagAdmin, useUpdateBrand, useUpdateCategory, useUpdateSpecificationKey, useUpdateTag } from '../../../api/queries.js';

const StyledBox = styled('div')(({ theme }) => ({
  '& .Mui-error': {
    backgroundColor: "#ffcdd2",
    ...theme.applyStyles('dark', {
      color: "#000"
    })
  },
}));

const criteria = {
  'Loại sản phẩm': {
    buttonTitle: 'Loại sản phẩm',
    create: useCreateCategory,
    read: useReadAllCategory,
    delete: useDeleteCategory,
    update: useUpdateCategory,
    search: useSearchCategoryAdmin,
    columns: [
      { field: 'categoryCode', headerName: 'Id', width: 150, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} />), isRequired: true },
      { field: 'categoryName', headerName: 'Loại sản phẩm', flex: 1, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} />), isRequired: true }
    ],
    savedFields: ['categoryName', 'categoryCode']
  },
  'Nhà sản xuất': {
    buttonTitle: 'Nhà sản xuất',
    create: useCreateBrand,
    read: useReadAllBrand,
    delete: useDeleteBrand,
    update: useUpdateBrand,
    search: useSearchBrand,
    columns: [
      { field: 'brandCode', headerName: 'Id', width: 150, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} isRequired />), isRequired: true },
      { field: 'brandName', headerName: 'Hãng sản xuất', flex: 1, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} isRequired />), isRequired: true }
    ],
    savedFields: ['brandName', 'brandCode']
  },
  'Thẻ': {
    buttonTitle: 'Thẻ',
    create: useCreateTag,
    read: useReadAllTagAdmin,
    delete: useDeleteTag,
    update: useUpdateTag,
    search: useSearchTagAdmin,
    columns: [
      { field: 'tagCode', headerName: 'Id', width: 150, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} />), isRequired: true },
      { field: 'tagName', headerName: 'Tên thẻ', flex: 1, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} />), isRequired: true }
    ],
    savedFields: ['tagName', 'tagCode']
  },
  'Thông số': {
    buttonTitle: 'Thông số',
    create: useCreateSpecificationKey,
    read: useReadAllSpecificationKeyAdmin,
    delete: useDeleteSpecificationKey,
    update: useUpdateSpecificationKey,
    search: useSearchSpecificationKey,
    columns: [
      { field: 'key', headerName: 'Loại thông số', flex: 1, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} />), isRequired: true }
    ]
  }
}

function ManageCriteria() {
  const [criterion, setCriterion] = useState('Loại sản phẩm')
  const [updateCellError, setUpdateCellError] = useState({})
  const [rows, setRows] = useState()
  const [rowModesModel, setRowModesModel] = useState({})
  const [rowChanges, setRowChanges] = useState(null)
  const [searchValue, setSearchValue] = useState("")
  const [searchParam, setSearchParam] = useState("")
  
  const [deleteDialogPayload, setDeleteDialogPayload] = useState({ state: false, id: null });
  const [updateDialogPayload, setUpdateDialogPayload] = useState({ state: false, id: null });
  
  const currentCriterion = criteria[criterion]


  const { mutateAsync: createRecord } = currentCriterion.create();
  const { data, isLoading } = currentCriterion.read();
  const { isPending: isUpdating,mutateAsync: updateCriterion } = currentCriterion.update();
  const { isPending: isDeleting,mutateAsync: deleteRecord } = currentCriterion.delete();
  const { data: searchResult} = currentCriterion.search(searchParam);



  const breadcrumbs = [
    { path: '/', title: 'Home' },
    { path: '/manage-criteria', title: 'Quản lý tiêu chí phân loại' },
  ]

  useEffect(() => setRows(data), [data, criterion])

  const handleEditCellProps = ({ field, row, isRequired, props }) => {
    const { value } = props;
    setRowChanges(prev => ({ ...prev, [field]: value !== row[field] }));

    if (isRequired) {
      const errorMessage = (!value || value.trim() === "") ? "Require" : ""
      setUpdateCellError(prev => ({ ...prev, [field]: errorMessage }))
      return { ...props, error: value !== row[field] && errorMessage };
    }
    return { ...props };
  }


  const columns = [
    ...currentCriterion.columns.map(column => (
      { ...column, preProcessEditCellProps: (params) => handleEditCellProps({ ...params, isRequired: column.isRequired, field: column.field }) })),
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
      for (const key in newRow) {
        if (currentCriterion.savedFields.some(field => field === key))
          data[key] = newRow[key];
      }

      newData = await createRecord(data);
      setUpdateDialogPayload({ state: false, id: null });
      toaster("Tạo thành công.", { variant: 'success' })
    } else {
      const updatedData = await updateCriterion(newRow);
      setUpdateDialogPayload({ state: false, id: null });

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
      // setUpdateDialogPayload({ state: false, id: null });
      setRowChanges(null);
    } else
      setUpdateDialogPayload((prev) => ({ ...prev, state: false }));
  }

  const handleUpdateError = (error) => {
    console.error(error);
  }

  const handleSearch = () => {
    if (!searchValue) {
      return;
    }
    const param = {};
    if(searchValue.startsWith('#')){
      param[currentCriterion.columns[0].field] = searchValue.substring(1)
    } else {
      param[currentCriterion.columns[1].field] = searchValue
    }
    setSearchParam(param)
  }

  useEffect(() => {
      if (criterion === "Thông số") {
        return;
      }
      setTimeout(() => {
        const param = {};
        if(searchValue.startsWith('#')){
          param[currentCriterion.columns[0].field] = searchValue.substring(1)
        } else {
          param[currentCriterion.columns[1].field] = searchValue
        }
        
        setSearchParam(param)
      }, 1500);
  }, [searchValue]);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };




  return (
    <CustomPageContainer
      title='Quản lý tiêu chí phân loại'
      breadCrumbs={breadcrumbs}
      sx={{ maxWidth: { xl: 'unset', lg: '94vw', sm: '92vw', xs: '100vw' } }}
    >
      <Box
        display='flex'
        flexWrap='wrap'
        width='100%'
        justifyContent='space-between'
        mb={3}
      >
        <Box
          maxHeight='50%'
          sx={{mb:{xs:3, md: 0}}}
        >
          <SplitButton
            options={Object.keys(criteria)}
            selecting={criterion}
            setSelecting={setCriterion}
          />
        </Box>
        <ManagePageSearch
          {...{ searchValue, setSearchValue, handleSearch }}
        />
      </Box>
      <DataGridConfirmDialog
        isPending={isDeleting}
        onClick={handleDeleteClick}
        state={deleteDialogPayload.state}
        title="Xác nhận xóa?"
        content={`${criterion}, bao gồm cả thông tin sẽ bị xóa vĩnh viễn và không thể khôi phục.`}
      />
      <DataGridConfirmDialog
        isPending={isUpdating}
        onClick={confirmUpdate}
        state={updateDialogPayload.state}
        title="Xác nhận cập nhật?"
        content="Sau khi cập nhật, thông tin sẽ được thay đổi trên toàn bộ hệ thống."
      />
      <StyledBox>
        <DataGrid
          loading = {isLoading}
          getRowId={(row) => row._id ? row._id : row.id}
          rows={searchResult && searchValue ? searchResult : rows}
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
          pageSizeOptions={[5,10]}
        />
      </StyledBox>

    </CustomPageContainer>
  )
}

export default ManageCriteria