import VaultItem from "../models/VaultItem.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import { logActivity } from "../utils/logActivity.js";

/** POST /api/vault */
export const addVaultItem = async (req, res, next) => {
  try {
    const { label, type, notes, tags } = req.body;
    // const encryptedData = encrypt(data);
    const item = await VaultItem.create({
      owner: req.user.userId,
      label,
      type,
      notes,
      tags,
    });
    res.status(201).json({ id: item._id, label });
  } catch (err) {
    next(err);
  }
};

/** GET /api/vault */
export const getVaultItems = async (req, res, next) => {
  try {
    const role = req.user.role;
    let query = {};
    if (role === "OWNER") query.owner = req.user.userId;
    else if (role === "EMERGENCY_CONTACT" || role === "VIEWER") {
      // TODO: validate that user has been shared access by OWNER
      // Placeholder: allow all for demo
    } else return res.status(403).json({ message: "Forbidden" });

    const items = await VaultItem.find(query);
    const decrypted = [];

    for (const item of items) {
      // const decryptedData =decrypt(item.encryptedData);
      decrypted.push({
        id: item._id,
        label: item.label,
        data: item.encryptedData,
        type: item.type,
        notes: item.notes,
        tags: item.tags,
      });

      await logActivity(req.user.userId, "VIEW_VAULT_ITEM", {
        label: item.label,
        source: req.user.role === "EMERGENCY_CONTACT" ? "emergency" : "normal",
      });
    }
    res.json(decrypted);
  } catch (err) {
    next(err);
  }
};

/** GET /api/vault/:id */
export const getVaultItemById = async (req, res, next) => {
  try {
    const item = await VaultItem.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });
    if (!item) return res.status(404).json({ message: "Not found" });

    const decrypted = item.encryptedData;
    res.json({
      label: item.label,
      type: item.type,
      notes: item.notes,
      tags: item.tags,
    });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/vault/:id */
export const updateVaultItem = async (req, res, next) => {
  try {
    const { label, data } = req.body;
    const encryptedData = encrypt(JSON.stringify(data));

    const item = await VaultItem.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { label, type: data.type, notes: data.notes, tags: data.tags },

      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await logActivity(req.user.userId, "UPDATE_VAULT_ITEM", {
      label: item.label,
    });

    res.status(200).json({ message: "Vault item updated successfully" });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/vault/:id */
export const deleteVaultItem = async (req, res, next) => {
  try {
    const item = await VaultItem.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await logActivity(req.user.userId, "DELETE_VAULT_ITEM", {
      label: item.label,
    });

    res.status(200).json({ message: "Vault item deleted successfully" });
  } catch (err) {
    next(err);
  }
};
