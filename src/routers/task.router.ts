import express from 'express';
import { taskController } from '../controllers';
import { AuthJWT } from '../middlewares';
import { Routes } from './routeStrings';
import { taskValidators } from '../validators';

const router = express.Router();
router.get(Routes.tasks,[AuthJWT,taskController.QueryTasks]);
router.get(Routes.tasks+"/details",[AuthJWT,taskController.QueryTasksByDetails]);
router.post(Routes.tasks,[AuthJWT,...taskValidators.CreateTask,taskController.CreateTask]);
router.get(Routes.taskId,[AuthJWT,taskController.GetTask]);
router.put(Routes.taskId,[AuthJWT,...taskValidators.UpdateTask,taskController.UpdateTask]);
router.delete(Routes.taskId,[AuthJWT,taskController.UpdateTask]);
router.delete(Routes.taskId+"/x",[AuthJWT,taskController.UpdateTask]);
router.post(Routes.taskId+"/notes",[AuthJWT,...taskValidators.AddNote,taskController.AddNote]);
router.put(Routes.taskId+"/notes/:slug",[AuthJWT,...taskValidators.AddNote,taskController.UpdateNote]);
router.post(Routes.taskId+"/tasks",[AuthJWT,...taskValidators.CreateTask,taskController.AddSubTask]);
router.put(Routes.taskId+"/tasks/:subtaskId",[AuthJWT,...taskValidators.UpdateTask,taskController.UpdateSubTask]);

export default router;