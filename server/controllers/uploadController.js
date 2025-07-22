export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  res.status(201).json({
    url: req.file.path,
    public_id: req.file.filename,
  });
};
