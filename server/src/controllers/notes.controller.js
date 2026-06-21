import prisma from "../lib/prisma.js";

// GET /api/cases/:id/activity
export const getCaseActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await prisma.caseActivity.findMany({
      where: { caseId: id },
      orderBy: { createdAt: "desc" },
      include: { actor: { select: { name: true, role: true } } },
    });
    res.json(activity);
  } catch (err) {
    console.error("getCaseActivity error:", err);
    res.status(500).json({ error: "Failed to fetch activity log" });
  }
};

// GET /api/cases/:id/notes
export const getCaseNotes = async (req, res) => {
  const { id } = req.params;
  try {
    const notes = await prisma.caseNote.findMany({
      where: { caseId: id },
      orderBy: { createdAt: "asc" },
      include: { author: { select: { name: true, role: true } } },
    });
    res.json(notes);
  } catch (err) {
    console.error("getCaseNotes error:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// POST /api/cases/:id/notes
export const addCaseNote = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({ error: "Note content cannot be empty" });
  }

  try {
    const note = await prisma.caseNote.create({
      data: {
        caseId: id,
        authorId: req.user.id,
        content: content.trim(),
      },
      include: { author: { select: { name: true, role: true } } },
    });

    // Log activity
    await prisma.caseActivity.create({
      data: {
        caseId: id,
        actorId: req.user.id,
        action: "NOTE_ADDED",
      },
    });

    res.status(201).json(note);
  } catch (err) {
    console.error("addCaseNote error:", err);
    res.status(500).json({ error: "Failed to add note" });
  }
};
