import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

class AuthDto {
  email!: string;
  password!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() body: AuthDto) {
    const result = await this.authService.register(body.email, body.password);
    return {
      success: true,
      message: "Account created successfully",
      ...result,
    };
  }

  @Post("login")
  async login(@Body() body: AuthDto) {
    const result = await this.authService.login(body.email, body.password);
    return {
      success: true,
      message: "Login successful",
      ...result,
    };
  }
}

