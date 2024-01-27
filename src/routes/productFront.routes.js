import { Router } from "express";
import productManagerMongo from "../managers/productManagerMongo.js";
import { io } from "../app.js";

const pManager = new productManagerMongo();
const router = Router();

router
  // Endpoint get all products in real time
  .get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", { pageTitle: "Product List Real Time" });
  })
  // Endpoint get all products
  .get("/", async (req, res) => {
    const listadeproductos = await pManager.getProducts();
    res.render("home", { listadeproductos });
  });

// Socket events for "realtimeproducts"endpoint
export function productFronSocket() {
  io.on("connection", async (socket) => {
    try {
      console.log("client connected con ID:", socket.id);

      const products = await pManager.getProducts();
      io.emit("sendProducts", products);

      socket.on("addProduct", async (newProduct) => {
        try {
          await pManager.createProduct(newProduct);
          const products = await pManager.getProducts();
          io.emit("sendProducts", products);
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("deleteProduct", async (id) => {
        try {
          await pManager.deleteProduct(id);
          const products = await pManager.getProducts();
          io.emit("sendProducts", products);
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
}

export default router;
