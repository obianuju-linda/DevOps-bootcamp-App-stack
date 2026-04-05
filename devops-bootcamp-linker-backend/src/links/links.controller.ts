import { Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
import { LinksService } from "./links.service";

@Controller("links")
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get(":userId")
  async getPublic(@Param("userId") userId: string) {
    const links = await this.linksService.getPublicLinks(userId);
    return { success: true, links };
  }

  @Post()
  async save(
    @Headers("authorization") authHeader: string | undefined,
    @Body()
    body: {
      userId: string;
      links: { platform: string; url: string }[];
    }
  ) {
    return this.linksService.saveLinks(authHeader, body);
  }
}

