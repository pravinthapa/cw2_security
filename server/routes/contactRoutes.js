import { Router } from "express";
import {
  addContact,
  deleteContact,
  getContacts,
} from "../controllers/contactController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", protect, addContact);
router.get("/", protect, getContacts);
router.delete("/:id", protect, deleteContact);

export default router;
 