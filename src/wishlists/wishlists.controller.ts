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
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { Wishlist } from "./entities/wishlist.entity";
import { WishlistsService } from "./wishlists.service";

@Controller("wishlistlists")
@UseGuards(JwtStrategyGuard)
@UseInterceptors(ExcludePasswordInterceptor)
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Post("/")
  async createWishlist(
    @Req() req: RequestWithUserField,
    @Body() createWishlistDto: CreateWishlistDto
  ): Promise<Wishlist> {
    return this.wishlistsService.createWishlist(createWishlistDto, req.user);
  }

  @Delete(":id")
  async deleteWishlistById(
    @Req() req: RequestWithUserField,
    @Param("id") id: number
  ): Promise<Wishlist> {
    return await this.wishlistsService.deleteOne(id, req.user);
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<Wishlist> {
    return await this.wishlistsService.findById(id);
  }

  @Get("/")
  async getAllWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsService.findMany();
  }

  @Patch(":id")
  async updateWishlistById(
    @Req() req: RequestWithUserField,
    @Param("id") id: number,
    @Body() updateWishlistDto: UpdateWishlistDto
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateOne(
      id,
      updateWishlistDto,
      req.user
    );
  }
}
