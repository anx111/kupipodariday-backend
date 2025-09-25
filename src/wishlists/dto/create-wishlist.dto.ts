import { IsArray, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];

  @IsNotEmpty()
  @IsString()
  name: string;
}
