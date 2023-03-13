import express from "express";
import {
  listContactFormsController,
  insertFormsController,
  updateFormsController,
  deleteFormsController,
  listStatisticsController,
} from "../../controllers/contactFormController.js";

const router = express.Router();

router.get("/", listContactFormsController);
router.get("/statistics/:id", listStatisticsController);
router.post("/", insertFormsController);
router.put("/:id", updateFormsController);
router.delete("/:id", deleteFormsController);

export default router;
