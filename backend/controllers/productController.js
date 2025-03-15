import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql`
    SELECT * FROM products
    ORDER BY created_at DESC
    `;

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error Getting Products", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;
  if (!name || !price || !image) return res.status(400).json({ success: false, message: "" });
  try {
    const newProduct = await sql`
    INSERT INTO products (name,price,image)
    VALUES (${name},${price},${image})
    RETURNING *
    `;

    console.log(newProduct, "NEW PRODUCT");

    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.error("Error Creating Product", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const getProduct = async (req, res) => {
  const { productid } = req.params;

  try {
    const product = await sql`
    SELECT * FROM products WHERE id=${productid}
    `;

    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.error("Error Getting Product", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const updateProduct = async (req, res) => {
  const { productid } = req.params;
  const { name, price, image } = req.body;

  try {
    const updatedProduct = await sql`
    UPDATE products
    SET name=${name}, price=${price}, image=${image}
    WHERE id=${productid}
    RETURNING *
    `;

    if (updateProduct.length === 0) {
      res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.error("Error Updating Product", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const deleteProduct = async (req, res) => {
  const { productid } = req.params;

  try {
    const deletedProduct = await sql`
    DELETE FROM products WHERE id=${productid} RETURNING *
    `;

    console.log(deletedProduct);

    if (deletedProduct.length === 0) {
      res.status(404).json({ success: false, message: "Product Not Found" });
    }
    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.error("Error Deleting Product", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
