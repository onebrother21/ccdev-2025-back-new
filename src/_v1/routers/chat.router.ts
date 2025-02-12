import express from 'express';
import { chatController } from '../controllers';
import { chatValidators } from '../../validators';
import { AuthJWT } from '../../middlewares';

const router = express.Router();

router.get("/",[AuthJWT,chatController.QueryChats]);
router.post("/",[AuthJWT,...chatValidators.CreateChat,chatController.CreateChat]);
router.get("/:chatId",[AuthJWT,chatController.FetchChat]);

//router.delete("/:chatId",[AuthJWT,chatController.UpdateTask]);
//router.delete("/:chatId/x",[AuthJWT,chatController.UpdateTask]);
//router.post("/:chatId/msgs",[AuthJWT,...chatValidators.AddNote,chatController.CreateMessage]);
//router.put("/:chatId/msgs/:msgId/status",[AuthJWT,...chatValidators.AddNote,chatController.UpdateMessageStatus]);
//router.put("/:chatId/msgs/:msgId/reactions",[AuthJWT,...chatValidators.AddNote,chatController.UpdateMessageReaction])

export default router;