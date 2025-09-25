import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class CreateOfferDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsBoolean()
  @IsNotEmpty()
  hidden: boolean;

  @IsNotEmpty()
  @IsNumber()
  itemId: number;
}
