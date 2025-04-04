// queries.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAccount,
  createRecord,
  deleteRecord,
  login,
  readAll,
  search,
  updateRecord,
  getCurrentUser,
  createProduct,
  updateProduct,
  manageCarousel,
} from "./api";
import {
  READ_ALL_ACCOUNTS,
  ADMIN_ACCOUNT_DETAIL,
  READ_ALL_PRODUCTS,
  SEARCH_PRODUCT,
  READ_PRODUCT_DETAIL,
  RELATIVE_PRODUCTS,
  PRODUCT_DETAIL,
  STATISTIC_BRAND,
  READ_ALL_VOUCHERS,
  READ_VOUCHER,
  SEARCH_VOUCHER,
  READ_ALL_BRANDS,
  READ_ALL_TAGS,
  READ_ALL_CATEGORIES,
  READ_ALL_CAROUSEL,
  READ_ALL_ORDERS,
  READ_ALL_REVIEWS,
  SEARCH_ACCOUNT,
  SEARCH_TAG,
  SEARCH_BRAND,
  SEARCH_CATEGORY,
  SEARCH_SPECIFICATION,
  ORDER_DETAIL,
  READ_ALL_SPECIFICATION_KEY,
  USE_READ_OWN_CART,
  CURRENT_USER,
  READ_ALL_SPECIFICATION,
  SEARCH_ORDER,
  SEARCH_REVIEW,
  READ_OWN_WISHLIST,
  READ_ALL_SEEN_PRODUCTS,
} from "./queryKeys";
import { admin_url, customer_url } from "./API_URL";

//----------------------------- Auth -----------------------------
export const useLogin = () => {
  return useMutation({
    mutationFn: (loginInfo) => login(loginInfo),
  });
};

export function useGetCurrentUser() {
  return useQuery({
    queryKey: [CURRENT_USER],
    queryFn: () => getCurrentUser(),
  });
}

//----------------------------- Account -----------------------------
//client
export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (user) => createAccount(user),
  });
};

export const useGetAccountDetail = (accountId) => {
  return useQuery({
    queryKey: [ADMIN_ACCOUNT_DETAIL, accountId],
    queryFn: () => readAll(customer_url.account.getAccountDetail(accountId)),
    enabled: !!accountId,
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user) =>
      updateRecord(customer_url.account.udpateAccountDetail(user._id), user),
    onSuccess: (data) => {
      console.log(data);

      queryClient.invalidateQueries([ADMIN_ACCOUNT_DETAIL, data._id]);
    },
  });
};

//admin
const admin_account_url = admin_url.account;
export const useReadAllAccount = () => {
  return useQuery({
    queryKey: [READ_ALL_ACCOUNTS],
    queryFn: () => readAll(admin_account_url.getAllAccounts()),
  });
};

export const useGetAdminAccountDetail = (accountId) => {
  return useQuery({
    queryKey: [ADMIN_ACCOUNT_DETAIL, accountId],
    queryFn: () => readAll(admin_account_url.getAccountDetail(accountId)),
    enabled: !!accountId,
  });
};

export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user) =>
      updateRecord(
        admin_account_url.updateAccountDetail(user.accountCode),
        user
      ),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_ACCOUNTS]);
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) =>
      deleteRecord(admin_account_url.deleteAccount(userId), userId),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_ACCOUNTS]);
    },
  });
};

export const useSearchAccount = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_ACCOUNT, searchParam],
    queryFn: () => search(admin_account_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};
//----------------------------- Product -----------------------------
//client
const customer_product_url = customer_url.product;
export const useReadAllProduct = () => {
  return useQuery({
    queryKey: [READ_ALL_PRODUCTS],
    queryFn: () => readAll(customer_product_url.getAllProduct()),
  });
};

export const useReadPopularProduct = () => {
  return useQuery({
    queryKey: ['READ_POPULAR_PRODUCT'],
    queryFn: () => readAll(customer_product_url.getPopularProduct()),
  });
};

