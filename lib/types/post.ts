export interface Author {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface Attachment {
  url: string;
  type: "image" | "gif" | "file" | "pjpeg" | "webp";
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  content: any; // matches backend's Schema.Types.Mixed
  author: Author;
  attachments?: Attachment[];
  status: "draft" | "published";
  visibility: "public" | "private";
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}