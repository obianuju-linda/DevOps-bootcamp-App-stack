import { Module } from "@nestjs/common";
import { LinksController } from "./links.controller";
import { LinksService } from "./links.service";
import { PrismaService } from "../prisma";
import { JwtService } from "../common/jwt.service";

@Module({
  controllers: [LinksController],
  providers: [LinksService, PrismaService, JwtService],
})
export class LinksModule {}

