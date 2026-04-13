import { authDTO } from "@auth";
import { IUser } from "@interfaces";
import { BadRequestError, ConflictError, UnAuthorizedError } from "@response";
import { EncryptionService, HashService, JwtService } from "@security";
import { env } from "@config";
import { UserRepository } from "@repository";

class AuthService {
  private readonly UserRepository: UserRepository;
  private readonly jwtService = new JwtService();
  private readonly encryptionService = new EncryptionService();
  private readonly hashService = new HashService();

  constructor() {
    this.UserRepository = new UserRepository();
    this.jwtService = new JwtService();
    this.encryptionService = new EncryptionService();
    this.hashService = new HashService();
  }
  signUp = async (body: authDTO.SignUpDTO): Promise<IUser> => {
    const { userName, email, password, phoneNumber, profilePicture, age } =
      body;

    if (await this.UserRepository.findOne({ filter: { email } }))
      throw new ConflictError("User already exists");

    const user = await this.UserRepository.create({
      data: {
        userName,
        email,
        ...(password && { password: this.hashService.hash(password) }),
        ...(phoneNumber && {
          phoneNumber: this.encryptionService.encrypt(phoneNumber),
        }),
        ...(profilePicture && { profilePicture }),
        ...(age && { age }),
      },
    });

    if (!user) throw new BadRequestError("Failed to create user");

    return user;
  };

  signIn = async (body: authDTO.SignInDTO) => {
    const { email, password } = body;
    const user = await this.UserRepository.findOne({
      filter: { email },
      options: { select: true },
    });

    if (!user || !this.hashService.compareHash(password, user.password!))
      throw new UnAuthorizedError("Invalid email or password");

    const token = this.jwtService.signToken(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      user.role?.toString() === "admin"
        ? env["jwtAdminSecret"]
        : env["jwtUserSecret"],
    );

    return { user, token };
  };

  signOut = async () => {
    console.log();
  };
}

export default AuthService;
