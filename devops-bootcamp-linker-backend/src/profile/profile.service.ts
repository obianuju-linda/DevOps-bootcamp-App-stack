import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { JwtService } from "../common/jwt.service";

interface UpdateProfilePayload {
  userId: string;
  profileData: {
    imageUrl: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async getPublicProfile(userId: string) {
    if (!userId) {
      throw new BadRequestException("User ID required");
    }

    let profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!profile) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException("User not found");
      }
      profile = await this.prisma.userProfile.create({
        data: {
          userId,
          firstName: null,
          lastName: null,
          photoURL: null,
        },
        include: { user: true },
      });
    }

    const displayName =
      [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
      "Anonymous";

    return {
      displayName,
      email: profile.user.email,
      photoURL: profile.photoURL ?? undefined,
    };
  }

  async updateProfile(authHeader: string | undefined, payload: UpdateProfilePayload) {
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Unauthorized");
    }

    const token = authHeader.slice(7);
    const jwtPayload = await this.jwt.verify(token);
    if (!jwtPayload) {
      throw new UnauthorizedException("Unauthorized");
    }

    const { userId, profileData } = payload;
    if (!userId || !Array.isArray(profileData) || !profileData[0]) {
      throw new BadRequestException("Invalid request data");
    }

    if (jwtPayload.id !== userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    const p = profileData[0];

    await this.prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        firstName: p.firstName,
        lastName: p.lastName,
        photoURL: p.imageUrl,
      },
      update: {
        firstName: p.firstName,
        lastName: p.lastName,
        photoURL: p.imageUrl,
      },
    });

    return { success: true, message: "Profile updated successfully" };
  }
}

