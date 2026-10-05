import express from "express";
import chatController from "./chat.controller.ts";

const router = express.Router();

router.post("/create-chat", chatController.create_chat);
router.post("/send-message", chatController.send_message);
router.post("/:chatId/messages", chatController.get_message_list);
router.post("/:chatId/lastseen", chatController.update_last_seen);
router.post("/:chatId/message/:messageId/read", chatController.mark_message_read);

export default router;