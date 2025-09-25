import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";

import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  //генерируем accesToken согласно id и username
  async generateAccessToken(user: User) {
    const { id, username } = user;

    return {
      access_token: await this.jwtService.signAsync({
        sub: id,
        username: username,
      }),
    };
  }

  //проверка учетных данных
  async validateCredentials(username: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new BadRequestException("Не найден юзер с данным логином");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Ошибка авторизации, неверные данные");
    }

    return user;
  }
}
