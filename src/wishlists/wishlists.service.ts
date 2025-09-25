import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, In, Repository } from "typeorm";

import { User } from "../users/entities/user.entity";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { Wishlist } from "./entities/wishlist.entity";

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>
  ) {}

  async createWishlist(
    createWishlistDto: CreateWishlistDto,
    user: User
  ): Promise<Wishlist> {
    const wishes = await this.findMany({
      id: In(createWishlistDto.itemsId),
    });

    const wishlistInstance = this.wishlistsRepository.create({
      ...createWishlistDto,
      items: wishes,
      owner: user,
    });

    const newWishlist = await this.wishlistsRepository.save(wishlistInstance);

    return await this.findOne({
      relations: ["items", "owner"],
      where: {
        id: newWishlist.id,
      },
    });
  }

  async deleteOne(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.findOne({
      relations: ["items", "owner"],
      where: {
        id,
      },
    });

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException("Вы не можете удалить чужой вишлист");
    }

    await this.wishlistsRepository.remove(wishlist);

    return wishlist;
  }

  async findById(id: number): Promise<Wishlist> {
    const wishlist = await this.findOne({
      relations: ["items", "owner"],
      where: {
        id,
      },
    });

    if (!wishlist) {
      throw new NotFoundException("Вишлист не найден");
    }

    return wishlist;
  }

  async findMany(query?: object): Promise<Wishlist[]> {
    const queryOptions: FindManyOptions = {
      ...query,
      relations: ["items", "owner"],
    };
    const wishlists = await this.wishlistsRepository.find(queryOptions);

    if (wishlists.length == 0) {
      throw new NotFoundException("Вишлисты не найдены");
    }

    return wishlists;
  }

  async findOne(options: FindOneOptions<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne(options);

    if (!wishlist) {
      throw new NotFoundException("Вишлист не найден");
    }

    return wishlist;
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User
  ): Promise<Wishlist> {
    const wishlist = await this.findOne({
      where: {
        id,
      },
    });

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException("Вы не можете редактировать чужой вишлист");
    }

    await this.wishlistsRepository.update(id, updateWishlistDto);

    return wishlist;
  }
}
