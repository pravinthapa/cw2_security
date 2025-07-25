import express from "express";

import {
  addContact,
  getContacts,
  deleteContact,
} from "../controllers/contactController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.route("/").post(addContact).get(getContacts);
router.route("/:id").delete(deleteContact);

export default router;
