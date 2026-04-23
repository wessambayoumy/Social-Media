import mongoose, { Model, model, Schema } from "mongoose";
import { IUser } from "@interfaces";
import { genderEnum, providerEnum, roleEnum } from "@enums";

const userSchema = new Schema<IUser>(
  {
    fName: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 20,
    },

    lName: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      select: false,
      required: [
        function (): boolean {
          return this.provider === providerEnum.system;
        },
        "Please enter a strong password",
      ],
    },

    phoneNumber: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
    },

    gender: {
      type: Number,
      enum: Object.values(genderEnum).splice(2,),
      default: genderEnum.male,
    },

    provider: {
      type: Number,
      enum: Object.values(providerEnum).splice(2,),
      default: providerEnum.system,
    },

    role: {
      type: Number,
      enum: Object.values(roleEnum).splice(2,),
      default: roleEnum.user,
    },

    views: {
      type: Number,
      default: 0,
    },

    signOutDate: Date,

    profilePicture: String,

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    strict: true,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("userName")
  .set(function (value: string) {
    const [fName, lName] = value.split(" ");
    if (fName && lName) {
      this.fName = fName;
      this.lName = lName;
    }
  })
  .get(function () {
    return `${this.fName} ${this.lName}`;
  });

const userModel: Model<IUser> =
  mongoose.models["users"] || model("users", userSchema);

export default userModel;
