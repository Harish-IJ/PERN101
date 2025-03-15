import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:productid", getProduct);
router.post("/", createProduct);
router.put("/:productid", updateProduct);
router.delete("/:productid", deleteProduct);

export default router;
