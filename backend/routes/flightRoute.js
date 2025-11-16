import express from "express";
import { addFlight, getAllFlights, updateFlightStatus,getCarrierShipments } from "../controllers/flightController.js";
import { authenticateUser} from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/add", authenticateUser, addFlight);
router.get("/get", getAllFlights);
router.get("/shipments", authenticateUser, getCarrierShipments);

router.put("/:flightId/status", authenticateUser, updateFlightStatus);

export default router;
