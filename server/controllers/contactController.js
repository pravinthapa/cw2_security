import Contact from "../models/Contact.js";

// @desc    Add a new emergency contact
// @route   POST /api/contacts
// @access  Private
export const addContact = async (req, res) => {
  try {
    const { email, firstName, lastName, phone, relationship, accessLevel } =
      req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const exists = await Contact.findOne({
      owner: req.user.id,
      contactUser: email,
    });
    if (exists) {
      return res.status(409).json({ message: "Contact already exists" });
    }

    const contact = await Contact.create({
      owner: req.user.id,
      contactUser: email,
      firstName,
      lastName,
      phone,
      relationship,
      accessLevel,
    });

    res.status(201).json(contact);
  } catch (error) {
    console.error("Add contact error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user's emergency contacts
// @route   GET /api/contacts
// @access  Private
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact || contact.owner.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Contact not found or unauthorized" });
    }

    await contact.deleteOne();
    res.status(200).json({ message: "Contact removed" });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
