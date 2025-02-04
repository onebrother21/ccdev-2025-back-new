import express from 'express';
import { chatController } from '../controllers';
import { AuthJWT } from '../middlewares';
import { Routes } from './routeStrings';
import { chatValidators } from '../validators';

const router = express.Router();
router.get(Routes.chats,[AuthJWT,chatController.QueryChats]);
router.post(Routes.chats,[AuthJWT,...chatValidators.CreateChat,chatController.CreateChat]);
router.get(Routes.chatId,[AuthJWT,chatController.FetchChat]);
//router.delete(Routes.chatId,[AuthJWT,chatController.UpdateTask]);
//router.delete(Routes.chatId+"/x",[AuthJWT,chatController.UpdateTask]);
//router.post(Routes.chatId+"/msgs",[AuthJWT,...chatValidators.AddNote,chatController.CreateMessage]);
//router.put(Routes.chatId+"/msgs/:msgId/status",[AuthJWT,...chatValidators.AddNote,chatController.UpdateMessageStatus]);
//router.put(Routes.chatId+"/msgs/:msgId/reactions",[AuthJWT,...chatValidators.AddNote,chatController.UpdateMessageReaction])

export default router;