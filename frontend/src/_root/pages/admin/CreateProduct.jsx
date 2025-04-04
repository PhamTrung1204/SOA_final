
import { Accordion, AccordionSummary, Box, Button, Divider, FormControl, FormHelperText, Grid2, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { CustomTypography, NumberInput } from "../../../components"
import PageToolbar from "../../../components/pageContainer/PageToolbar"
import CustomPageContainer from "../../../components/pageContainer/CustomPageContainer"
import { AspectRatio, Autocomplete, createFilterOptions, CssVarsProvider, extendTheme } from '@mui/joy'
import { useCreateProduct, useDeleteProduct, useReadAllBrandAdmin, useReadAllCategory, useReadAllSpecificationKeyAdmin, useReadAllTagAdmin, useReadProductDetailAdmin, useUpdateProduct } from "../../../api/queries"
import { useEffect, useState } from "react"
import SpecificationDataGrid from "./createProduct/SpecificationDataGrid"
import { ArrowDropDown, Delete, DeleteOutlined } from "@mui/icons-material"
import { FileUploader } from 'react-drag-drop-files'
import { AddImage } from "../../../assets"
import { enqueueSnackbar as toaster } from "notistack"
import SKUField from "./createProduct/SKUField"
import { useLocation, useNavigate } from "react-router-dom"
import { productStatuses } from "../../../constance/constance.jsx"

const breadcrumbs = [
  { path: '/', title: 'Home' },
  { path: '/manage-product', title: 'Quản lý sản phẩm' },
  { path: '/manag-product/create-product', title: 'Thêm sản phẩm mới' }
]

const joyTheme = extendTheme();

const filterCategoryOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option) => option.categoryName,
})
const filterTagOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option) => option.categoryName,
})
const filterBrandOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option) => option.brandName,
})

const initErrorState = {
  productCode: '',
  productName: '',
  description: '',
  variants: {
    emptyMessage: '',

  },
  isNew: true
}

const fileTypes = ["JPG", "PNG", "JEPG", "WEBP", "MP4"];

const initProduct = {
  specs: [{ price: 0, stockQuantity: 0, specifications: [], specCode: '' }],
  productCode: '',
  productName: '',
  description: '',
  tag: [],
  brand: undefined,
  category: undefined,
}

function CreateProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const initProductId = location.state?.productId;
  console.log(initProductId);


  // const initProduct = state?.productId ? state.product : 
  // {
  //   specs: [{ price: 0, stockQuantity:0, specifications: [], specCode: '' }],
  //   productCode: '',
  //   productName: '',
  //   description: '',
  //   tag: [],
  //   brand: undefined,
  //   category: undefined,
  // };
  //   console.log(initProduct);
  const [variants, setVariants] = useState(initProduct.specs)
  const [productCode, setProductCode] = useState(initProduct.productCode)
  const [productStatus, setProductStatus] = useState(productStatuses.available.label)
  const [productName, setProductName] = useState(initProduct.productName)
  const [description, setDescription] = useState(initProduct.description)
  const [tags, setTags] = useState(initProduct.tag)
  const [brand, setBrand] = useState(initProduct.brand)
  const [category, setCategory] = useState(initProduct.category)
  const [formErrors, setFormErrors] = useState(initErrorState)

  const [files, setFiles] = useState([])
  const [showingFile, setShowingFile] = useState(0)

  const { data: product } = useReadProductDetailAdmin(initProductId);
  const { data: categories, isLoading: isLoadingCategories } = useReadAllCategory();
  const { data: tagsData, isLoading: isLoadingTag } = useReadAllTagAdmin();
  const { data: brands, isLoading: isLoadingBrand } = useReadAllBrandAdmin();
  const { data: specificationKeys, } = useReadAllSpecificationKeyAdmin();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  useEffect(() => {
    console.log(product);

    if (product) {
      setVariants(product.specs || initProduct.specs);
      setProductCode(product.productCode || '');
      setProductStatus(product.productStatus || productStatuses.available.label)
      setProductName(product.productName || '');
      setDescription(product.description || '');
      setTags(product.tag || []);
      setBrand(product.brand || '');
      setCategory(product.category || '');
      setFiles(product.imageURLs || []);
    }
  }, [product]);


  const setVariantInfo = (index, type, newValue) => {
    setVariants(prevVariants => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index] = { ...updatedVariants[index], [type]: newValue };
      return updatedVariants;
    });
  };

  const validateForm = () => {
    return !!productCode && !!productName && !!description && variants.filter(variant => variant.specifications.length > 0).length >= 1;
  }
  const handleSave = async (isSaveDraft) => {
    const errors = { ...JSON.parse(JSON.stringify(initErrorState)) };
    console.log(
      JSON.parse(JSON.stringify(variants.filter((variant, index) => {
        const enoughData = variant.specifications.length > 0
        if (!enoughData)
          errors.variants[index] = "Phải có ít nhất 1 thông số sản phẩm"
        return enoughData
      })))
    );

    const savedVariants = JSON.parse(JSON.stringify(variants.filter((variant, index) => {
      const enoughData = variant.specifications.length > 0
      if (!enoughData)
        errors.variants[index] = "Phải có ít nhất 1 thông số sản phẩm"
      return enoughData
    })))
    console.log(savedVariants);

    savedVariants.forEach((variant, index) => {
      variant.specifications = variants[index].specifications.map(spec => !!spec.value && !!spec.key && ({ value: spec.value, key: spec.key._id }))
    })

    setFormErrors(errors);

    // return;
    if (!validateForm())
      toaster({ variant: 'error', message: 'Lưu sản phẩm thất bại' })
    else {

      console.log({
        productCode,
        productName,
        description,
        category: category?._id,
        tag: tags.map(t => t._id),
        brand: brand?._id,
        variations: savedVariants,
        productStatus: isSaveDraft ? "draft" : productStatus,
        files
      });


      if (initProductId) {

        const updatedProduct = updateProduct(
          {
            _id: product._id,
            productCode,
            productName,
            description,
            category: category?._id,
            tag: tags.map(t => t._id),
            brand: brand?._id,
            variations: savedVariants,
            productStatus: isSaveDraft ? "draft" : productStatus,
            files: files.filter(file => typeof file !== 'string'),
            imageUrls: files.filter(file => typeof file === 'string')
          })
        if (!updatedProduct) {
          toaster({ variant: 'error', message: 'Lưu sản phẩm thất bại' })
        }
      }

      else {
        const newProduct = await createProduct({
          productCode,
          productName,
          description,
          category: category?._id,
          tag: tags.map(t => t._id),
          brand: brand?._id,
          variations: savedVariants,
          productStatus: isSaveDraft ? "draft" : productStatus,
          files
        })
        if (!newProduct) {
          toaster({ variant: 'error', message: 'Lưu sản phẩm thất bại' })
        }
      }
    }

    toaster("Lưu sản phẩn thành công", { variant: 'success' })

    navigate(-1);
  }

  const handleChangeFile = (file) => {
    setFiles(prev => [...prev, file]);
    setShowingFile(files.length);
  }

  const handleDeleteFile = () => {
    setFiles(prev => prev.filter((e, i) => i != showingFile));
    setShowingFile(prev => Math.max(0, --prev));
  }

  return (
    <CustomPageContainer
      breadCrumbs={breadcrumbs}
      title='Thêm sản phẩm mới'
      slots={{ toolbar: PageToolbar }}
      slotProps={{
        toolbar: {
          handleSaveDraft: !initProductId && (async () => handleSave(true)), handleSave: async () => handleSave(),
          handleDelete: initProductId ? async () => { await deleteProduct(initProductId); navigate(-1); } : () => navigate(-1),
          disabled: !validateForm()
        }
      }}
    >
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 8 }} sx={{}}>
          <Box p={3} borderRadius={4} sx={{ boxShadow: 3 }}>
            <CustomTypography component="div" fontSize="1.2rem" variant="caption">Mô tả sản phẩm</CustomTypography>
            <Box display='flex' flexWrap='wrap'>
              <TextField
                sx={{ display: 'flex', width: { md: '30%', xs: '100%' }, mr: { md: 3, xs: 0 } }}
                error={!!formErrors.productCode}
                helperText={formErrors.productCode}
                name="product-code"
                value={productCode}
                onChange={(e) => {
                  if (!e.target.value || e.target.value.trim() === "")
                    setFormErrors(prev => ({ ...prev, productCode: 'Mã không được bỏ trống' }))
                  else
                    setFormErrors(prev => ({ ...prev, productCode: '' }))
                  setProductCode(e.target.value)
                }}
                label="Mã sản phẩm" fullWidth margin="normal" placeholder="PC001" />
              <FormControl sx={{ width: { md: '30%', xs: '100%' } }} margin="normal">
                <InputLabel id="product-status">Trạng thái</InputLabel>
                <Select sx={{ height: '100%' }} labelId="product-status" label='Trạng thái' value={productStatus} onChange={(e) => setProductStatus(e.target.value)}>
                  {
                    Object.values(productStatuses).map(status => (
                      <MenuItem key={status.label} value={status.label}>{status.label}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Box>
            <TextField
              sx={{ display: 'flex', width: { md: '80%', xs: '100%' } }}
              error={!!formErrors.productName}
              helperText={formErrors.productName}
              name="product-name"
              value={productName}
              onChange={(e) => {
                if (!e.target.value || e.target.value.trim() === "")
                  setFormErrors(prev => ({ ...prev, productName: 'Tên sản phẩm không được bỏ trống' }))
                else
                  setFormErrors(prev => ({ ...prev, productName: '' }))

                setProductName(e.target.value)
              }}
              label="Tên sản phẩm" fullWidth margin="normal" placeholder="Macbook pro M4, Samsung Galaxy S22,..." />
            <TextField
              error={!!formErrors.description}
              helperText={formErrors.description}
              name="product-description"
              value={description}
              onChange={(e) => {
                if (!e.target.value || e.target.value.trim() === "")
                  setFormErrors(prev => ({ ...prev, description: 'Mô tả sản phẩm không được bỏ trống' }))
                else
                  setFormErrors(prev => ({ ...prev, description: '' }))
                setDescription(e.target.value)
              }}
              label="Mô tả sản phẩm" fullWidth multiline rows={4} margin="normal" placeholder="Mô tả sản phẩm..." />
            <Box display="flex" justifyContent="space-between" mt={1}>
              {/* Size */}

            </Box>
          </Box>
          <Box mt={1} p={3} borderRadius={4} sx={{ boxShadow: 3 }}>
            <Box width="100%" display="flex" justifyContent="space-between" py={2} flexWrap='wrap'>
              <CustomTypography fontSize="1.2rem" variant="caption">
                Thông số sản phẩm
              </CustomTypography>
              <Button
                variant="outlined"
                onClick={() => setVariants(prev => [...prev, { price: 0, specifications: [] }])}
              >
                <Typography>Thêm biến thể mới</Typography>
              </Button>
            </Box>
            {variants && variants.map((variant, index) => (
              <Accordion sx={{ mb: 1 }} key={index}>
                <AccordionSummary
                  expandIcon={
                    <ArrowDropDown />
                  }
                >
                  <Box width="100%">
                    <Box display='flex' m={0} p={0} alignItems='center' justifyContent='space-between' width='100%'>
                      <SKUField productCode={productCode} variant={variant} index={index} setSpecCode={(i, newValue) => (setVariantInfo(i, 'specCode', newValue))} />
                      <IconButton
                        onClick={() => { setVariants(prev => prev.filter((_, i) => i !== index)) }}
                        color="error" sx={{ width: '32px', height: '32px' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    <FormHelperText error>{!!formErrors.variants[index] && formErrors.variants[index]}</FormHelperText>
                  </Box>
                </AccordionSummary>
                <Box sx={{ p: 2 }}>
                  <Box display='flex' justifyContent='space-between' mb={2}>
                    <NumberInput
                      label="Giá tiền"
                      value={variant.price}
                      min={0}
                      onChange={
                        (event) => {
                          const newValue = event.target.value
                          if (newValue < 0)
                            return;
                          setVariantInfo(index, 'price', newValue)
                        }
                      }
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      margin="normal"
                    />
                    <NumberInput
                      label="Số lượng"
                      value={variant.stockQuantity}
                      min={0}
                      onChange={
                        (event) => {
                          const newValue = event.target.value
                          if (newValue < 0)
                            return;
                          setVariantInfo(index, 'stockQuantity', newValue)
                        }
                      }
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      margin="normal"
                    />
                  </Box>
                  <SpecificationDataGrid
                    specificatinKeys={specificationKeys}
                    specifications={variant.specifications}
                    setSpecifications={newSpecs => {
                      console.log(newSpecs)
                      setVariantInfo(index, 'specifications', newSpecs)
                    }} key={index} />
                </Box>
              </Accordion>
            ))}
          </Box>
        </Grid2>
        <Grid2 item size={{ xs: 12, md: 4 }}>
          <Box p={3} borderRadius={2} display="flex" flexDirection="column" alignItems="center" sx={{ boxShadow: 3 }}>
            <Box display='flex' justifyContent="space-between" width="100%" mb={1}>
              <CustomTypography fontSize="1.2rem" variant="caption">Ảnh sản phẩm</CustomTypography>
              <Button
                startIcon={<DeleteOutlined />}
                variant="outlined"
                color="error"
                onClick={handleDeleteFile}
                sx={{ borderRadius: '25px' }}
                disabled={files.length === 0}
              >
                <CustomTypography
                  variant="button"
                >
                  Delete
                </CustomTypography>
              </Button>
            </Box>
            {/* Placeholder for Image */}
            <CssVarsProvider>
              <AspectRatio
                ratio="1"
                sx={{
                  width: '100%',
                  borderRadius: '12px',
                  '& .drop_input': {
                    display: 'block',
                    width: '100%',
                    height: '0',
                    paddingTop: '100%',
                    backgroundImage:
                      `
                        url(${files.length > 0 ?
                        (
                          typeof files[showingFile] === 'string' ?
                            `"${files[showingFile]}"` : URL.createObjectURL(files[showingFile])
                        ) : AddImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center', // Centers the background image
                    backgroundSize: files.length > 0 ? '100%' : '80%', // Adjusts the size to create padding effect
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
                  handleChange={handleChangeFile}
                  type={fileTypes}
                  fileOrFiles={showingFile && files.length > 0 ? files[showingFile] : files[0]}
                  disabled={files.length === 6}
                >
                  <></>
                </FileUploader>
              </AspectRatio>
            </CssVarsProvider>
            {/* Thumbnails */}
            <Box display="flex" alignItems='center' gap={2} mt={1} maxWidth="100%" sx={{ overflowX: "auto" }}>
              <CustomTypography fontSize="0.8rem" variant="caption">{`${files.length}/6`}</CustomTypography>
              {
                files.map((file, index) => {
                  return (
                    <Box
                      key={index}
                      component="img"
                      alt="Product Image"
                      sx={{
                        filter: `${showingFile === index && 'brightness(0.8)'}`,
                        border: '0.5px solid rgb(75,75,75)',
                        width: '68px',
                        height: '68px',
                        objectFit: 'cover', // Makes sure the image covers the square box
                        borderRadius: 2,   // Optional: for rounded corners
                        cursor: 'pointer',
                        '&:hover': { filter: 'brightness(0.8) ' }
                      }}
                      src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                      onClick={() => setShowingFile(index)}
                    />
                  )
                })
              }
            </Box>
          </Box>
          {/* Category Section */}
          <Box mt={1} p={3} borderRadius={2} display="flex" flexDirection="column" alignItems="center" sx={{ boxShadow: 3 }}>
            <Box display='flex' justifyContent="flex-start" width="100%">
              <CustomTypography fontSize="1.2rem" variant="caption">Phân loại sản phẩm</CustomTypography>
            </Box>
            <CssVarsProvider theme={joyTheme}>
              <Box width="100%" p={2}>
                <CustomTypography fontSize="1rem" variant="caption">Loại sản phẩm</CustomTypography>
                <Autocomplete
                  disableClearable
                  value={category}
                  onChange={(event, newValue) => setCategory(newValue)}
                  variant="plain"
                  placeholder="Loại sản phẩm"
                  options={isLoadingCategories ? [] : categories}
                  getOptionLabel={(option) => option.categoryName}
                  loading={isLoadingCategories}
                  filterOptions={filterCategoryOptions}
                  sx={{
                    "--Input-minHeight": "60px"
                  }}
                />
              </Box>
            </CssVarsProvider>
            <Divider component="div" variant="fullWidth" sx={{ width: '90%' }} />
            <CssVarsProvider theme={joyTheme}>
              <Box width="100%" p={2}>
                <CustomTypography fontSize="1rem" variant="caption">Hãng sản xuất</CustomTypography>
                <Autocomplete
                  disableClearable
                  value={brand}
                  onChange={(e, newValue) => setBrand(newValue)}
                  variant="plain"
                  placeholder="Hãng sản xuất"
                  options={isLoadingBrand ? [] : brands}
                  getOptionLabel={(option) => option.brandName}
                  loading={isLoadingBrand}
                  filterOptions={filterBrandOptions}
                  sx={{
                    "--Input-minHeight": "60px"
                  }}
                />
              </Box>
            </CssVarsProvider>
            <Divider component="div" variant="fullWidth" sx={{ width: '90%' }} />
            <CssVarsProvider theme={joyTheme}>

              <Box width="100%" p={2}>
                <CustomTypography fontSize="1rem" variant="caption">Gắn thẻ</CustomTypography>
                <Autocomplete
                  value={tags}
                  onChange={(e, newValue) => setTags(newValue)}
                  variant="plain"
                  placeholder="Tag"
                  options={isLoadingTag ? [] : tagsData}
                  getOptionLabel={(option) => option.tagName}
                  loading={isLoadingTag}
                  filterOptions={filterTagOptions}
                  multiple
                  sx={{
                    "--Input-minHeight": "60px"
                  }}
                />
              </Box>
            </CssVarsProvider>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 0 }} display={{ xs: 'block', md: 'none' }}>
          <PageToolbar {...{
            handleSaveDraft: !initProductId && (async () => handleSave(true)), handleSave: async () => handleSave(),
            handleDelete: initProductId ? async () => { await deleteProduct(initProductId); navigate(-1); } : () => navigate(-1),
            disabled: !validateForm(),
            isMobile: true
          }} />
        </Grid2>
      </Grid2>
    </CustomPageContainer>
  )
}

export default CreateProduct