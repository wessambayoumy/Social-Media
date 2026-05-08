import * as authDTO from "./auth.dto";
import { IUser, JwtDetails } from "@interfaces";
import { env, CacheService } from "@services";
import { UserRepository } from "@repository";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnAuthorizedError,
} from "@response";
import { generatePassword, HashService, JwtService } from "@security";
import { EventEmitter } from "node:events";
import { Types } from "mongoose";
import { providerEnum, roleEnum } from "@enums";
import { OAuth2Client } from "google-auth-library";

class AuthService {
  private readonly event = new EventEmitter();

  async refreshToken(token: string) {
    if (!token) throw new UnAuthorizedError("Token is required");
    if (await CacheService.get(`revokeId:${JwtService.decode(token)?.jti}`))
      throw new UnAuthorizedError("Token Revoked");

    const decoded = JwtService.decode(token) as JwtDetails;

    if (decoded.exp! - decoded.iat! != env.jwtExpiryRefresh)
      throw new UnAuthorizedError("Invalid refresh token");

    const user = await UserRepository.findById({ id: decoded.userId });
    if (!user) throw new NotFoundError("User not found");

    return JwtService.signToken(
      { userId: user._id, role: user.role },
      user.role === roleEnum.admin
        ? env.jwtAdminSecretAccess
        : env.jwtUserSecretAccess,
      { expiresIn: env.jwtExpiryAccess },
    );
  }

  async signUp({
    fName,
    lName,
    email,
    password,
    phoneNumber,
    profilePicture,
    age,
  }: authDTO.SignUpDTO): Promise<IUser> {
    if (
      await UserRepository.findOne({
        filter: { email },
        options: { select: "-password" },
      })
    )
      throw new ConflictError("User already exists");

    const user = await UserRepository.create({
      data: {
        fName,
        lName,
        email,
        ...(password && { password }),
        ...(phoneNumber && {
          phoneNumber,
        }),
        ...(profilePicture && { profilePicture }),
        ...(age && { age }),
      },
    });

    if (!user) throw new BadRequestError("Failed to create user");

    let x = user;
    delete x.password;

    console.log(x);

    return x;
  }
  async signIn({ email, password }: authDTO.SignInDTO) {
    let user = await UserRepository.findOne({
      filter: { email },
      options: { select: "password" },
    });

    if (!user || !(await HashService.compareHash(password, user.password!)))
      throw new UnAuthorizedError("Invalid email or password");

    const AccessToken = JwtService.signToken(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      user.role === roleEnum.admin
        ? env["jwtAdminSecretAccess"]
        : env["jwtUserSecretAccess"],
      { expiresIn: env.jwtExpiryAccess },
    );
    const RefreshToken = JwtService.signToken(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      user.role == roleEnum.admin
        ? env["jwtAdminSecretRefresh"]
        : env["jwtUserSecretRefresh"],
      { expiresIn: env.jwtExpiryRefresh },
    );
    const { password: _, ...userWithoutPassword } = user.toObject();

    return { user: userWithoutPassword, AccessToken, RefreshToken };
  }
  async signUpWithGoogle(idToken: string) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience:
        "915394953197-19q5e2uqink77n0e393oe9gaf1d8t4ko.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();

    if (!payload) throw new BadRequestError("Invalid Google token");

    const { email, email_verified, name } = payload as {
      email: string;
      email_verified: boolean;
      name: string;
    };

    let user = await UserRepository.findOne({
      filter: { email, provider: providerEnum.google },
    });

    user ??
      (await UserRepository.create({
        data: {
          ...(name && { userName: name }),
          ...(email && { email }),
          ...(email_verified && { confirmed: email_verified }),
          provider: providerEnum.google,
        },
      }));

    const AccessToken = JwtService.signToken(
      { userId: user!._id, email: user!.email },
      env.jwtUserSecretAccess,
      { expiresIn: env.jwtExpiryAccess },
    );
    const RefreshToken = JwtService.signToken(
      { userId: user!._id, email: user!.email },
      env.jwtUserSecretRefresh,
      { expiresIn: env.jwtExpiryRefresh },
    );
    return { AccessToken, RefreshToken };
  }
  async signOut(token: string) {
    let { jti } = JwtService.decode(token) as { jti: string };

    await CacheService.set({
      key: `revokeId:${jti}`,
      value: 1,
      options: { expiration: { type: "EX", value: 7 * 24 * 60 * 60 } },
    });
  }
  async signOutFromAll(userId: Types.ObjectId) {
    const user = await UserRepository.findById({ id: userId });
    user.signOutDate = new Date();
    await user.save();
  }
  async updatePassword(
    { currentPassword, newPassword, reNewPassword }: authDTO.UpdatePasswordDTO,
    id: Types.ObjectId,
  ) {
    const user = await UserRepository.findById({
      id,
      options: { select: "password" },
    });

    if (!user) throw new NotFoundError("User not found");

    if (!(await HashService.compareHash(currentPassword, user.password!))) {
      throw new UnAuthorizedError("Current password is incorrect");
    }
    if (newPassword !== reNewPassword) {
      throw new ConflictError("New passwords don't match");
    }
    user.password = newPassword;

    await user.save();
    return user;
  }
  async resetPassword(email: string) {
    const user = await UserRepository.findOne({
      filter: { email },
    });
    if (!user) throw new NotFoundError("user not found");

    this.event.emit(`forgetPassword/${user._id}`, email);
  }
  async enable2FA(id: Types.ObjectId) {
    const user = await UserRepository.findById({ id });
    if (!user) throw new NotFoundError("User not found");

    if (user.twoFactorEnabled) throw new ConflictError("2FA already enabled");

    this.event.emit(`enable2FA/${user._id}`, user.email);
  }
  async disable2FA(userId: Types.ObjectId) {
    const user = await UserRepository.findById({ id: userId });
    if (!user) throw new NotFoundError("User not found");

    if (!user.twoFactorEnabled) {
      throw new ConflictError("2FA is not enabled");
    }

    this.event.emit(`disable2FA/${user._id}`, user.email);
  }
  async verifyOtp({ code, email, name }: authDTO.VerifyOtpDTO) {
    0;
    const user = await UserRepository.findOne({ filter: { email } });

    if (!user) throw new NotFoundError("user not found");

    const redisOtp = await CacheService.get(name);
    if (!redisOtp) throw new BadRequestError("otp not sent");
    if (!(await HashService.compareHash(code, redisOtp)))
      throw new UnAuthorizedError("Incorrect otp");
    let data = {};
    switch (name) {
      case `enable2FA/${user._id}`: {
        user.twoFactorEnabled = true;
        data = { message: `2FA enabled successfully` };
        break;
      }
      case `disable2FA/${user._id}`: {
        user.twoFactorEnabled = false;
        data = { message: `2FA disabled successfully` };
        break;
      }
      case `signInOtp/${user._id}`: {
        data = { message: `Signed in successfully` };
        break;
      }
      case `forgetPassword/${user._id}`: {
        const temp = generatePassword();
        user.password = temp;
        data = {
          message: `Use this temporary password to update your password.`,
          temp,
        };
        break;
      }
    }
    await user.save();
    return data;
  }
}

export default new AuthService();
