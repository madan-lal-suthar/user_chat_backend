import userService from "./user.service.ts";

import type { Request, Response } from "express";

const userController = {
    chat_list_by_userid : async(req: Request, res: Response) => {
       try {
            const { userId } = req.params
            console.log(userId)

            // if(!userId){
            //     return res.json({
            //         message: "UserId is required"
            //     })
            // }
            
            const infoChat = await userService.chat_list_by_userid({
                userId: Number(userId)
            });
            if (infoChat.executed == 2) {
                return res.status(200).json({
                    message: "User chat list did not found.",
                    data: {}
                })
            }else if(infoChat.executed == 0){
                return res.status(200).json({
                    message: "User chat list failed.",
                    data: {}
                })
            }

            return res.status(200).json({
                message: "Get successful user chat List.",
                data: infoChat.data
            })
        } catch (error) {
            res.status(400).json({
                data: {},
                error: error,
                message: "Failed to user chat list",
            });
        }
    
    }
} 

export default userController