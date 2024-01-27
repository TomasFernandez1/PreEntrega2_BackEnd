// Libraries
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import logger from "morgan";

// Config
import { __dirname } from "./utils.js";
import { connectDB } from "./config/config.js";

// Routes & Sockets
import productsRoute from "./routes/products.routes.js";
import cartsRoute from "./routes/carts.routes.js";
import chatRoute, {chatSocket} from './routes/chat.routes.js';
import productFrontRoute, {productFronSocket} from './routes/productFront.routes.js';

// Create Express and ProductManager instances
const app = express();

// Configuration of the server
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
connectDB();

// Configuration of views
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Endpoints
app.use("/api", productsRoute);
app.use("/api", cartsRoute);
app.use(chatRoute);
app.use(productFrontRoute);

// Create server on port 8080
const httpServer = app.listen(8080, () => {
  console.log("Listening port 8080");
});

// Create webSocket
export const io = new Server(httpServer);

// Sockets
chatSocket()
productFronSocket()