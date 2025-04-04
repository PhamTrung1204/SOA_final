import { Autocomplete, CssVarsProvider, extendTheme } from '@mui/joy';
import { useGridApiContext } from '@mui/x-data-grid';
import { FileUploader } from 'react-drag-drop-files';
import { AddImage } from '../../assets';
import { Box } from '@mui/material';
import { useState } from 'react';

const fileTypes = ["JPG", "PNG", "JEPG", "WEBP", "MP4"];

const CustomEditImageCell = (props) => {

  const { id, value = null, field } = props;
  const [file, setFile] = useState(value)
  const apiRef = useGridApiContext();

  const handleChange = (newFile) => {
    setFile(newFile)
    
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newFile
    })

    // setSelectedValue(newValue);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        '& .drop_input': {
          display: 'block',
          width: '100%',
          height: '0',
          paddingTop: '100%',
          backgroundImage:
            `

                url(${
                  file ? 
                  (typeof file === 'string' ? `"${file}"` : URL.createObjectURL(file)):
                  AddImage
                })
              `,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center', // Centers the background image
          backgroundSize: "100%"
        },
        '& .drop_input input': {
          display: 'block',
          width: '100%',
          height: 0,
          borderRadius: '3px',
          paddingTop: '100%',
          mt: '-100%'
        }
      }}
    >
      <FileUploader
        classes={"drop_input"}
        handleChange={handleChange}
        type={fileTypes}
        fileOrFiles={file}
      >
        <></>
      </FileUploader>
    </Box>
  );
};

export default CustomEditImageCell