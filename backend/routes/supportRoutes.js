import express from "express";
import {
  getUserMessages,
  getAllMessagesForAgents,
  createMessage,
} from "../controllers/supportController.js";
const router = express.Router();
router.get("/user/:userId", getUserMessages);
router.get("/agent/all", getAllMessagesForAgents);
router.post("/message", createMessage);

export default router;
