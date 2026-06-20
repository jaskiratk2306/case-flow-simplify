import prisma from "../lib/prisma.js";

export const scheduleHearing = async (req, res) => {
  const { id: caseId } = req.params;
  const { hearingDate, purpose, notes } = req.body;

  if (!hearingDate || !purpose) {
    return res.status(400).json({ error: "Hearing date and purpose are required" });
  }

  try {
    // Validate case exists
    const caseItem = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseItem) {
      return res.status(404).json({ error: "Case not found" });
    }

    const hearing = await prisma.hearing.create({
      data: {
        caseId,
        hearingDate,
        purpose,
        notes: notes || "",
      },
    });

    res.status(201).json(hearing);
  } catch (error) {
    console.error("ScheduleHearing error:", error);
    res.status(500).json({ error: "Internal server error scheduling hearing" });
  }
};

export const getHearingsByCase = async (req, res) => {
  const { id: caseId } = req.params;

  try {
    const hearings = await prisma.hearing.findMany({
      where: { caseId },
      orderBy: { hearingDate: "asc" },
    });

    res.json(hearings);
  } catch (error) {
    console.error("GetHearings error:", error);
    res.status(500).json({ error: "Internal server error fetching hearings" });
  }
};