export const useSearchProduct = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_PRODUCT, searchParam],
    queryFn: () => search(customer_product_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};

export const useReadProductByTag = (tagId) => {
  return useQuery({
    queryKey: [READ_ALL_PRODUCTS, tagId],
    queryFn: () => readAll(customer_product_url.getProductByTag(tagId)),
    enabled: !!tagId,
  });
};

export const useReadProductByCategory = (categoryId) => {
  return useQuery({
    queryKey: [READ_ALL_PRODUCTS, categoryId],
    queryFn: () =>
      readAll(customer_product_url.getProductByCategory(categoryId)),
    enabled: !!categoryId,
  });
};

export const useReadProductDetail = (productId) => {
  return useQuery({
    queryKey: [READ_PRODUCT_DETAIL, productId],
    queryFn: () => readAll(customer_product_url.getDetailProduct(productId)),
    enabled: !!productId,
  });
};

export const useReadProductDetailBySlug = (slug) => {
  return useQuery({
    queryKey: [READ_PRODUCT_DETAIL, slug],
    queryFn: () => readAll(customer_product_url.getDetailProductBySlug(slug)),
    enabled: !!slug,
  });
};

export const useReadRelativeProducts = (productId) => {
  return useQuery({
    queryKey: [RELATIVE_PRODUCTS, productId],
    queryFn: () => readAll(customer_product_url.getRelativeProducts(productId)),
    enabled: !!productId,
  });
};
//admin
const admin_product_url = admin_url.product;
export const useReadAllProductAdmin = () => {
  return useQuery({
    queryKey: [READ_ALL_PRODUCTS],
    queryFn: () => readAll(admin_product_url.getAllProduct()),
  });
};

export const useReadProductDetailAdmin = (productId) => {
  return useQuery({
    queryKey: [PRODUCT_DETAIL, productId],
    queryFn: () => readAll(admin_product_url.getProductDetail(productId)),
    enabled: !!productId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product) =>
      createProduct(admin_product_url.createProduct(), product),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_PRODUCTS]);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product) => {
      console.log(product);

      return updateProduct(
        admin_product_url.updateProduct(product._id),
        product
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_PRODUCTS]);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) =>
      deleteRecord(admin_product_url.deleteProduct(productId)),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_PRODUCTS]);
    },
  });
};

export const useSearchProductAdmin = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_PRODUCT, searchParam],
    queryFn: () => search(admin_product_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};

export const useReadStatisticBrand = (brandId) => {
  return useQuery({
    queryKey: [STATISTIC_BRAND, brandId],
    queryFn: () => readAll(admin_product_url.statisticBrand(brandId)),
    enabled: !!brandId,
  });
};

//----------------------------- Voucher -----------------------------
// client
const customer_voucher_url = customer_url.voucher;
export const useReadAllVouchers = () => {
  return useQuery({
    queryKey: [READ_ALL_VOUCHERS],
    queryFn: () => readAll(customer_voucher_url.getAllVoucher()),
  });
};

export const useReadOwnVouchers = (currentAccountId) => {
  return useQuery({
    queryKey: [READ_ALL_VOUCHERS, currentAccountId],
    queryFn: () =>
      readAll(customer_voucher_url.getOwnVouchers(currentAccountId)),
    enabled: !!currentAccountId,
  });
};

export const useReadVoucher = (voucherId) => {
  return useQuery({
    queryKey: [READ_VOUCHER, voucherId],
    queryFn: () => readAll(customer_voucher_url.readVoucher(voucherId)),
  });
};

export const useSearchVoucher = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_VOUCHER, searchParam],
    queryFn: () => search(customer_voucher_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};

