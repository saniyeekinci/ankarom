import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/Cart.js";

const sanitizeCartItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items
      .filter((item) => item && item.id && Number(item.quantity) > 0)
      .map((item) => ({
        id: String(item.id),
        name: String(item.name || ""),
        currentPrice: String(item.currentPrice || "0"),
        image: String(item.image || ""),
        deliveryText: String(item.deliveryText || "Stokta Var"),
        quantity: Number(item.quantity),
      }));
};

// GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  res.status(200).json({ items: cart?.items || [] });
});

// POST /api/cart/sync
export const syncCart = asyncHandler(async (req, res) => {
  const items = sanitizeCartItems(req.body?.items);

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items });
  } else {
    cart.items = items;
    await cart.save();
  }

  res.status(200).json({
    message: "Sepet güncellendi.",
    items: cart.items,
  });
});