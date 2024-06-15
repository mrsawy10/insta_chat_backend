import mongoose from "mongoose";
//
const conversationsType = ["individual", "group"];
const conversationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: conversationsType,
    default: "individual",
  },
  members: [{ type: String }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  updatedAt: { type: Date, default: Date.now },
});

//
const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  sender: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
//

export const Conversation = mongoose.model("Conversation", conversationSchema);
export const Message = mongoose.model("Message", messageSchema);

export default { Conversation, Message };
