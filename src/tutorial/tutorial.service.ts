import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { ChaptersEntity } from "./chapters.entity";
import { CreateChapterDto } from "./dto/chapters.dto";
import { CreateTutorialDto, Technology } from "./dto/tutorial.dto";
import { TutorialsEntity } from "./tutorial.entity";

export interface TableOfContentInterface {
  id: number;
  domainPath: string;
  section: string;
  chapter?: string;
}

interface FindOneTutorial {
  technology: string;
  chapter: string;
  title: string;
}

@Injectable()
export class TutorialService {
  async createChapter(
    createChapterDto: CreateChapterDto
  ): Promise<ChaptersEntity> {
    const { chapter, technology } = createChapterDto;

    const lastChapterEntity = await this.chaptersRepo.findOne({
      where: { technology },
      order: { chapterOrder: "DESC" },
      select: ["chapterOrder"],
    });

    const newChapter = this.chaptersRepo.create({
      chapter,
      technology,
      chapterOrder: (lastChapterEntity?.chapterOrder || 0) + 1,
    });

    return this.chaptersRepo.save(newChapter);
  }
  async findOneTutorialById(id: number): Promise<TutorialsEntity> {
    const tutorial = await this.tutorialsRepo.findOne(id);
    if (!tutorial) throw new NotFoundException("Tutorial not found");
    return tutorial;
  }
  constructor(
    @InjectRepository(TutorialsEntity)
    private tutorialsRepo: Repository<TutorialsEntity>,
    @InjectRepository(ChaptersEntity)
    private chaptersRepo: Repository<ChaptersEntity>
  ) {}

  findOneTutorial({ technology, chapter, title }: FindOneTutorial) {
    try {
      return this.tutorialsRepo.findOneOrFail({
        where: {
          technology,
          chapter,
          title,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        `${technology}/${chapter}/${title} not found`
      );
    }
  }

  async tableOfContent(technology: Technology) {
    // : Promise<TableOfContentInterface[]>xx
    let previousChapter = "";

    const notes = await this.tutorialsRepo.find({
      where: { technology },
      order: {
        chapter: "ASC",
      },
    });
    const notesIsEmpty = notes.length === 0;
    if (notesIsEmpty)
      throw new NotFoundException(`${technology} doesn't have any tutorials`);

    return notes;
    // return notes.map((note) => {
    //   const isNewChapter = note.chapter != previousChapter;

    //   const nav: TableOfContentInterface = {
    //     id: note.id,
    //     domainPath: "/" + note.domainPath,
    //     section: note.section,
    //     chapter: isNewChapter ? note.chapter : undefined,
    //   };

    //   if (isNewChapter) previousChapter = note.chapter;
    //   return nav;
    // });
  }

  async createTutorial(
    createTutorialDto: CreateTutorialDto
  ): Promise<TutorialsEntity> {
    const {
      section,
      aPath,
      bPath,
      chapter,
      domainPath,
      markdown,
      sectionOrder,
      technology,
    } = this.createTutorialToLowercase(createTutorialDto);

    const chapterId = await this.findChapterId(chapter, technology);

    const tutorial = this.tutorialsRepo.create({
      section,
      aPath,
      bPath,
      domainPath,
      markdown,
      sectionOrder,
      technology,
      chapterId,
    });
    return this.tutorialsRepo.save(tutorial);
  }

  private async findChapterId(chapter: string, technology: Technology) {
    const chapterEntity = await this.chaptersRepo.findOne({
      where: chapter,
      select: ["id"],
    });

    if (!chapterEntity) {
      const lastChapterEntity = await this.chaptersRepo.findOne({
        where: { technology },
        order: { chapterOrder: "DESC" },
        select: ["chapterOrder"],
      });

      const newChapter = this.chaptersRepo.create({
        chapter,
        technology,
        chapterOrder: (lastChapterEntity?.chapterOrder || 0) + 1,
      });

      const newChapterEntity = await this.chaptersRepo.save(newChapter);
      return newChapterEntity.id;
    }

    return chapterEntity.id;
  }

  deleteTutorial(id: number): Promise<DeleteResult> {
    return this.tutorialsRepo.delete(id);
  }

  private createTutorialToLowercase(
    object: CreateTutorialDto
  ): CreateTutorialDto {
    return {
      ...object,
      chapter: object.chapter.toLowerCase(),
      section: object.section.toLowerCase(),
      domainPath: object.domainPath.toLowerCase(),
    };
  }
}
