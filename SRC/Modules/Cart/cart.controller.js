import { response } from "express";
import { ErrorHandleClass } from "../../Utils/index.js";
import { Product, Cart } from "./../../../DB/Models/index.js";

export const addToCart = async (req, res, next) => {
  //destruct data from req
  const { productId } = req.params;
  const { quantity,price } = req.body;
  const userId = req.authUser._id;

  //check product
  const product = await Product.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });

  if (!product)
    return next(
      new ErrorHandleClass(
        "Product not found or out of stock",
        404,
        "Product not found or out of stock"
      )
    );

  //add product to cart

  //check if user have cart or add as firt product
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    let newCart = new Cart({
      userId,
      products: [
        {
          productId: product._id,
          quantity,
          
        },
      ],
      totalPrice: product.appliedPrice * quantity,
    });

    await newCart.save();
    res.status(201).json({
      message: "product added to cart ",
      data: newCart,
    });
  }
  //check if product already exist in cart

  const isProductExist = cart.products.find((p) => p.productId == productId);

  if (isProductExist)
    return next(
      new ErrorHandleClass(
        "product already in cart",
        400,
        "product already in cart"
      )
    );
  cart.products.push({
    productId: product._id,
    quantity,
    price: product.appliedPrice,
  });
  cart.totalPrice += product.appliedPrice * quantity;
  await cart.save();

  return res.status(200).json({
    message: "product added to cart ",
    data: cart,
  });
};

export const deletFromCart = async (req, res, next) => {
  const userId = req.authUser._id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart)
    return next(
      new ErrorHandleClass("User cart not found", 404, "User cart not found")
    );

  cart.products = cart.products.filter((p) => p.productId != productId);

  if (cart.products.length === 0) {
    await Cart.deleteOne({ userId });
    return res.status(200).json({ message: "User cart deleted", data: null });
  }

  cart.totalPrice = 0;

  cart.products.forEach((p) => {
    cart.totalPrice += p.price * p.quantity;
  });

  await cart.save();
  res.status(200).json({ message: "product removed from cart", data: cart });
};

// export const updateProduct = async(req,res,next)=>{
//     const userId = req.authUser._id
//     const {productId} =req.query
//     const {quantity} = req.body

//     const userCart = await Cart.findOne({userId,'products.productId':productId

//     })
//     if(!userCart) return next(new ErrorHandleClass('User cart not found',404,'User cart not found'))

//     )
// }
