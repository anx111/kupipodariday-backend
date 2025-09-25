import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UsersService } from "../users/users.service";
import { UpdateWishDto } from "src/wishes/dto/update-wish.dto";
import { CreateOfferDto } from "./dto/create-offer.dto";

import { WishesService } from "../wishes/wishes.service";
import { Offer } from "./entities/offer.entity";

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
    private usersService: UsersService
  ) {}

  async createOffer(
    createOfferDto: CreateOfferDto,
    userId: number
  ): Promise<Offer> {
    const { amount, itemId: wishId } = createOfferDto;

    const user = await this.usersService.findOne({
      relations: ["offers"],
      where: {
        id: userId,
      },
    });

    const wish = await this.wishesService.findOne({
      relations: ["owner", "offers"],
      where: {
        id: wishId,
      },
    });

    const updateWishData: UpdateWishDto = {
      raised: amount + wish.raised,
    };

    if (amount + wish.raised > wish.price) {
      throw new BadRequestException(
        "Суммарный объем собранных средств не может превышать стоимости подарка"
      );
    }
    if (wish.raised === wish.price) {
      throw new BadRequestException("Деньги на этот подарок уже собраны");
    }
    if (wish.owner.id === user.id) {
      throw new BadRequestException("Нельзя скидываться на свой подарок");
    }

    await this.wishesService.updateOne(wish.id, updateWishData, user);

    return await this.offersRepository.save({
      ...createOfferDto,
      item: wish,
      user: user,
    });
  }

  async findAll(): Promise<Offer[]> {
    const allOffers = await this.offersRepository.find({
      relations: ["item", "user"],
    });

    if (allOffers.length == 0) {
      throw new NotFoundException();
    }

    return allOffers;
  }

  async findOfferById(offerId: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      relations: ["item", "user"],
      where: {
        id: offerId,
      },
    });

    if (!offer) {
      throw new NotFoundException();
    }

    return offer;
  }

  async findOne(offerId: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: {
        id: offerId,
      },
    });

    if (!offer) {
      throw new NotFoundException();
    }

    return offer;
  }
}
