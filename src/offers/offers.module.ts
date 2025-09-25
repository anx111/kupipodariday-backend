import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersModule } from "../users/users.module";
import { WishesModule } from "../wishes/wishes.module";
import { Offer } from "./entities/offer.entity";
import { OffersController } from "./offers.controller";
import { OffersService } from "./offers.service";

@Module({
  controllers: [OffersController],
  exports: [OffersService],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => WishesModule),
    TypeOrmModule.forFeature([Offer]),
  ],
  providers: [OffersService],
})
export class OffersModule {}
