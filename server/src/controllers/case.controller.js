import prisma from "../lib/prisma.js";

export const getCases = async (req, res) => {
  const { search, track, status } = req.query;

  try {
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { id: { contains: search } },
        { title: { contains: search } },
        { parties: { contains: search } },
      ];
    }

    if (track && track !== "all") {
      whereClause.track = track.toUpperCase();
    }

    if (status && status !== "all") {
      whereClause.status = status.toUpperCase();
    }

    const cases = await prisma.case.findMany({
      where: whereClause,
      include: {
        assignedJudge: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(cases);
  } catch (error) {
    console.error("GetCases error:", error);
    res.status(500).json({ error: "Internal server error retrieving cases" });
  }
};

export const getCaseById = async (req, res) => {
  const { id } = req.params;

  try {
    const caseItem = await prisma.case.findUnique({
      where: { id },
      include: {
        assignedJudge: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        hearings: {
          orderBy: {
            hearingDate: "asc",
          },
        },
      },
    });

    if (!caseItem) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(caseItem);
  } catch (error) {
    console.error("GetCaseById error:", error);
    res.status(500).json({ error: "Internal server error retrieving case" });
  }
};

export const createCase = async (req, res) => {
  const { title, description, track, parties } = req.body;

  if (!title || !parties) {
    return res.status(400).json({ error: "Title and parties are required fields" });
  }

  try {
    // Generate sequential ID
    const count = await prisma.case.count();
    const nextNum = String(count + 1).padStart(3, "0");
    const currentYear = new Date().getFullYear();
    const caseId = `CF-${currentYear}-${nextNum}`;

    const newTrack = (track || "STANDARD").toUpperCase();

    const createdCase = await prisma.case.create({
      data: {
        id: caseId,
        title,
        description: description || "",
        track: newTrack,
        status: "PENDING",
        parties,
        filedDate: new Date().toISOString().split("T")[0],
      },
    });

    res.status(201).json(createdCase);
  } catch (error) {
    console.error("CreateCase error:", error);
    res.status(500).json({ error: "Internal server error creating case" });
  }
};

export const updateCase = async (req, res) => {
  const { id } = req.params;
  const { title, description, track, status, assignedJudgeId } = req.body;

  try {
    const existingCase = await prisma.case.findUnique({
      where: { id },
    });

    if (!existingCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (track !== undefined) updateData.track = track.toUpperCase();
    if (status !== undefined) updateData.status = status.toUpperCase();

    if (assignedJudgeId !== undefined) {
      if (assignedJudgeId === null || assignedJudgeId === "") {
        updateData.assignedJudgeId = null;
      } else {
        // Validate judge exists
        const judge = await prisma.user.findFirst({
          where: { id: assignedJudgeId, role: "JUDGE" },
        });

        if (!judge) {
          return res.status(400).json({ error: "Invalid Judge ID. Assigned user must be a JUDGE." });
        }
        updateData.assignedJudgeId = assignedJudgeId;
      }
    }

    const updatedCase = await prisma.case.update({
      where: { id },
      data: updateData,
      include: {
        assignedJudge: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(updatedCase);
  } catch (error) {
    console.error("UpdateCase error:", error);
    res.status(500).json({ error: "Internal server error updating case" });
  }
};
