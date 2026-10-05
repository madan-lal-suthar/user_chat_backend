import express from "express";

import userRoutes from "../models/user/user.routes.ts";
import chatRoutes from "../models/chat/chat.routes.ts"
const router = express.Router();

router.use("/chat", chatRoutes);
router.use("/user", userRoutes)

export default router;