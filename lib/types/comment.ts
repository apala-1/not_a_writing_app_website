// types/comment.ts

export interface CommentUser {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface Comment {
  _id: string;
  content: string;
  user: CommentUser;
  replies?: Comment[];
  createdAt: string;
}