import express from "express";
import userController from "./user.controller.ts";

const router = express.Router();

router.get("/:userId/chats", userController.chat_list_by_userid);

export default router;