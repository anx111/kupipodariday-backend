import { IsNumber, IsString, IsUrl, Length } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { Offer } from "../../offers/entities/offer.entity";
import { BaseEntity } from "../../shared/base.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Wish extends BaseEntity {
  @Column({
    default: 0,
    type: "int",
  })
  @IsNumber()
  copied: number;

  @Column({
    length: 1024,
  })
  @IsString()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({
    scale: 2,
    type: "decimal",
  })
  @IsNumber()
  price: number;

  @Column({
    default: 0,
    scale: 2,
    type: "decimal",
  })
  @IsNumber()
  raised: number;
}
