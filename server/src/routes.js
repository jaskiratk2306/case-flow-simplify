import { Router } from "express";
import { register, login, getMe, getJudges } from "./controllers/auth.controller.js";
import { getCases, getCaseById, createCase, updateCase } from "./controllers/case.controller.js";
import { scheduleHearing, getHearingsByCase } from "./controllers/hearing.controller.js";
import { getAnalytics } from "./controllers/analytics.controller.js";
import { authenticateToken, requireRole } from "./middleware/auth.middleware.js";

const router = Router();

// Authentication Routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", authenticateToken, getMe);

// Judges (authenticated)
router.get("/judges", authenticateToken, getJudges);

// Case Routes (authenticated)
router.get("/cases", authenticateToken, getCases);
router.get("/cases/:id", authenticateToken, getCaseById);
router.post("/cases", authenticateToken, createCase);
// Updating case track/status/judge can be done by JUDGE
router.put("/cases/:id", authenticateToken, updateCase);

// Hearing Routes (authenticated)
import { getHearingsByCase, scheduleHearing, getAllHearings } from "./controllers/hearing.controller.js";
router.get("/cases/:id/hearings", authenticateToken, getHearingsByCase);
router.post("/cases/:id/hearings", authenticateToken, requireRole(["JUDGE"]), scheduleHearing);
router.get("/hearings", authenticateToken, getAllHearings);

// Document Routes (authenticated)
import { getDocuments, uploadDocument, downloadDocument, deleteDocument } from "./controllers/document.controller.js";
router.get("/cases/:id/documents", authenticateToken, getDocuments);
router.post("/cases/:id/documents", authenticateToken, uploadDocument);
router.get("/cases/:id/documents/:docId/download", authenticateToken, downloadDocument);
router.delete("/cases/:id/documents/:docId", authenticateToken, deleteDocument);

// Activity & Notes Routes (authenticated)
import { getCaseActivity, getCaseNotes, addCaseNote } from "./controllers/notes.controller.js";
router.get("/cases/:id/activity", authenticateToken, getCaseActivity);
router.get("/cases/:id/notes", authenticateToken, getCaseNotes);
router.post("/cases/:id/notes", authenticateToken, addCaseNote);

// Analytics Route (authenticated)
router.get("/analytics", authenticateToken, getAnalytics);

export default router;
