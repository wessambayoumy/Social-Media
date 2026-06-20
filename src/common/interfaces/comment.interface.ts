export interface IComment {
  postId: string;
  userId: string;
  content: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  restoredAt: Date;
}
