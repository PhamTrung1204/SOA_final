import { Router } from "express";
import productController from "../../controllers/client/product.controller.js";

const productRouter = Router();
//PRODUCT

// Tìm kiếm sản phẩm dựa theo tag
productRouter.get("/tag/search/:tagId", productController.searchTag);

// Tìm kiếm sản phẩm dựa theo cat
productRouter.get(
  "/category/search:categoryId",
  productController.searchCategory
);

productRouter.get("/tag/search", productController.showPopularProducts);

// Tìm sản phẩm
productRouter.get("/search", productController.searchProduct);

// Xem chi tiết sản phẩm
productRouter.get("/details/:id", productController.showDetailsProduct);

productRouter.get("/details/slug/:slug", productController.getProductBySlug);

// Xem sản phẩm
productRouter.get("/", productController.showProduct);

productRouter.get("/relative/:productId", productController.relativeProduct);
productRouter.get("/popular", productController.popular);

export default productRouter;