//admin
const admin_voucher_url = admin_url.voucher;
export const useReadAllVoucherAdmin = () => {
  return useQuery({
    queryKey: [READ_ALL_VOUCHERS],
    queryFn: () => readAll(admin_voucher_url.getAllVoucher()),
  });
};
export const useCreateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (voucher) =>
      createRecord(admin_voucher_url.addVoucher(), voucher),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_VOUCHERS]);
    },
  });
};
export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (voucher) =>
      updateRecord(admin_voucher_url.updateVoucher(voucher._id), voucher),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_VOUCHERS]);
    },
  });
};
export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (voucherId) =>
      deleteRecord(admin_voucher_url.deleteVoucher(voucherId)),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_VOUCHERS]);
    },
  });
};
export const useSearchVoucherAdmin = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_VOUCHER, searchParam],
    queryFn: () => search(admin_voucher_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};
//----------------------------- Brand -----------------------------
//client
const customer_brand_url = customer_url.brand;
export const useReadAllBrand = () => {
  return useQuery({
    queryKey: [READ_ALL_BRANDS],
    queryFn: () => readAll(customer_brand_url.getAllBrand()),
  });
};
export const useSearchBrand = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_BRAND, searchParam],
    queryFn: () => search(customer_brand_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};
//admin
const admin_brand_url = admin_url.brand;
export const useReadAllBrandAdmin = () => {
  return useQuery({
    queryKey: [READ_ALL_BRANDS],
    queryFn: () => readAll(admin_brand_url.getAllBrand()),
  });
};
export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brand) => createRecord(admin_brand_url.addBrand(), brand),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_BRANDS]);
    },
  });
};
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brand) =>
      updateRecord(admin_brand_url.updateBrand(brand._id), brand),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_BRANDS]);
    },
  });
};
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brandId) => deleteRecord(admin_brand_url.delete(brandId)),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_BRANDS]);
    },
  });
};
export const useSearchBrandAdmin = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_VOUCHER, searchParam],
    queryFn: () => search(admin_brand_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};
//----------------------------- Tag -----------------------------
//admin
const admin_tag_url = admin_url.tag;
export const useReadAllTagAdmin = () => {
  return useQuery({
    queryKey: [READ_ALL_TAGS],
    queryFn: () => readAll(admin_tag_url.getAllTag()),
  });
};
export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tag) => createRecord(admin_tag_url.addTag(), tag),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_TAGS]);
    },
  });
};
export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tag) => updateRecord(admin_tag_url.updateTag(tag._id), tag),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_TAGS]);
    },
  });
};
export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagId) => deleteRecord(admin_tag_url.deleteTag(tagId)),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_TAGS]);
    },
  });
};
export const useSearchTagAdmin = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_TAG, searchParam],
    queryFn: () => search(admin_tag_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};
//----------------------------- Category -----------------------------
//client
const customer_category_url = customer_url.category;
export const useReadAllCategory = () => {
  return useQuery({
    queryKey: [READ_ALL_CATEGORIES],
    queryFn: () => readAll(customer_category_url.getAllCategory()),
  });
};
export const useSearchCategory = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_VOUCHER, searchParam],
    queryFn: () => search(customer_category_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};
//admin
const admin_category_url = admin_url.category;
export const useReadAllCategoryAdmin = () => {
  return useQuery({
    queryKey: [READ_ALL_CATEGORIES],
    queryFn: () => readAll(admin_category_url.getAllCategory()),
  });
};
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category) =>
      createRecord(admin_category_url.addCategory(), category),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_CATEGORIES]);
    },
  });
};
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category) =>
      updateRecord(admin_category_url.updateCategory(category._id), category),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_CATEGORIES]);
    },
  });
};
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId) =>
      deleteRecord(admin_category_url.deleteCategory(categoryId)),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_CATEGORIES]);
    },
  });
};
export const useSearchCategoryAdmin = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_CATEGORY, searchParam],
    queryFn: () => search(admin_category_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};
