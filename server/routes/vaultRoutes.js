// server/routes/vaultRoutes.js

import { Router } from "express";
import {
  addVaultItem,
  getVaultItems,
  getVaultItemById,
  updateVaultItem,
  deleteVaultItem,
} from "../controllers/vaultController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../middlewares/roleMiddleware.js";

const router = Router();

// Apply JWT authentication to all vault routes
router.use(protect());

// /api/vault/
// GET: all items for user
// POST: create new item (owner only)
router
  .route("/")
  .get(restrictTo("OWNER", "EMERGENCY_CONTACT", "VIEWER"), getVaultItems)
  .post(restrictTo("OWNER"), addVaultItem);

// /api/vault/:id
// GET: view one item
// PUT: update item
// DELETE: delete item (owner only)
router
  .route("/:id")
  .get(restrictTo("OWNER"), getVaultItemById)
  .put(restrictTo("OWNER"), updateVaultItem)
  .delete(restrictTo("OWNER"), deleteVaultItem);

export default router;
