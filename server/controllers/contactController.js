const Contact = require("../models/contactModel");

// @desc    Add a new emergency contact
// @route   POST /api/contacts
// @access  Private
const addContact = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const exists = await Contact.findOne({ owner: req.user.id, email });
  if (exists) {
    return res.status(409).json({ message: "Contact already exists" });
  }

  const contact = await Contact.create({
    owner: req.user.id,
    email,
  });

  res.status(201).json(contact);
};

// @desc    Get user's emergency contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res) => {
  const contacts = await Contact.find({ owner: req.user.id });
  res.status(200).json(contacts);
};

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact || contact.owner.toString() !== req.user.id) {
    return res
      .status(404)
      .json({ message: "Contact not found or unauthorized" });
  }

  await contact.deleteOne();
  res.status(200).json({ message: "Contact removed" });
};

module.exports = {
  addContact,
  getContacts,
  deleteContact,
};
