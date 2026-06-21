import prisma from "../lib/prisma.js";

// GET /api/cases/:id/documents
export const getDocuments = async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await prisma.document.findMany({
      where: { caseId: id },
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: { select: { name: true, role: true } } },
    });
    // Return metadata only (not base64 data) for listing
    res.json(docs.map(({ data, ...d }) => d));
  } catch (err) {
    console.error("getDocuments error:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// GET /api/cases/:id/documents/:docId/download
export const downloadDocument = async (req, res) => {
  const { docId } = req.params;
  try {
    const doc = await prisma.document.findUnique({ where: { id: docId } });
    if (!doc) return res.status(404).json({ error: "Document not found" });

    const buffer = Buffer.from(doc.data, "base64");
    res.setHeader("Content-Type", doc.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${doc.filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error("downloadDocument error:", err);
    res.status(500).json({ error: "Failed to download document" });
  }
};

// POST /api/cases/:id/documents
export const uploadDocument = async (req, res) => {
  const { id } = req.params;
  const { filename, data, mimeType, size } = req.body;

  if (!filename || !data || !mimeType) {
    return res.status(400).json({ error: "filename, data, and mimeType are required" });
  }
  if (size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: "File too large. Maximum size is 5MB." });
  }

  try {
    const doc = await prisma.document.create({
      data: {
        caseId: id,
        filename,
        data,
        mimeType,
        size: size || 0,
        uploadedById: req.user.id,
      },
      include: { uploadedBy: { select: { name: true, role: true } } },
    });

    // Log activity
    await prisma.caseActivity.create({
      data: {
        caseId: id,
        actorId: req.user.id,
        action: "DOC_UPLOADED",
        newValue: filename,
      },
    });

    const { data: _d, ...docMeta } = doc;
    res.status(201).json(docMeta);
  } catch (err) {
    console.error("uploadDocument error:", err);
    res.status(500).json({ error: "Failed to upload document" });
  }
};

// DELETE /api/cases/:id/documents/:docId
export const deleteDocument = async (req, res) => {
  const { docId } = req.params;
  try {
    await prisma.document.delete({ where: { id: docId } });
    res.json({ success: true });
  } catch (err) {
    console.error("deleteDocument error:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
};
