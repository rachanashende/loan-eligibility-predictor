import { Router } from "express";
import { validateApplication } from "../middleware/validate.js";
import { checkEligibility, getHistory, getApplicationById } from "../controllers/eligibility.controller.js";

const router = Router();

router.post("/check-eligibility", validateApplication, checkEligibility);
router.get("/history", getHistory);
router.get("/history/:id", getApplicationById);

export default router;
