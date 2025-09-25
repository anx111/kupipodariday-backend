import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Wishlist } from "./entities/wishlist.entity";
import { WishlistsController } from "./wishlists.controller";
import { WishlistsService } from "./wishlists.service";
@Module({
  controllers: [WishlistsController],
  exports: [WishlistsService],
  imports: [TypeOrmModule.forFeature([Wishlist])],
  providers: [WishlistsService],
})
export class WishlistsModule {}
