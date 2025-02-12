import express from 'express';
import { taskController } from '../controllers';
import { AuthJWT } from '../../middlewares';
import { taskValidators } from '../../validators';

const router = express.Router();
router.get("/",[AuthJWT,taskController.QueryTasks]);
router.get("/details",[AuthJWT,taskController.QueryTasksByDetails]);
router.post("/",[AuthJWT,...taskValidators.CreateTask,taskController.CreateTask]);
router.get("/:taskId",[AuthJWT,taskController.GetTask]);
router.put("/:taskId",[AuthJWT,...taskValidators.UpdateTask,taskController.UpdateTask]);
router.delete("/:taskId",[AuthJWT,taskController.UpdateTask]);
router.delete("/:taskId/x",[AuthJWT,taskController.UpdateTask]);
router.post("/:taskId/notes",[AuthJWT,...taskValidators.AddNote,taskController.AddNote]);
router.put("/:taskId/notes/:slug",[AuthJWT,...taskValidators.AddNote,taskController.UpdateNote]);
router.post("/:taskId/tasks",[AuthJWT,...taskValidators.CreateTask,taskController.AddSubTask]);
router.put("/:taskId/tasks/:subtaskId",[AuthJWT,...taskValidators.UpdateTask,taskController.UpdateSubTask]);

export default router;