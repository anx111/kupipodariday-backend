import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { JwtStrategyGuard } from "../auth/guards/jwt.guard";
import { ExcludePasswordInterceptor } from "../interceptors/exclude-password-interceptor";
import { RequestWithUserField } from "../shared/request-with-user";
import { Wish } from "../wishes/entities/wish.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  //найти юзеров согласно query
  @Post("find")
  @UseGuards(JwtStrategyGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  async getAll(@Body("query") query: string): Promise<User[]> {
    return await this.usersService.findMany(query);
  }

  //получить мой профиль
  @Get("me")
  @UseGuards(JwtStrategyGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  async getMyProfile(@Req() req: RequestWithUserField): Promise<User> {
    return await this.usersService.findById(req.user.id);
  }

  //получить свои желания
  @Get("me/wishes")
  @UseGuards(JwtStrategyGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  async getMyWishes(@Req() req: RequestWithUserField): Promise<Wish[]> {
    return await this.usersService.findWishes({
      id: req.user.id,
    });
  }

  //получить профиль юзера по никнейму
  @Get(":username")
  @UseGuards(JwtStrategyGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  async getUserProfile(@Param("username") username: string): Promise<User> {
    return await this.usersService.findByUsername(username);
  }

  //получить желания юзера
  @Get(":username/wishes")
  @UseGuards(JwtStrategyGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  async getWishesByParam(@Param("username") username: string): Promise<Wish[]> {
    return await this.usersService.findWishes({
      username: username,
    });
  }

  //обновить свой профиль
  @Patch("me")
  @UseGuards(JwtStrategyGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  async updateUser(
    @Req() req: RequestWithUserField,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return await this.usersService.updateOne(req.user.id, updateUserDto);
  }
}
