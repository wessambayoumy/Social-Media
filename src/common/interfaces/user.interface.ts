import { genderEnum, providerEnum, roleEnum } from "@enums";
import { Types } from "mongoose";

export interface IUser {
  fName: string;
  lName: string;
  userName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  profilePicture?: string;
  coverPhotos?: string[];
  age?: number;
  gender: genderEnum;
  provider: providerEnum;
  role: roleEnum;
  friends?:  Types.ObjectId[] | IUser[];
  views: number;
  signOutAt: Date;
  twoFactorEnabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  restoredAt: Date;
}
