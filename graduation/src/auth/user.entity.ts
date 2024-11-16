import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  adress: string;

  @Column()
  adress_detail: string;

  @Column({ type: 'int', default: 3 })  
  coins: number;

  @Column({type: 'tinyint', default: 0 })  
  admin: number;
}
