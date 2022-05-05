import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChaptersEntity } from "./chapters.entity";
import { Technology } from "./dto/tutorial.dto";

@Entity("tutorials")
export class TutorialsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  section: string;

  @Column()
  sectionOrder: number;

  @Column()
  domainPath: string;

  @Column()
  markdown: string;

  @Column()
  aPath: string;

  @Column({ nullable: true })
  bPath?: string;

  @Column()
  technology: Technology;

  @Column()
  chapterId: number;

  @ManyToOne(() => ChaptersEntity, (chapter) => chapter.tutorials)
  chapter: ChaptersEntity;
}
