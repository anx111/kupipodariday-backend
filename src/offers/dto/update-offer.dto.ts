import { PartialType } from "@nestjs/mapped-types";
import { IsOptional } from "class-validator";

import { CreateOfferDto } from "./create-offer.dto";

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  @IsOptional()
  amount: number;

  @IsOptional()
  hidden: boolean;

  @IsOptional()
  itemId: number;
}
