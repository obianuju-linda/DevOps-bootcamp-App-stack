import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller("upload-image")
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      return { success: false, message: "No file provided" };
    }

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (err, res) => (err ? reject(err) : resolve(res!)))
        .end(file.buffer);
    });

    return { success: true, url: result.secure_url };
  }
}

