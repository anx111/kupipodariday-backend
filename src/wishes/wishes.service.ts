import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { User } from "../users/entities/user.entity";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { Wish } from "./entities/wish.entity";

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private usersService: UsersService
  ) {}

  async copyWish(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne({
      where: {
        id,
      },
    });

    const isCopiedWish = await this.wishesRepository.findOne({
      where: {
        link: wish.link,
        name: wish.name,
        owner: {
          id: user.id,
        },
      },
    });
    if (isCopiedWish) {
      throw new BadRequestException("Подарок уже был скопирован");
    }

    const copiedWish: CreateWishDto = {
      description: wish.description,
      image: wish.image,
      link: wish.link,
      name: wish.name,
      price: wish.price,
    };

    const wishCopiedDto: UpdateWishDto = {
      copied: wish.copied++,
    };
    await this.wishesRepository.update(id, wishCopiedDto);

    return await this.createWish(copiedWish, user);
  }

  async createWish(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });

    const savedWish = await this.wishesRepository.save(wish);

    return this.findOne({
      relations: ["owner"],
      where: {
        id: savedWish.id,
      },
    });
  }

  async findAll(options: FindOptionsWhere<Wish>): Promise<Wish[]> {
    return await this.wishesRepository.findBy(options);
  }

  async findOne(options: FindOneOptions<Wish>): Promise<Wish> {
    const wish = await this.wishesRepository.findOne(options);

    if (!wish) {
      throw new NotFoundException();
    }

    return wish;
  }

  async findWishById(id: number): Promise<Wish> {
    return await this.findOne({
      relations: ["owner", "offers"],
      where: {
        id,
      },
    });
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: {
        createdAt: "asc",
      },
      relations: {
        offers: false,
        owner: true,
      },
      take: 40,
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: {
        copied: "desc",
      },
      relations: {
        offers: false,
        owner: true,
      },
      take: 20,
    });
  }

  async removeOne(wish: Wish, user?: User): Promise<Wish> {
    await this.wishesRepository.remove(wish);

    if (user && wish.owner.id !== user.id) {
      throw new ForbiddenException("Вы не можете удалить чужой подарок");
    }

    return wish;
  }

  async updateOne(
    wishId: number,
    updateWishDto: UpdateWishDto,
    user: User
  ): Promise<Wish> {
    const wish = await this.findOne({
      where: {
        id: wishId,
      },
    });

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException("Вы не можете редактировать чужой подарок");
    }
    if (wish.raised > 0) {
      throw new ForbiddenException(
        "Сумма сбора не может быть изменена, так как кто-то уже скинулся на подарок"
      );
    }

    await this.wishesRepository.update(wishId, updateWishDto);
    return await this.findOne({
      where: {
        id: wishId,
      },
    });
  }
}
