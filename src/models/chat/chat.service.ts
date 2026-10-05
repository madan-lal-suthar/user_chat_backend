import Chat from "./chat.model.ts";
import { db } from "./../../firebase/firebase.ts"

import { FieldValue } from "firebase-admin/firestore";

interface CreateChatInput {
    userAId: number;
    userBId: number;
}
interface SendMessageBody {
    senderId: number;
    text: string;
    chatId: number
}
const chatService = {
    create_chat: async ({ userAId, userBId }: CreateChatInput) => {
        try {
            console.log("userAId:", userAId);
            console.log("userBId:", userBId);
            const existingChat = await Chat.findOne({
                where: {
                    userAId,
                    userBId,
                },
            });


            if (existingChat) {
                return {
                    success: true,
                    data: { chatId: existingChat.id }


                };
            }

            const chat = await Chat.create({
                userAId: userAId,
                userBId: userBId
            });

            return {
                success: true,
                data: { chatId: chat.id }
            };
        } catch (error: any) {
            console.log("ERROR MESSAGE:", error.message);
            console.log("ERROR ORIGINAL:", error.original);
            console.log("ERROR SQL:", error.sql);
            throw error;
        }
    },

    send_message: async (
        { chatId, senderId, text }: SendMessageBody
    ) => {
        try {
            const messageRef = await db.collection("messages").add({
                chatId,
                senderId,
                text: text.trim(),
                timestamp: FieldValue.serverTimestamp(),
            });

            return {
                success: true,
                data: {
                    messageId: messageRef.id,
                    chatId,
                    senderId,
                    text: text.trim(),
                }
            }


        } catch (error) {
            console.error("SEND MESSAGE ERROR:", error);
            return ({
                success: false,
                message: "Failed to send message",
            });
        }
    },

    get_message_list: async (
        { chatId, limit }: { chatId: number; limit: number }
    ) => {
        try {
            const messageSnapshot = await db
                .collection("messages")
                .where("chatId", "==", chatId)
                .limit(limit)
                .get();

            const messages = messageSnapshot.docs.map((doc) => ({
                messageId: doc.id,
                ...doc.data(),
            }));

            return {
                success: true,
                data: messages,
            };
        } catch (error) {
            console.error("GET MESSAGE LIST ERROR:", error);
            return {
                success: false,
                message: "Failed to get messages",
            };
        }
    },

    update_last_seen: async (
        { userId, messageId, chatId }: { userId: number, messageId: string, chatId: string }
    ) => {
        try {
            const memberRef = db
                .collection("chats")
                .doc(chatId)
                .collection("members")
                .doc(String(userId));

            await memberRef.set(
                {
                    lastSeenMessageId: messageId,
                    lastSeenAt: new Date(),
                },
                { merge: true }
            );

            return ({
                success: true,
                data: {
                    chatId,
                    userId,
                    messageId
                }
            });
        } catch (error) {
            console.error("LAST SEEN ERROR:", error);

            return ({
                success: false,
                error: error,
                message: "last seen failed."
            });
        }
    },

    mark_message_read: async (
        {
            chatId,
            messageId,
            userId,
        }: {
            chatId: string;
            messageId: string;
            userId: number;
        }
    ) => {
        try {
            const messageRef = db
                .collection("messages")
                .doc(messageId);

            await messageRef.set(
                {
                    readBy: {
                        [String(userId)]: true,
                    },
                },
                {
                    merge: true,
                }
            );

            return {
                success: true,
                data: {
                    chatId,
                    messageId,
                    userId,
                    read: true,
                },
            };

        } catch (error) {
            console.error("MARK MESSAGE READ ERROR:", error);

            return {
                success: false,
                error: error,
                message: "Mark message read failed.",
            };
        }
    },
};

export default chatService;