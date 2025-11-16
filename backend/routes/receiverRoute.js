import express from "express";
import { trackShipment,confirmDelivery } from "../controllers/receiverController.js";

const router = express.Router();
router.get("/track/:trackingCode", trackShipment);
router.post("/confirm/:trackingCode", confirmDelivery);

export default router;
