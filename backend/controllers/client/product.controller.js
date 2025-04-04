import Product from "../../models/product.model.js";
import Tag from "../../models/tag.model.js";

const productController = {
  // [GET] /client/product
  showProduct: async (req, res) => {
    try {
      // const products = await Product.find().populate("tag category specs");
      const products = await Product.find({
        productStatus: { $ne: "draft" },
      }).populate("tag category specs");

      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  showPopularProducts: async (req, res) => {
    try {
      // Tìm tag "popular" trong collection Tag
      const popularTag = await Tag.findOne({ tagName: "POPULAR" });

      if (!popularTag) {
        return res.status(404).json({ error: 'Tag "popular" không tồn tại' });
      }

      // Lấy các sản phẩm có tag "popular" (sử dụng ObjectId của tag)
      const popularProducts = await Product.find({ tag: popularTag._id })
        .sort({ purchaseCount: -1 }) // Sắp xếp theo purchaseCount giảm dần
        .limit(5); // Giới hạn lấy 5 sản phẩm thịnh hành

      res.json(popularProducts);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi lấy sản phẩm thịnh hành" });
    }
  },

  // [GET] client/product/details
  showDetailsProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const specs = await Product.findById(productId).populate("specs");

      res.status(200).json(specs);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] client/product/search
  searchProduct: async (req, res) => {
    try {
      const {
        productName,
        minPrice,
        maxPrice,
        productStatus,
        category,
        tag,
        brand,
        slug,
      } = req.query;

      let filter = {};

      // Product name (case-insensitive partial match)
      if (productName) {
        filter.productName = { $regex: productName, $options: "i" };
      }

      // Price filtering based on the first element of the specs array
      if (minPrice || maxPrice) {
        filter["specs.0.price"] = {}; // Accessing the price of the first element in specs
        if (minPrice) {
          filter["specs.0.price"].$gte = Number(minPrice); // Greater than or equal to minPrice
        }
        if (maxPrice) {
          filter["specs.0.price"].$lte = Number(maxPrice); // Less than or equal to maxPrice
        }
      }

      // Product status
      if (productStatus) {
        filter.productStatus = productStatus;
      }

      // Category filtering
      if (category) {
        filter.category = category;
      }

      if (brand) {
        filter.brand = brand;
      }

      // Tag filtering
      if (tag) {
        filter.tag = { $in: tag }; // Match any tag in the array
      }

      // Slug filtering
      if (slug) {
        filter.slug = slug;
      }

      // Query products based on filter conditions, and populate necessary references
      const products = await Product.find(filter)
        .populate("category")
        .populate("tag")
        .populate("specs")
        .populate("brand");

      // Return the list of products
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json(false);
    }
  },

  // [GET] /client/product/relative/:idProduct
  relativeProduct: async (req, res) => {
    try {
      const id = req.params.productId;

      console.log(id);

      const products = await Product.findOne({ _id: id }).populate(
        "relativeProduct"
      );

      let result = [];

      if (products.relativeProduct.length > 0) {
        result = products.relativeProduct;
      }

      res.json(result);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] client/tag/search
  searchTag: async (req, res) => {
    try {
      const { tagId } = req.params;
      const products = await Product.find({
        tag: tagId,
      });

      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] client/category/search
  searchCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const products = await Product.find({
        category: categoryId,
      });

      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  getProductBySlug: async (req, res) => {
    try {
      const slug = req.params.slug;
      console.log(slug);

      const product = await Product.findOne({ slug: slug }).populate([
        { path: "relativeProduct" },
        { path: "tag" },
        { path: "specs" },
        { path: "category" },
        { path: "brand", select: "brandCode brandName" }, // Replace with actual fields in the "Brand" schema
      ]);

      res.json(product);
    } catch (error) {
      res.json(false);
    }
  },

  popular: async (req, res) => {
    try {
      const topProducts = await Product.find({})
        .sort({ purchaseCount: -1 })
        .limit(5).populate([
          { path: "relativeProduct" },
          { path: "tag" },
          { path: "specs" },
          { path: "category" },
          { path: "brand", select: "brandCode brandName" }, // Replace with actual fields in the "Brand" schema
        ]);

      res.status(200).json(topProducts);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving popular products", error });
    }
  },
};

export default productController;
