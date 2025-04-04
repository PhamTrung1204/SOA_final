import React, { useState, useEffect } from "react";
import { Box, TableContainer, Paper, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { useReadAllSpecificationKeyAdmin, useReadProductDetailBySlug } from '../../api/queries';
import { useParams } from "react-router-dom";

const SpecificationTable = ({}) => {
  const { slug } = useParams();

  const [selectedSpec, setSelectedSpec] = useState(null);
  const [activeSpec, setActiveSpec] = useState(null);

  const { data: productData } = useReadProductDetailBySlug(slug);

  const product = productData ? productData : null;
  const specs = Array.isArray(product?.specs) ? product.specs : [];

  const { data: specificationKeys } = useReadAllSpecificationKeyAdmin();
  
  const getSpecificationKey = (specKeyId) => {
    const key = specificationKeys?.find((key) => key._id === specKeyId);
    return key ? key.key : "Tên thông số";
  };

  useEffect(() => {
    if (specs && specs.length > 0) {
      setSelectedSpec(specs[0]);
      setActiveSpec(specs[0]._id);
    }
  }, [specs]);

  return (
    <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Thông số kỹ thuật
        </Typography>
        {selectedSpec?.specifications?.length > 0 ? (
          <TableContainer>
            <Table aria-label="Specifications Table">
              <TableBody>
                {selectedSpec.specifications.map((specification, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {getSpecificationKey(specification.key)}
                    </TableCell>
                    <TableCell>{specification.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
            Không có thông số kỹ thuật cho sản phẩm này.
          </Typography>
        )}
      </Paper>
  );
};

export default SpecificationTable;