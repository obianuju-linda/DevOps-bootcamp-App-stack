import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { PrismaService } from "../prisma";
import { JwtService } from "../common/jwt.service";

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, JwtService],
})
export class ProfileModule {}

