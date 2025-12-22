import { atom } from "recoil";
import { MessageInterface } from "../types";

export const userAtom = atom({
  key: "user",
  default: null,
});

export const socketAtom = atom({
  key: "socket",
  default: new WebSocket(import.meta.env.VITE_WS_URL ?? "ws://localhost:8080"),
});

export const messageAtom = atom({
  key: "message",
  default: "",
});

export const nameAtom = atom({
  key: "name",
  default: "",
});

export const messagesAtom = atom<MessageInterface[]>({
  key: "messages",
  default: JSON.parse(localStorage.getItem("messages") || "[]"),
});

export const roomIdAtom = atom<string>({
  key: "roomId",
  default: "",
});

export const iamgeAtom = atom({
  key: "image",
  default: "",
});

export const avatarAtom = atom<string>({
  key: "avatar",
  default: "",
});