//----------------------------- Carousel -----------------------------
//admin
const admin_carousel_url = admin_url.carousel;
export const useReadAllCarouselAdmin = () => {
  return useQuery({
    queryKey: [READ_ALL_CAROUSEL],
    queryFn: () => readAll(admin_carousel_url.getAllCarousel()),
  });
};
export const useCreateCarousel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (carousel) =>
      manageCarousel(admin_carousel_url.addCarousel(), carousel),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_CAROUSEL]);
    },
  });
};
export const useUpdateCarousel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (carousel) =>
      manageCarousel(admin_carousel_url.updateCarousel(carousel._id), carousel),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_CAROUSEL]);
    },
  });
};
export const useDeleteCarousel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (carouselId) =>
      deleteRecord(admin_carousel_url.deleteCarousel(carouselId)),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_CAROUSEL]);
    },
  });
};
//----------------------------- Orders -----------------------------
//client
const customer_order_url = customer_url.order;
export const useReadAllOrdersOfUser = (userId) => {
  return useQuery({
    queryKey: [READ_ALL_ORDERS, userId],
    queryFn: () => readAll(customer_order_url.getOwnOrders(userId)),
    enabled: !!userId,
  });
};
export const useCreateNewOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (order) =>
      createRecord(customer_order_url.addNewOrder(), order),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_ORDERS]);
    },
  });
};
export const useGetOrderDetail = (orderId) => {
  return useQuery({
    queryKey: [ORDER_DETAIL, orderId],
    queryFn: () => readAll(customer_order_url.getOrderDetail(orderId)),
    enabled: !!orderId,
  });
};
//admin
const admin_order_url = admin_url.order;
export const useReadAllOrdersAdmin = () => {
  return useQuery({
    queryKey: [READ_ALL_ORDERS],
    queryFn: () => readAll(admin_order_url.getAllOrders()),
  });
};
export const useReadOrdersOfUserAdmin = (userId) => {
  return useQuery({
    queryKey: [READ_ALL_ORDERS, userId],
    queryFn: () => readAll(admin_order_url.getOrderOfUser(userId)),
    enabled: !!userId,
  });
};
export const useGetOrderDetailAdmin = (orderId) => {
  return useQuery({
    queryKey: [ORDER_DETAIL, orderId],
    queryFn: () => readAll(admin_order_url.getOrderDetail(orderId)),
    enabled: !!orderId,
  });
};
export const useUpdateOrderAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (order) =>
      updateRecord(admin_order_url.editOrder(order._id), order),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_ORDERS]);
    },
  });
};
export const useDeleteoOrderAmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => deleteRecord(admin_order_url.deleteOrder(orderId)),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_ORDERS]);
    },
  });
};
export const useSearchOrderAdmin = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_ORDER, searchParam],
    queryFn: () => search(admin_order_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};
//----------------------------- Reviews -----------------------------
//client
const customer_review_url = customer_url.review;
export const useAddNewReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (review) =>
      createRecord(customer_review_url.addReview(review.specId), review),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_REVIEWS]);
    },
  });
};

//admin
const admin_review_url = admin_url.review;
export const useReadAllReviewsAdmin = (productId) => {
  return useQuery({
    queryKey: [READ_ALL_REVIEWS, productId],
    queryFn: () => readAll(admin_review_url.getAllReview(productId)),
    enabled: !!productId,
  });
};
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId) =>
      deleteRecord(admin_review_url.deleteReview(reviewId)),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_REVIEWS]);
    },
  });
};
export const useSearchReviewAdmin = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_REVIEW, searchParam],
    queryFn: () => search(admin_review_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};

//----------------------------- SPECIFICATION -----------------------------
//admin
const admin_specification_url = admin_url.specification;
export const useReadAllSpecificationAdmin = () => {
  return useQuery({
    queryKey: [READ_ALL_SPECIFICATION],
    queryFn: () => readAll(admin_specification_url.getAllSpecification()),
  });
};
export const useCreateSpecification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (Specification) =>
      createRecord(admin_specification_url.addSpecification(), Specification),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_SPECIFICATION]);
    },
  });
};

