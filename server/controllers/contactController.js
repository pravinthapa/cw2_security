import Contact from "../models/Contact.js";

export const addContact = async (req, res) => {
  try {
    const { email, firstName, lastName, phone, relationship, accessLevel } =
      req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const exists = await Contact.findOne({ owner: req.user.id, email });
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

export const getContacts = async (req, res) => {
  const contacts = await Contact.find({ owner: req.user.id });
  res.status(200).json(contacts);
};

export const deleteContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact || contact.owner.toString() !== req.user.id) {
    return res
      .status(404)
      .json({ message: "Contact not found or unauthorized" });
  }

  await contact.deleteOne();
  res.status(200).json({ message: "Contact removed" });
};
