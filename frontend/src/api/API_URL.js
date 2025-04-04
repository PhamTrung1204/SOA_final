export const AUTH_URL = {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '',
    getCurrentUser: '/client/account/token/information'
}

//----------------------------- CUSTOMER -----------------------------
export const customer_url = {
    voucher: {
        readVoucher: (id) => '/client/voucher/my-voucher/' + id,
        search: () => '/client/voucher/my-voucher/search',
        deleteVoucher: (id) => '/client/voucher/my-voucher/del/' + id,
        getOwnVouchers: (id) => '/client/voucher/' + id,
        getAllVoucher: () => '/client/voucher/'
    },
    cart: {
        addItem: () => '/cart/add',
        deleteItem: () => '/cart/delete',
        getOwnCart: (id) => '/cart/showCart/' + id,
        updateOwnCart: (id) => '/cart/my-cart/' + id
    },
    brand: {
        getAllBrand: () => '/client/brand/',
        search: () => '/client/brand/search',
        getProductByBrand: (id) => '/client/brand/' + id
    },
    address: {
        getOwnAddresses: (id) => '/client/address/' + id,
        addAddress: () => '/client/address/add',
        editAddress: (id) => '/client/address/edit/' + id,
        deleteAddress: (id) => '/client/address/delete/' + id,
    },
    seen: {
        addSeenProduct: () => '/client/seen/add',
        getOwnSeenProducts: (id) => '/client/seen/' + id
    },
    category: {
        getAllCategory: () => '/client/category/',
        search: () => '/client/category/search',
    },
    product: {
        getPopularProduct: () => '/client/product/popular',
        getAllProduct: () => '/client/product/',
        search: () => '/client/product/search',
        getProductByTag: (id) => '/client/product/tag/search/' + id,
        getProductByCategory: (id) => '/client/product/category/search/' + id,
        getDetailProduct: (id) => '/client/product/details/' + id,
        getDetailProductBySlug: (slug) => '/client/product/details/slug/' + slug,
        getRelativeProducts: (id) => '/relative/' + id
    },
    wishList: {
        addProduct: (id) => '/client/wishList/add-to-wishList/' + id,
        search: (id) => '/client/wishList/my-wishList/' + id + '/search',
        deleteProduct: (id) => '/client/wishList/my-wishList/del-from-wishList/' + id,
        getAllProduct: (id) => '/client/wishList/my-wishList/' + id
    },
    account: {//ok
        getAccountDetail: (id) => '/client/account/details/' + id,
        udpateAccountDetail: (id) => '/client/account/details/' + id
    },
    order: {
        getOwnOrders: (id) => '/client/order/user/' + id,
        addNewOrder: () => '/client/order/add',
        editOrder: (id) => '/client/order/edit/' + id,//x
        getOrderDetail: (id) => '/client/order/detail/' + id,
        deleteOrder: (id) => '/client/order/delete/' + id//x
    },
    review: {
        addReview: (id) => '/client/reviews/' + id,
        deleteReview: (id) => '/client/reviews/' + id,
        updateReview: (id) => '/client/reviews/' + id
    }
}

//----------------------------- ADMIN -----------------------------

export const admin_url = {
    product: {
        getAllProduct: () => '/product/',
        getProductDetail: (id) => '/product/productDetail/' + id,
        createProduct: () => '/product/postProduct',
        updateProduct: (id) => '/product/editProduct/' + id,
        deleteProduct: (id) => '/product/deleteProduct/' + id,
        search: () => '/product/search',
        statisticBrand: (id) => '/product/statistic-brand/' + id,
    },
    account: {//ok
        search: () => '/account/Quan-ly-tai-khoan/search/',
        getAllAccounts: () => '/account/Quan-ly-tai-khoan/',//Lấy tất cả tài khoản 
        getAccountDetail: (id) => '/account/Quan-ly-tai-khoan/' + id,
        updateAccountDetail: (id) => '/account/Quan-ly-tai-khoan/' + id + '/Chinh-sua-trang-thai-tai-khoan',
        deleteAccount: (id) => '/account/Quan-ly-tai-khoan/' + id
    },
    category: {
        getAllCategory: () => '/category/',
        addCategory: () => '/category/add/',
        updateCategory: (id) => '/category/edit/' + id,
        deleteCategory: (id) => '/category/delete/' + id,
        search: () => '/category/search',
    },
    tag: {
        getAllTag: () => '/tag/',
        addTag: () => '/tag/add/',
        updateTag: (id) => '/tag/edit/' + id,
        deleteTag: (id) => '/tag/delete/' + id,
        search: () => '/tag/search',
    },
    brand: {
        getAllBrand: () => '/brand/',
        search: () => '/brand/search',
        delete: (id) => '/brand/del/' + id,
        getProductByBrand: (id) => '/brand/' + id,
        updateBrand: (id) => '/brand/' + id,
        addBrand: () => '/brand/',
    },
    voucher: {
        getAllVoucher: () => '/voucher/',
        addVoucher: () => '/voucher/add/',
        updateVoucher: (id) => '/voucher/edit/' + id,
        deleteVoucher: (id) => '/voucher/delete/' + id,
        search: () => '/voucher/search',
    },
    order: {
        getAllOrders: () => '/order/',
        getOrderOfUser: (id) => '/order/user/' + id,
        getOrderDetail: (id) => '/order/detail/' + id,
        editOrder: (id) => '/order/edit/' + id,
        deleteOrder: (id) => '/order/' + id,
        search: () => '/order/search/',
        generalStatistic: () => '/order/statistic/',//x
        statisticRevenue: () => '/order/statistic-revenue/'//x
    },
    carousel: {
        getAllCarousel: () => '/carousel/',
        addCarousel: () => '/carousel/',
        updateCarousel: (id) => '/carousel/' + id,
        deleteCarousel: (id) => '/carousel/' + id,
    },
    review: {
        getAllReview: (id) => '/reviews/' + id,
        search: (id) => '/reviews/' + id + '/search/',
        deleteReview: (id) => '/reviews/' + id,
        getReview: (id) => '/reviews/' + id
    },
    specificationKey: {
        getAllSpecificationKey: () => '/spec/specification-keys',
        addSpecificationKey: () => '/spec/specification-keys',
        deleteSpecificationKey: (id) => '/spec/specification-keys/' + id,
        updateSpecificationKey: (id) => '/spec/specification-keys/' + id
    },
    specification: {
        getAllSpecification: () => '/spec/',
        addSpecification: () => '/spec/specification/',
        deleteSpecification: (id) => '/spec/' + id,
        deleteSpecificationKeyValue: (id) => '/spec/specification/' + id,
        updateSpecificationKeyValue: (id) => '/spec/specification/' + id,
        updateSpecification: (id) => '/spec/' + id,
        searchSpecification: () => '/spec/search/',
    },
    stats: {
        // Account statistics
        getNewUsersDaily: () => '/stats/daily',
        getNewUsersWeekly: () => '/stats/weekly',
        getNewUsersMonthly: () => '/stats/monthly',
        getAccountRoleStatistics: () => '/stats/roles',

        // Product statistics
        getProductSpecsStatistics: () => '/stats/specs-per-product',
        getProductWithDiscountStatistics: () => '/stats/product-discount',
        getTotalStockValue: () => '/stats/total-stock-value',
    }
}

