import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { JwtStrategyGuard } from "../auth/guards/jwt.guard";
import { ExcludePasswordInterceptor } from "../interceptors/exclude-password-interceptor";
import { RequestWithUserField } from "../shared/request-with-user";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { Offer } from "./entities/offer.entity";
import { OffersService } from "./offers.service";

@Controller("offers")
@UseGuards(JwtStrategyGuard)
@UseInterceptors(ExcludePasswordInterceptor)
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Get("/")
  async getAllOffers(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(":id")
  async getOfferById(@Param("id") id: number): Promise<Offer> {
    return this.offersService.findOfferById(id);
  }

  @Post("/")
  async postOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: RequestWithUserField
  ): Promise<Offer> {
    return await this.offersService.createOffer(createOfferDto, req.user.id);
  }
}
