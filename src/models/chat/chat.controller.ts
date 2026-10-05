import chatService from "./chat.service.ts";
import express from "express";
import type { Request, Response } from "express";
const chatController = {
    create_chat: async (req: Request, res: Response) => {
        const { userAId, userBId } = req.body;


        if (!userAId || !userBId) {
            return res.status(400).json({
                message: "userAId and userBId are required",
            });
        }

        const infoChat = await chatService.create_chat({
            userAId,
            userBId,
        });
        if (infoChat.success == false) {
            return res.status(400).json({
                message: "chat create failed.",
                data: {}
            })
        }

        return res.status(200).json({
            message: "chat successfully created.",
            data: infoChat.data
        })

    },
    send_message: async (req: Request, res: Response) => {
        try {
            const { chatId, senderId, text } = req.body;

            if (!chatId || !senderId || !text) {
                return res.status(400).json({
                    message: "chatId, senderId, and text are required",
                });
            }
            const infoChat = await chatService.send_message({
                chatId,
                senderId,
                text
            });
            if (infoChat.success == false) {
                return res.status(400).json({
                    message: "Message sent failed.",
                    data: {}
                })
            }

            return res.status(200).json({
                message: "Message sent successfully.",
                data: infoChat.data
            })
        } catch (error) {
            console.error("SEND MESSAGE ERROR:", error);
            res.status(400).json({
                data: {},
                error: error,
                message: "Failed to send message",
            });
        }
    },
    get_message_list: async (req: Request, res: Response) => {
        try {
            const { limit } = req.query;
            const { chatId } = req.params
            if (!chatId || !limit) {
                return res.status(400).json({
                    message: "chatId, limit are required",
                });
            }
            const infoChat = await chatService.get_message_list({
                chatId: Number(chatId),
                limit: Number(limit),
            });
            if (infoChat.success == false) {
                return res.status(400).json({
                    message: "Message list failed.",
                    data: {}
                })
            }

            return res.status(200).json({
                message: "Get successful Message List.",
                data: infoChat.data
            })
        } catch (error) {
            res.status(400).json({
                data: {},
                error: error,
                message: "Failed to message list",
            });
        }
    },
    update_last_seen: async (req: Request, res: Response) => {
        try {
            const { chatId } = req.params;
            const { userId, messageId } = req.body;

            if (!userId || !messageId) {
                return res.status(400).json({
                    message: "userId and messageId are required",
                });
            }

            const infoChat = await chatService.update_last_seen({
                chatId: String(chatId || ""),
                messageId: messageId,
                userId: Number(userId)
            });
            if (infoChat.success == false) {
                return res.status(400).json({
                    message: "Message last seen failed.",
                    data: {}
                })
            }

            return res.status(200).json({
                message: "Last seen updated successfully.",
                data: infoChat.data
            })
        } catch (error) {
            res.status(400).json({
                data: {},
                error: error,
                message: "Failed to update last seen",
            });
        }
    },
    mark_message_read: async (req: Request, res: Response) => {
        try {
            const { chatId, messageId } = req.params;
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({
                    message: "userId is required",
                });
            }

            const infoMessage = await chatService.mark_message_read({
                chatId: String(chatId || ""),
                messageId: String(messageId || ""),
                userId: Number(userId),
            });

            if (infoMessage.success == false) {
                return res.status(400).json({
                    message: "Message read failed.",
                    data: {},
                });
            }

            return res.status(200).json({
                message: "Message marked as read successfully.",
                data: infoMessage.data,
            });

        } catch (error) {
            return res.status(400).json({
                data: {},
                error: error,
                message: "Failed to mark message as read",
            });
        }
    },
}

export default chatController