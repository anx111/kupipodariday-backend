import {
  Body,
  Controller,
  Delete,
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
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { Wish } from "./entities/wish.entity";
import { WishesService } from "./wishes.service";

@Controller("wishes")
@UseInterceptors(ExcludePasswordInterceptor)
export class WishesController {
  constructor(private wishesService: WishesService) {}

  //копировать желание
  @Post(":id/copy")
  @UseGuards(JwtStrategyGuard)
  async copyWishById(
    @Req() req: RequestWithUserField,
    @Param("id") id: number
  ): Promise<Wish> {
    return await this.wishesService.copyWish(id, req.user);
  }

  @Post("")
  @UseGuards(JwtStrategyGuard)
  async createWish(
    @Req() req: RequestWithUserField,
    @Body() createWishDto: CreateWishDto
  ): Promise<Wish> {
    return await this.wishesService.createWish(createWishDto, req.user);
  }

  //удалить желание
  @Delete(":wishId")
  @UseGuards(JwtStrategyGuard)
  async deleteWishById(
    @Param("wishId") wishId: number,
    @Req() req: RequestWithUserField
  ): Promise<Wish> {
    return await this.wishesService.removeOne(
      await this.wishesService.findOne({ where: { id: wishId } }),
      req.user
    );
  }

  //последние 40 опубликованных желаний
  @Get("last")
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.getLastWishes();
  }

  //топ 20 желаний по популярности
  @Get("top")
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.getTopWishes();
  }

  @Get(":id")
  @UseGuards(JwtStrategyGuard)
  async getWishById(@Param("id") id: number): Promise<Wish> {
    return await this.wishesService.findWishById(id);
  }

  @Patch(":id")
  @UseGuards(JwtStrategyGuard)
  async updateWishById(
    @Req() req: RequestWithUserField,
    @Param("id") id: number,
    @Body() updateWishDto: UpdateWishDto
  ): Promise<Wish> {
    return await this.wishesService.updateOne(id, updateWishDto, req.user);
  }
}
