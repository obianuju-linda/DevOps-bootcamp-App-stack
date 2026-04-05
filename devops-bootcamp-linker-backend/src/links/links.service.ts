import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { JwtService } from "../common/jwt.service";

interface SaveLinksPayload {
  userId: string;
  links: { platform: string; url: string }[];
}

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async getPublicLinks(userId: string) {
    if (!userId) {
      throw new BadRequestException("User ID required");
    }

    const links = await this.prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return links;
  }

  async saveLinks(authHeader: string | undefined, payload: SaveLinksPayload) {
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Unauthorized");
    }
    const token = authHeader.slice(7);
    const jwtPayload = await this.jwt.verify(token);
    if (!jwtPayload) {
      throw new UnauthorizedException("Unauthorized");
    }

    const { userId, links } = payload;
    if (!userId || !Array.isArray(links)) {
      throw new BadRequestException("Invalid request data");
    }
    if (jwtPayload.id !== userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    await this.prisma.link.deleteMany({ where: { userId } });
    if (links.length > 0) {
      await this.prisma.link.createMany({
        data: links.map((l) => ({
          userId,
          platform: l.platform,
          url: l.url,
        })),
      });
    }

    return { success: true, message: "Links saved successfully" };
  }
}

