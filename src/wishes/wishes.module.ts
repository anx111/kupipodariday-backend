import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";

import { Wish } from "./entities/wish.entity";
import { WishesController } from "./wishes.controller";
import { WishesService } from "./wishes.service";

@Module({
  controllers: [WishesController],
  exports: [WishesService],
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Wish])],
  providers: [WishesService],
})
export class WishesModule {}
