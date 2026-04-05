import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { JwtService } from "../common/jwt.service";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async register(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            firstName: null,
            lastName: null,
            photoURL: null,
          },
        },
      },
    });

    const token = await this.jwt.sign({ id: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, email: user.email },
    };
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = await this.jwt.sign({ id: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, email: user.email },
    };
  }
}

