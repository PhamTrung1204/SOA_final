import mongoose from "mongoose";
import Cart from "../../models/cart.model.js";
// import Voucher from "../../models/voucher.model.js"; // Đã comment import của Voucher vì không cần dùng

// [POST] /cart/add
export const add = async (req, res) => {
  try {
    const { client, spec, quantity } = req.body; // Lấy quantity từ req.body

    // Chuyển đổi spec từ chuỗi sang ObjectId
    const specObjectId = new mongoose.Types.ObjectId(spec);

    // Tìm giỏ hàng của client
    const exitCart = await Cart.findOne({ client: client });

    if (exitCart) {
      // Kiểm tra xem sản phẩm có cùng spec đã tồn tại trong cartItems chưa
      const itemIndex = exitCart.cartItems.findIndex(
        (item) => item.spec.toString() === specObjectId.toString()
      );

      if (itemIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng lên bằng quantity từ req.body
        exitCart.cartItems[itemIndex].quantity += quantity || 1; // Dùng quantity nếu có, mặc định là 1 nếu không có
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào cartItems với quantity từ req.body
        exitCart.cartItems.push({
          spec: specObjectId, // Sử dụng ObjectId đã chuyển đổi
          quantity: quantity || 1, // Sử dụng quantity từ req.body, mặc định là 1 nếu không có
        });
      }

      // Cập nhật giỏ hàng bằng updateOne
      await Cart.updateOne(
        { client: client }, // Điều kiện để tìm giỏ hàng
        { cartItems: exitCart.cartItems } // Cập nhật lại danh sách cartItems sau khi thêm hoặc tăng số lượng
      );

      return res.status(200).json(true);
    } else {
      // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng với sản phẩm đầu tiên và quantity từ req.body
      const newCart = {
        client: client,
        cartItems: [
          {
            spec: specObjectId,
            quantity: quantity || 1, // Sử dụng quantity từ req.body, mặc định là 1 nếu không có
          },
        ],
      };

      const record = new Cart(newCart);
      await record.save();
      return res.status(200).json(record);
    }
  } catch (error) {
    res.status(500).json(false);
  }
};

// [DELETE] /cart/delete
export const deleteProduct = async (req, res) => {
  try {
    const { client, spec } = req.body;

    await Cart.updateOne(
      { client: client }, // Điều kiện để tìm giỏ hàng của client
      {
        $pull: {
          cartItems: { spec: spec }, // Điều kiện để xóa cartItem có spec khớp
        },
      }
    );

    res.status(200).json(true);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [POST] /cart/showCart/:userId
export const showCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Tìm giỏ hàng của client và populate thông tin spec
    const cart = await Cart.findOne({ client: userId }).populate({
      path: "cartItems.spec",
      populate: {
        path: "products", // Populate product trong spec
        select: "productName price imageURLs", // Chọn các trường cần thiết từ product
      },
    });

    if (!cart) {
      return res.status(404).json(false);
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(false);
  }
};

const cartController = {
  // [PATCH] /client/cart
  updateCart: async (req, res) => {
    try {
      const { cartId, cartItems /* , voucherId */ } = req.body; // Loại bỏ voucherId khỏi req.body

      let cart = await Cart.findById(cartId);

      if (!cart) {
        return res.status(400).json(false);
      }

      if (cartItems && cartItems.length > 0) {
        cartItems.forEach((item) => {
          // Tìm sản phẩm trong giỏ
          const cartItem = cart.cartItems.find(
            (i) => i.spec.toString() === item.spec
          );

          // Nếu sản phẩm đã có, cập nhật số lượng
          if (cartItem) {
            cartItem.quantity = item.quantity;
          } else {
            // Nếu sản phẩm chưa có, thêm mới vào giỏ
            cart.cartItems.push({
              spec: item.spec,
              quantity: item.quantity,
            });
          }
        });
      }

      /* 
      if (voucherId) {
        const voucherExist = await Voucher.findOne({
          _id: voucherId,
          clients: {
            $elemMatch: {
              clientId: req.params.id,
              usageLimitPerCustomer: { $gt: 0 },
            },
          },
        });

        if (!voucherExist) {
          return res.status(400).json(false);
        }

        if (!cart.vouchers.includes(voucherId)) {
          cart.vouchers.push(voucherId);
        }
      }
      */

      // Lưu lại giỏ hàng đã được cập nhật
      await cart.save();

      return res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(false);
    }
  },
};

export default cartController;
