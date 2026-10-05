import Chat from "./../chat/chat.model.ts";
import {Op} from "sequelize"

const userService = {
    chat_list_by_userid: async ({ userId }: {userId : number}) => {
        try {
            console.log(userId)
            const chats = await Chat.findAll({
                where: {
                    [Op.or]: [
                        { userAId: Number(userId) },
                        { userBId: Number(userId) },
                    ],
                },
            });
            console.log("chats ==>>", chats)
            if(chats.length == 0){
                return {
                    executed: 2,
                    data: { chatId: chats }
                };
            }
            
            return {
                executed: 1,
                data: { chatId: chats }
            };
        } catch (error: any) {
            console.log("ERROR MESSAGE:", error.message);
            console.log("ERROR ORIGINAL:", error.original);
            console.log("ERROR SQL:", error.sql);
             return {
                    executed: 0,
                    data: {},
                    error: error

            };
        }
    }
}

export default userService;