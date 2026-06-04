import { createShops } from "../../controlers/shops.controler.js";
import { Router } from "express";
import { upload } from "../../middlewarse/multer.js";
import { Shop } from "../../models/shop.model.js";

const shopRouter = Router();

// List all shops (including products)
shopRouter.get("/", async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a shop
shopRouter.post(
  "/",
  upload.single("shopImage"),
  createShops
);

// Delete a shop
shopRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Shop.findByIdAndDelete(id);
    res.json({ message: "Shop deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Delete failed" });
  }
});

// Add a product to a shop
shopRouter.post("/:id/product", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    shop.products.push(req.body);
    await shop.save();
    res.json(shop.products[shop.products.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products for a specific shop
shopRouter.get("/:id/products", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default shopRouter;
