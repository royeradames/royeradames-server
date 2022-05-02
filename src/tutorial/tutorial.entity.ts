import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Technology } from "./tutorial.dto";

@Entity("tutorial")
export class tutorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chapter: string;

  @Column()
  section: string;

  @Column()
  domainPath: string;

  @Column()
  markdown: string;

  @Column()
  editPath: string;

  @Column()
  aPath: string;

  @Column()
  bPath: string;

  @Column()
  technology: Technology;
}
