import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Technology } from "./dto/tutorial.dto";
import { TutorialsEntity } from "./tutorial.entity";

@Entity("chapters")
export class ChaptersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chapter: string;

  @Column()
  chapterOrder: number;

  @Column()
  technology: Technology;

  @OneToMany(() => TutorialsEntity, (tutorials) => tutorials.chapter)
  tutorials: TutorialsEntity[];
}
