import express from "express";
import { initializePayment, releasePayment,verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();
router.post("/initialize", initializePayment);
router.post("/release", releasePayment);
router.get("/verify/:reference", verifyPayment);
export default router;
