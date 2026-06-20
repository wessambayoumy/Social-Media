export interface IReply {
  commentId: string;
  userId: string;
  content: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  restoredAt: Date;
}
