import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from "class-validator";

export class CreateWishDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 300)
  description: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 40)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