export const useUpdateSpecification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (Specification) =>
      updateRecord(
        admin_specification_url.updateSpecification(Specification._id),
        Specification
      ),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_SPECIFICATION]);
    },
  });
};

export const useDeleteSpecification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (SpecificationId) =>
      deleteRecord(
        admin_specification_url.deleteSpecification(SpecificationId)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_SPECIFICATION]);
    },
  });
};

export const useDeleteSpecificationKeyValue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (SpecificationId) =>
      deleteRecord(
        admin_specification_url.deleteSpecificationKeyValue(SpecificationId)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_SPECIFICATION]);
    },
  });
};

export const useUpdateSpecificationKeyValue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ specificationId, specification }) => {
      console.log(specification);
      console.log(specificationId);

      return updateRecord(
        admin_specification_url.updateSpecificationKeyValue(specificationId),
        specification
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_SPECIFICATION]);
    },
  });
};

export const useSearchSpecification = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_SPECIFICATION, searchParam],
    queryFn: () => search(admin_specification_url.search(), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};
//----------------------------- SPECIFICATION KEYS -----------------------------
//admin
const admin_specificationKey_url = admin_url.specificationKey;
export const useReadAllSpecificationKeyAdmin = () => {
  return useQuery({
    queryKey: [READ_ALL_SPECIFICATION_KEY],
    queryFn: () => readAll(admin_specificationKey_url.getAllSpecificationKey()),
  });
};
export const useCreateSpecificationKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (SpecificationKey) =>
      createRecord(
        admin_specificationKey_url.addSpecificationKey(),
        SpecificationKey
      ),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_SPECIFICATION_KEY]);
    },
  });
};

export const useUpdateSpecificationKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (SpecificationKey) =>
      updateRecord(
        admin_specificationKey_url.updateSpecificationKey(SpecificationKey._id),
        SpecificationKey
      ),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_SPECIFICATION_KEY]);
    },
  });
};

export const useDeleteSpecificationKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (SpecificationKeyId) =>
      deleteRecord(
        admin_specificationKey_url.deleteSpecificationKey(SpecificationKeyId)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_SPECIFICATION_KEY]);
    },
  });
};

export const useSearchSpecificationKey = (searchParam) => {
  return useQuery({
    queryKey: [SEARCH_VOUCHER, searchParam],
    queryFn: () =>
      // search(admin_specificationKey_url.search(), searchParam),
      console.log("searching"),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};

//----------------------------- CART -----------------------------
//client
const customerCart = customer_url.cart;
export const useReadOwnCart = (currentAccountId) => {
  return useQuery({
    queryKey: [USE_READ_OWN_CART],
    queryFn: () => readAll(customerCart.getOwnCart(currentAccountId)),
    enabled: !!currentAccountId,
  });
};
export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item) => createRecord(customerCart.addItem(), item),
    onSuccess: () => {
      queryClient.invalidateQueries([USE_READ_OWN_CART]);
    },
  });
};
export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateRecord(customerCart.deleteItem(), data),
    onSuccess: () => {
      queryClient.invalidateQueries([USE_READ_OWN_CART]);
    },
  });
};
export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cart) =>
      updateRecord(customerCart.updateOwnCart(cart._id), cart),
    onSuccess: () => {
      queryClient.invalidateQueries([USE_READ_OWN_CART]);
    },
  });
};

