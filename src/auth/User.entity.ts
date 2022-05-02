import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /* only allow unic usernames 
  you need to handle the error if the username is not unique when typeorm is trying to save the user
  */
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
