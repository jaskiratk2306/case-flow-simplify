import prisma from "../lib/prisma.js";

export const getAnalytics = async (req, res) => {
  try {
    const totalCases = await prisma.case.count();
    const activeCases = await prisma.case.count({ where: { status: "ACTIVE" } });
    const pendingCases = await prisma.case.count({ where: { status: "PENDING" } });
    const resolvedCases = await prisma.case.count({ where: { status: "RESOLVED" } });

    const fastTrackCount = await prisma.case.count({ where: { track: "FAST" } });
    const standardTrackCount = await prisma.case.count({ where: { track: "STANDARD" } });
    const complexTrackCount = await prisma.case.count({ where: { track: "COMPLEX" } });

    // Recent 5 hearings
    const recentHearings = await prisma.hearing.findMany({
      take: 5,
      orderBy: { hearingDate: "asc" },
      include: {
        caseItem: {
          select: {
            title: true,
          },
        },
      },
    });

    res.json({
      counts: {
        total: totalCases,
        active: activeCases,
        pending: pendingCases,
        resolved: resolvedCases,
      },
      tracks: {
        fast: fastTrackCount,
        standard: standardTrackCount,
        complex: complexTrackCount,
      },
      recentHearings,
    });
  } catch (error) {
    console.error("GetAnalytics error:", error);
    res.status(500).json({ error: "Internal server error aggregating analytics data" });
  }
};
