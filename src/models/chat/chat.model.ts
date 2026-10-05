import { DataTypes, Model } from "sequelize";

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../database/database.ts";

class Chat extends Model<
  InferAttributes<Chat>,
  InferCreationAttributes<Chat>
> {
  declare id: CreationOptional<number>;
  declare userAId: number;
  declare userBId: number;
}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userAId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userBId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "chats",
    timestamps: true,
  }
);

export default Chat;