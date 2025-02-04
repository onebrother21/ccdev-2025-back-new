import { Chat,Message, Notification } from '../models';
import { CommonUtils } from '../utils';
import { transStrings } from '../utils/locales';
import * as AllTypes from "../types";

const CreateChat:IHandler = async (req,res,next) => {
  try {
    const user = req.user as AllTypes.IUser;
    const profile = user.getProfile(user.role);
    const sender = profile.id,senderRef = user.role + "s";
    //allow sending messages to oneself but prevent addressee and notification duplication by pruning the sender from "recipients"
    const {recipients:recipients_,content} = req.body.data;
    const recipients = (recipients_ as MiscModelRef[]).filter(r => r.id !== sender).map(r => r.id);
    const recipientRefs = (recipients_ as MiscModelRef[]).filter(r => r.id !== sender).map(r => r.ref);
    const chat = new Chat({
      participants: [sender,...recipients],
      participantRefs: [senderRef,...recipientRefs],
      messages: []
    });
    await chat.save();
    const message = new Message({ chat:chat._id,sender,senderRef,content });
    await message.save();
    chat.messages.push(message);
    chat.lastMessage = message;
    await chat.populate('participants messages');
    await chat.save();
    const userRecipients = chat.participants.map(profile => profile.user);
    const notification = new Notification({users:[userRecipients],type:"CHAT_INVITE",data:{name:profile.name}});
    await notification.save();
    res.locals = {
      status:201,
      success:true,
      data:chat.json(),
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
const FetchChat:IHandler = async (req,res,next) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId).populate('participants').populate({
      path: 'messages',
      options:{limit:10,sort:{ timestamp: -1 } },
    });
    if (!chat) res.status(404).json({ error: 'Chat not found' });
    res.locals = {
      status:201,
      success:true,
      data:chat.json(),
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
const UpdateChat:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const updates = req.body.data;
  const chatId = req.params.id;
  const options = {new:true,runValidators:true};
  if (!chatId) res.status(400).json({success: false,message: "No chat identifier provided!"});
  try {
    const chat = await Chat.findByIdAndUpdate(chatId,{ $set:updates },options);
    if (!chat) res.status(404).json({
      success: false,
      message:"Chat does not exist"
    });
    else {
      await chat.populate(`users messages`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:chat.json()
      };
      next();
    }
  }
  catch(e){
    res.status(422).send({
      success:false,
      message:"Operation failed",
      error:e,
    });
  }
};
const DeleteChat:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const data = req.body.data;
  try {
    const { chatId } = data;
    const chat = await Chat.findById(chatId);
    if (!chat) res.status(404).json({ error: 'Chat not found' });
    chat.setStatus(AllTypes.IChatStatuses.DELETED);
    await chat.save();
    res.locals = {
      status:201,
      success:true,
      data:{ok:true},
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
const HardDeleteChat:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const data = req.body.data;
  try {
    const { chatId } = data;
    const chat = await Chat.findById(chatId);
    if (!chat) res.status(404).json({ error: 'Chat not found' });
    chat.setStatus(AllTypes.IChatStatuses.DELETED);
    await chat.save();
    res.locals = {
      status:201,
      success:true,
      data:{ok:true},
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
const QueryChats:IHandler = async (req,res,next) => {
  try {
    const { user } = req.query;
    const chats = await Chat.find({ participants: user });
    const results = await Promise.all(
      chats.map(async (chat) => (await chat.populate('participants')).json())
    );
    res.locals = {
      status:201,
      success:true,
      data:results,
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
const CreateMessage:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const {sender,recipients,content} = req.body.data;
  const chatId = req.params.id;
  try {
    const chat = await Chat.findById(chatId);
    const message = new Message({ chat: chat._id, sender, content });
    await message.save();
    chat.messages.push(message);
    chat.lastMessage = message;
    await chat.populate('messages lastMessage');
    await chat.save();
    const notification = new Notification({ users:[recipients],type:"CHAT_INVITE" });
    await notification.save();
    res.locals = {
      status:201,
      success:true,
      data:chat.lastMessage,
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
const UpdateMessageStatus:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const { msgId } = req.params;
  const { status } = req.body.data;
  try {
    const message = await Message.findById(msgId);
    if(!message) res.status(404).json({ error: 'Message not found' });
    message.setStatus(status);
    await message.save();
    await Chat.findByIdAndUpdate(message.chat,{$set:{updatedOn:new Date()}});
    res.locals = {
      status:201,
      success:true,
      data:message.json(),
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
const UpdateMessageReaction:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const { msgId } = req.params;
  const { reaction } = req.body.data;
  try {
    const message = await Message.findById(msgId);
    const reacj = { user:req.user.id,reaction,time:new Date(),userRef:role +"s" };
    if(!message) res.status(404).json({ error: 'Message not found' });
    const existingReactionIndex = message.reactions.findIndex((r) => r.user.toString() === req.user.id);
    if(existingReactionIndex !== -1) message.reactions[existingReactionIndex] = reacj as any;
    else message.reactions.push(reacj as any);
    await message.save();
    res.locals = {
      status:201,
      success:true,
      data:message.json(),
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
export {
  CreateChat,
  FetchChat,
  UpdateChat,
  DeleteChat,
  HardDeleteChat,
  QueryChats,
  CreateMessage,
  UpdateMessageStatus,
  UpdateMessageReaction,
};