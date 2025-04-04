import React, { useState, useEffect } from "react";
import ReactImageMagnify from "@blacklab/react-image-magnify";
import { Box } from "@mui/material";
import { useReadProductDetailBySlug } from "../../api/queries";
import { useParams } from "react-router-dom";

const ProductImages = ({}) => {
  const { slug } = useParams();

  const [selectedImage, setSelectedImage] = useState(null);

  const { data: productData} = useReadProductDetailBySlug(slug);

  const product = productData ? productData : null;

  useEffect(() => {
    if (product && product.imageURLs && product.imageURLs.length > 0) {
      setSelectedImage(product.imageURLs[0]);
    }
  }, [product]);

  return (
    <Box position="relative">
      <ReactImageMagnify
        imageProps={{
          alt: product.productName,
          isFluidWidth: true,
          src: selectedImage,
        }}
        magnifiedImageProps={{
          src: selectedImage,
          width: 1200,
          height: 1800,
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {product.imageURLs?.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Thumbnail ${index}`}
            onClick={() => setSelectedImage(url)}
            style={{
              width: "50px",
              height: "50px",
              margin: "0 5px",
              cursor: "pointer",
              border: selectedImage === url ? "2px solid #000" : "none",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProductImages;
