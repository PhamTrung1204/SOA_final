import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

const SKUField = ({ productCode, variant, index, setSpecCode }) => {
  const [isEntered, setIsEntered] = useState(false)
  // Run this effect once when the component mounts
  useEffect(() => {
    // Check if the specCode is empty
    // Set the default specCode based on productCode and index
    if (!isEntered) {

      const defaultSpecCode = productCode + `_${(index + 1 + '').padStart(3, '0')}`;
      setSpecCode(index, defaultSpecCode);
    }
  }, [productCode]);

  return (
    <TextField
      variant="standard"
      label="SKU"
      value={
        variant.specCode === ''
          ? productCode + `_${(index + 1 + '').padStart(3, '0')}`
          : variant.specCode
      }
      onChange={(e) => {
        if (e.target.value === '')
          setIsEntered(false);
        else
          setIsEntered(true)
        setSpecCode(
          index,
          e.target.value === ''
            ? productCode + `_${(index + 1 + '').padStart(3, '0')}`
            : e.target.value
        )
      }}
    />
  );
};

export default SKUField;