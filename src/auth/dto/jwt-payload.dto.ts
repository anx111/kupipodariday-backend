import {
    IsNotEmpty,
    IsNumber
} from 'class-validator';

export class JWTPayloadDto {
    @IsNotEmpty()
    @IsNumber()
    sub: number
}