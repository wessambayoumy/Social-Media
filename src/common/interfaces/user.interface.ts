import { genderEnum, providerEnum, roleEnum } from "@enums";

export interface IUser {
  fName: string;
  lName: string;
  userName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  profilePicture?: string;
  age?: number;
  gender: genderEnum;
  provider: providerEnum;
  role: roleEnum;
  views: number;
  signOutDate: Date;
  twoFactorEnabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
