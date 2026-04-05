import { Body, Controller, Get, Headers, Param, Patch } from "@nestjs/common";
import { ProfileService } from "./profile.service";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(":userId")
  async getPublic(@Param("userId") userId: string) {
    const profileData = await this.profileService.getPublicProfile(userId);
    return { success: true, profileData };
  }

  @Patch()
  async update(
    @Headers("authorization") authHeader: string | undefined,
    @Body()
    body: {
      userId: string;
      profileData: {
        imageUrl: string;
        firstName: string;
        lastName: string;
        email: string;
      }[];
    }
  ) {
    return this.profileService.updateProfile(authHeader, body);
  }
}

