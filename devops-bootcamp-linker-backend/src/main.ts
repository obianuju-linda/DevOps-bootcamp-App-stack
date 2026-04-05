import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN?.split(",") || [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Backend running on http://localhost:${port}/api`, "Bootstrap");
}

bootstrap();

