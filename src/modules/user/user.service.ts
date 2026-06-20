import { Types } from "mongoose";
import { UserRepository } from "@repository";
import { NotFoundError } from "@response";
import { env, s3Service } from "@services";
import * as userDTO from "./user.dto";

class UserService {
  async getAllUsers() {
    return await UserRepository.find({
      options: { select: "-password" },
    });
  }
  async getUserById(id: Types.ObjectId) {
    const user = await UserRepository.findById({
      id,
      options: { select: "-password" },
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
  async updateUser(
    id: Types.ObjectId,
    { file, files, ...body }: userDTO.UpdateUserDTO,
  ) {
    const user = await UserRepository.findById({ id });
    if (!user) throw new NotFoundError("User not found");

    let profilePicture: string | undefined;
    let coverPhotos: string[] | undefined;

    if (file) {
      profilePicture = await s3Service.uploadOneFile({
        file: file as unknown as Express.Multer.File,
        path: `users/user-${user.id}/profilePicture`,
      });
      if (user.profilePicture)
        await s3Service.deleteOneFile(user.profilePicture);
    }

    if (files && files.length > 0)
      coverPhotos = await s3Service.uploadManyFiles({
        files: files as unknown as Express.Multer.File[],
        path: `users/user-${user.id}/coverPhotos`,
      });
    await UserRepository.updateOne({
      filter: { _id: id },
      update: { ...body, profilePicture, coverPhotos },
    });

    return await UserRepository.findById({
      id,
      options: { select: "-password" },
    });
  }

  async deleteUser(id: Types.ObjectId) {
    await UserRepository.findByIdAndDelete({ id });
    await s3Service.deleteFolder(`users/user-${id}`);
  }
  async deleteAllCoverImages(id: Types.ObjectId) {
    await UserRepository.findByIdAndUpdate({
      id,
      update: { coverPhotos: [] },
    });
    await s3Service.deleteFolder(`users/user-${id}/coverPhotos`);
  }
  async deleteProfilePicture(id: Types.ObjectId) {
    await UserRepository.findByIdAndUpdate({
      id,
      update: {
        profilePicture: `${env.appName}/defaults/profilePicture/default-pfp.gif`,
      },
    });
    await s3Service.deleteFolder(`users/user-${id}/profilePicture`);
  }
}

export default new UserService();