//---------------------------WISHLIST--------------------------------
const customer_wishlist = customer_url.wishList;
export const useReadWishlistItems = (useId) => {
  return useQuery({
    queryKey: [READ_OWN_WISHLIST],
    queryFn: () => readAll(customer_wishlist.getAllProduct(useId)),
    enabled: !!useId,
  });
};
export const useAddItemToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, productId }) =>
      createRecord(customer_wishlist.addProduct(customerId), {
        productId: productId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_OWN_WISHLIST]);
      queryClient.invalidateQueries([READ_ALL_PRODUCTS]);
    },
  });
};
export const useRemoveItemFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, productId }) =>
      updateRecord(customer_wishlist.deleteProduct(customerId), { productId }),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_OWN_WISHLIST]);
      queryClient.invalidateQueries([READ_ALL_PRODUCTS]);
    },
  });
};
export const useSearchItemInWishlist = (customerId, searchParam) => {
  return useQuery({
    queryKey: [SEARCH_CATEGORY, searchParam],
    queryFn: () => search(customer_wishlist.search(customerId), searchParam),
    enabled: !!searchParam && searchParam != {} && searchParam != [],
  });
};
//---------------------------WISHLIST--------------------------------
const customer_seen = customer_url.seen;
export const useReadSeenProducts = (userId) => {
  return useQuery({
    queryKey: [READ_ALL_SEEN_PRODUCTS],
    queryFn: () => readAll(customer_seen.getOwnSeenProducts(userId)),
    enabled: !!userId,
  });
};
export const useAddItemToSeens = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data: { userId, productId } }) =>
      createRecord(customer_seen.addSeenProduct(), { userId, productId }),
    mutationFn: ({ data: { userId, productId } }) =>
      createRecord(customer_seen.addSeenProduct(), { userId, productId }),
    onSuccess: () => {
      queryClient.invalidateQueries([READ_ALL_SEEN_PRODUCTS]);
    },
  });
};

//-------------------------------------STATS----------------------------
const stats = admin_url.stats;

export const useGetNewUsersDaily = () => {
  return useQuery({
    queryKey: ["GET_NEW_USERS_DAILY"],
    queryFn: () => readAll(stats.getNewUsersDaily()),
  });
};

export const useGetNewUsersWeekly = () => {
  return useQuery({
    queryKey: ["GET_NEW_USERS_WEEKLY"],
    queryFn: () => readAll(stats.getNewUsersWeekly()),
  });
};

export const useGetNewUsersMonthly = () => {
  return useQuery({
    queryKey: ["GET_NEW_USERS_MONTHLY"],
    queryFn: () => readAll(stats.getNewUsersMonthly()),
  });
};

export const useGetAccountRoleStatistics = () => {
  return useQuery({
    queryKey: ["GET_ACCOUNT_ROLE_STATISTICS"],
    queryFn: () => readAll(stats.getAccountRoleStatistics()),
  });
};

export const useGetProductSpecsStatistics = () => {
  return useQuery({
    queryKey: ["GET_PRODUCT_SPECS_STATISTICS"],
    queryFn: () => readAll(stats.getProductSpecsStatistics()),
  });
};

export const useGetProductWithDiscountStatistics = () => {
  return useQuery({
    queryKey: ["GET_PRODUCT_WITH_DISCOUNT_STATISTICS"],
    queryFn: () => readAll(stats.getProductWithDiscountStatistics()),
  });
};

export const useGetTotalStockValue = () => {
  return useQuery({
    queryKey: ["GET_TOTAL_STOCK_VALUE"],
    queryFn: () => readAll(stats.getTotalStockValue()),
  });
};

//---------------------------WISHLIST--------------------------------
const customer_address_url = customer_url.address;
export const useReadOwnAddresses = (userId) => {
  return useQuery({
    queryKey: [READ_OWN_WISHLIST],
    queryFn: () => readAll(customer_address_url.getOwnAddresses(userId)),
    enabled: !!userId,
  });
};
export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createRecord(customer_address_url.addAddress(), data),
    onSuccess: () => {
      queryClient.invalidateQueries(["READ_OWN_ADDRESSES"]);
    },
  });
};

export const useRemoveAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId) =>
      deleteRecord(customer_address_url.deleteAddress(addressId)),
    onSuccess: () => {
      queryClient.invalidateQueries(["READ_OWN_ADDRESSES"]);
    },
  });
};
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (address) =>
      updateRecord(customer_address_url.editAddress(address._id), address),
    onSuccess: () => {
      queryClient.invalidateQueries(["READ_OWN_ADDRESSES"]);
    },
  });
};
