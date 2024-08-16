import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: 'auth', name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  email_verified: boolean;

  @Column()
  salt: Buffer;

  @Column()
  hash: Buffer;
}
