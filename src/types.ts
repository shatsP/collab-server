export interface Cursor {
  x: number;
  y: number;
  color: string;
  userId: string;
}

export interface Invite {
  email: string;
  role: "viewer" | "editor" | "owner";
}
