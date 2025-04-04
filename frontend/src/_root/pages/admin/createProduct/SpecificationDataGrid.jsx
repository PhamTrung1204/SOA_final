import { DataGrid, GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import { CustomAddGridToolbar, CustomEditCell, CustomEditDropdownCell } from "../../../../components";
import { useState } from "react";
import { Delete } from "@mui/icons-material";
import DataGridConfirmDialog from "../../../../components/dialogs/DataGridConfirmDialog";


const columnFields = [
    { field: 'key',
        valueFormatter:(value)=>{return typeof value === 'string' ? value : value?.key},
        headerName: 'Thông số', width: 300, editable: true },
    { field: 'value', headerName: 'Giá trị', width: 300, editable: true, renderEditCell: (params) => (<CustomEditCell {...params} isRequired />), isRequired: true },
];


function SpecificationDataGrid({ specificatinKeys, specifications, setSpecifications }) {
    const [rowModesModel, setRowModesModel] = useState({});
    const [deleteDialogPayload, setDeleteDialogPayload] = useState({ state: false, id: null });
    const [updateCellError, setUpdateCellError] = useState({})
    const [editingRowId, setEditingRowId] = useState();
    

    columnFields[0].renderEditCell = (params) => (
        <CustomEditDropdownCell {...params} options={specificatinKeys.map(specKey => specKey)} labelField="key" />
    );

    columnFields.forEach(col => {
        col.preProcessEditCellProps = ({ row, props, id }) => {
            const { field, isRequired } = col
            const { value } = props;

            if (isRequired) {
                const errorMessage = (!value || value.trim() === "") ? "Require" : ""
                setUpdateCellError(prev => ({ [id]: { ...prev, [field]: errorMessage } }))
                return { ...props, error: value !== row[field] && errorMessage };
            }
            return { ...props };
        }
    })


    const columns = [...columnFields,
    {
        field: 'actions',
        type: 'actions',
        headerName: '',
        width: 100,
        align: 'center',
        cellClassName: 'actions',
        getActions: ({ row }) => {
            const id = row._id || row.id;
            return [
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

    const handleDeleteClick = (isAccept) => {
        const { id } = deleteDialogPayload;

        if (!isAccept) {
            setDeleteDialogPayload({ state: false, id: null });
            return;
        }
        setDeleteDialogPayload({ state: false, id: null });
        setRowModesModel({})
        setSpecifications(specifications.filter((row) => row._id !== id && row.id !== id));
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        // Update to only allow editing a single row at a time
        if (Object.keys(newRowModesModel).length > 1) {
            newRowModesModel = Object.keys(newRowModesModel).reduce(
                (acc, modeId) => {
                    return {
                        ...acc, [modeId]: modeId != editingRowId ?
                            newRowModesModel[modeId] :
                            {
                                mode: GridRowModes.View,
                                ignoreModifications: !!updateCellError[editingRowId]
                            }
                    }
                }, {}
            )
        }
        setUpdateCellError({})
        setRowModesModel(newRowModesModel);
    };

    const handleOnRowEditStart = (param) => {
        setEditingRowId(param.id)
    }

    const handleRowUpdate = (newRow) => {

        const hasEmptyField = Object.values(newRow).some(value => !value || value === "");

        if (hasEmptyField) {
            setEditingRowId(undefined);
            setSpecifications(specifications.filter(row => row.id !== newRow.id));
            setRowModesModel({})
            return null;
        }

        console.log(specifications,newRow);
        

        setSpecifications(specifications.map(row => row.id === newRow.id ? newRow : row))

        return newRow;
    };

    // const handleProcessRowUpdateError = (error) => console.log(error);

    return (
        <>
            <DataGridConfirmDialog
                onClick={handleDeleteClick}
                state={deleteDialogPayload.state}
                title="Xác nhận xóa?"
                content="Sản phẩm, bao gồm cả thông tin sẽ bị xóa vĩnh viễn và không thể khôi phục."
            />
            <DataGrid
                getRowId={(row) => row._id ? row._id : row.id}
                rows={specifications}
                columns={columns}
                editMode="row"  // Use row editing mode
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStart={handleOnRowEditStart}
                // onProcessRowUpdateError={handleProcessRowUpdateError}
                processRowUpdate={handleRowUpdate}
                slots={{ toolbar: CustomAddGridToolbar }}
                slotProps={{ toolbar: { setRows: setSpecifications, rows: specifications, setRowModesModel, columnFields: columnFields.map(col => col.field) } }} // Update slotProps for add row
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}

            />
        </>
    );
}

export default SpecificationDataGrid;