import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import { DatabaseError } from "pg";
import { FindOneOptions, ILike, QueryFailedError, Repository } from "typeorm";

import { Wish } from "../wishes/entities/wish.entity";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  hash_salt;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService
  ) {
    this.hash_salt = this.configService.get<string>("hash.salt") || 10;
  }

  //найти пользователя по id
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  //найти пользователя по никнейму
  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        username: ILike(username),
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  //найти пользователей согласно query
  async findMany(query?: null | string): Promise<User[]> {
    const condition = query
      ? {
          where: [
            {
              username: ILike(query),
            },
            {
              email: ILike(query),
            },
          ],
        }
      : {};
    const allUsers = await this.usersRepository.find(condition);

    if (allUsers.length == 0) {
      throw new NotFoundException();
    }

    return allUsers;
  }

  //найти пользователя по query
  async findOne(query: FindOneOptions<User>): Promise<User> {
    const user = await this.usersRepository.findOne(query);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  //найти желания пользователя по id или username через join с wishes
  async findWishes(query: { id?: number; username?: string }): Promise<Wish[]> {
    const userWithWishes = await this.findOne({
      relations: ["wishes"],
      where: query,
    });

    if (!userWithWishes) {
      throw new NotFoundException();
    }

    return userWithWishes.wishes;
  }

  //регистрация пользователя
  async signupUser(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    try {
      const hashedPassword = await bcrypt.hash(password, this.hash_salt);
      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return await this.usersRepository.save(user);
    } catch (error: unknown) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as DatabaseError).code === "23505"
      ) {
        throw new ConflictException(
          "Данный email или никнейм уже зарегистрирован"
        );
      }
      throw error;
    }
  }

  //обновить данные профиля пользователя
  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, password, username } = updateUserDto;

    const user = await this.findById(id);

    //проверяем username
    if (username && username !== user.username) {
      const userByUserName = await this.usersRepository.findOne({
        where: {
          username: updateUserDto.username,
        },
      });
      if (userByUserName && userByUserName.id !== id) {
        throw new ConflictException("Данный username уже занят");
      }
    }

    //проверяем email
    if (email && email !== user.email) {
      const userByEmail = await this.usersRepository.findOne({
        where: {
          email: updateUserDto.email,
        },
      });
      if (userByEmail && userByEmail.id !== id) {
        throw new ConflictException("Данный email уже занят");
      }
    }

    //проверяем пароль
    if (password) {
      updateUserDto.password = await bcrypt.hash(password, this.hash_salt);
    }

    //сохраняем изменения
    await this.usersRepository.update(id, updateUserDto);

    //возвращаем пользователя с измененными данными
    return await this.findById(id);
  }
}
