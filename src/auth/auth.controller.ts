import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { ExcludePasswordInterceptor } from "../interceptors/exclude-password-interceptor";
import { RequestWithUserField } from "../shared/request-with-user";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { LocalStrategyGuard } from "./guards/local.guard";

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  //вход
  @Post("signin")
  @UseGuards(LocalStrategyGuard)
  async signin(@Req() req: RequestWithUserField) {
    return await this.authService.generateAccessToken(req.user);
  }

  //регистрация
  @Post("signup")
  @UseInterceptors(ExcludePasswordInterceptor)
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.signupUser(createUserDto);
  }
}
