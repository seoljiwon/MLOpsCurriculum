import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  age: number;
}
