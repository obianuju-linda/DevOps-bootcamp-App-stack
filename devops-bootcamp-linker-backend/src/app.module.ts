import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { LinksModule } from "./links/links.module";
import { UploadModule } from "./upload/upload.module";
import { PrismaService } from "./prisma";
import { JwtService } from "./common/jwt.service";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    LinksModule,
    UploadModule,
  ],
  controllers: [HealthController],
  providers: [PrismaService, JwtService],
  exports: [PrismaService, JwtService],
})
export class AppModule {}
