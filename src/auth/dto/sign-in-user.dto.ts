import {
	IsNotEmpty,
	IsString,
	Length,
} from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	password: string;

	@IsNotEmpty()
	@IsString()
	@Length(2, 20)
	username: string;
}