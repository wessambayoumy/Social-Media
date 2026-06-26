import mongoose, {
  HydratedDocument,
  Model,
  model,
  Schema,
  Types,
} from "mongoose";
import { IUser } from "@interfaces";
import { genderEnum, providerEnum, roleEnum } from "@enums";
import { BadRequestError, ConflictError } from "@response";
import { EncryptionService, HashService } from "@security";

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
      enum: Object.values(genderEnum).splice(
        Object.values(genderEnum).length / 2,
      ),
      default: genderEnum.male,
    },

    provider: {
      type: Number,
      enum: Object.values(providerEnum).splice(
        Object.values(providerEnum).length / 2,
      ),
      default: providerEnum.system,
    },

    role: {
      type: Number,
      enum: Object.values(roleEnum).splice(Object.values(roleEnum).length / 2),
      default: roleEnum.user,
    },

    views: {
      type: Number,
      default: 0,
    },

    signOutAt: Date,
    deletedAt: Date,
    restoredAt: Date,

    profilePicture: String,

    coverPhotos: [String],

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    strict: true,
    strictQuery: true,
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

userSchema.pre("validate", function () {
  if (this.password && this.provider !== providerEnum.system)
    throw new ConflictError(
      "Password should not be provided for non-system providers",
    );
});

userSchema.pre("save", async function () {
  if (this.password && this.isModified("password"))
    this.password = await HashService.hash(this.password);

  if (this.phoneNumber && this.isModified("phoneNumber"))
    this.phoneNumber = EncryptionService.encrypt(this.phoneNumber);
});

userSchema.pre(["findOne", "find"], function () {
  const query = this.getQuery();
  if (query["paranoid"])
    this.setQuery({ deletedAt: { $exists: false }, ...query });
  else this.setQuery({ ...query });
});

userSchema.pre(["updateOne", "findOneAndUpdate", "updateMany"], function () {
  const query = this.getQuery();
  const update = this.getUpdate() as HydratedDocument<IUser>;

  if (update.$set.length <= 1) throw new BadRequestError("No fields to update");
  if (update.deletedAt) {
    this.setUpdate({ $unset: { restoredAt: 1 }, ...update });
  }
  if (update.restoredAt) {
    this.setUpdate({ $unset: { deletedAt: 1 }, ...update });
    this.setQuery({ deletedAt: { $exists: true }, ...this.getQuery() });
  }
  if (query["paranoid"])
    this.setQuery({ deletedAt: { $exists: false }, ...query });
  else this.setQuery({ ...query });
});

userSchema.pre(["deleteOne", "findOneAndDelete"], function () {
  const query = this.getQuery();
  if (query["force"]) this.setQuery({ ...query });
  else this.setQuery({ deletedAt: { $exists: true }, ...query });
});

const userModel: Model<IUser> =
  mongoose.models["users"] || model("users", userSchema);

export default userModel;
