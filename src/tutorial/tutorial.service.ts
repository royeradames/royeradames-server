import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { CreateTutorialDto, Technology } from "./tutorial.dto";
import { tutorial } from "./tutorial.entity";

export interface NotesNav {
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
  async findOneTutorialById(id: number): Promise<tutorial> {
    const tutorial = await this.tutorialRepo.findOne(id);
    if (!tutorial) throw new NotFoundException("Tutorial not found");
    return tutorial;
  }
  constructor(
    @InjectRepository(tutorial) private tutorialRepo: Repository<tutorial>
  ) {}

  findOneTutorial({ technology, chapter, title }: FindOneTutorial) {
    try {
      return this.tutorialRepo.findOneOrFail({
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

  async findNav(technology: Technology): Promise<NotesNav[]> {
    let previousChapter = "";

    const notes = await this.tutorialRepo.find({ technology });
    const notesIsEmpty = notes.length === 0;
    if (notesIsEmpty)
      throw new NotFoundException(`${technology} doesn't have any tutorials`);

    return notes.map((note) => {
      const isNewChapter = note.chapter != previousChapter;

      const nav: NotesNav = {
        id: note.id,
        domainPath: "/" + note.domainPath,
        section: note.section,
        chapter: isNewChapter ? note.chapter : undefined,
      };

      if (isNewChapter) previousChapter = note.chapter;
      return nav;
    });
  }

  createTutorial(createTutorialDto: CreateTutorialDto): Promise<tutorial> {
    const tutorial = this.tutorialRepo.create(
      this.createTutorialToLowercase(createTutorialDto)
    );
    return this.tutorialRepo.save(tutorial);
  }

  deleteTutorial(id: number): Promise<DeleteResult> {
    return this.tutorialRepo.delete(id);
  }

  private createTutorialToLowercase(object: CreateTutorialDto) {
    return {
      ...object,
      chapter: object.chapter.toLowerCase(),
      section: object.section.toLowerCase(),
      domainPath: object.domainPath.toLowerCase(),
    };
  }
}
