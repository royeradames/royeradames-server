import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotFoundError } from "rxjs";
import { DeleteResult, Repository } from "typeorm";
import { CreateTutorialDto, Technology } from "./tutorial.dto";
import { tutorial } from "./tutorial.entity";

export interface NotesNav {
  link: string;
  name: string;
  chapter?: string;
  chapterNumber?: number;
}

interface FindOneTutorial {
  technology: string;
  chapter: string;
  title: string;
}

@Injectable()
export class TutorialService {
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
      throw new NotFoundError(`${technology}/${chapter}/${title} not found`);
    }
  }

  async findTutorials(technology: Technology): Promise<NotesNav[]> {
    let previousChapter = "";
    let chapterNumber = 1;
    const alphabetStart = 64;
    const alphabetEnd = 90;
    let utfLetter = alphabetStart;
    const decoder = new TextDecoder();

    const notes = await this.tutorialRepo.find({ technology });

    return notes.map((note) => {
      const isNewChapter = note.chapter != previousChapter;
      const resetLetter = utfLetter === alphabetEnd || isNewChapter;
      if (resetLetter) utfLetter = alphabetStart;

      const alphabetLetter = decoder.decode(new Uint8Array([++utfLetter]));

      const nav: NotesNav = {
        link: "/" + note.domainPath,
        name: `${alphabetLetter}. ${note.section}`,
        chapter: isNewChapter ? note.chapter : undefined,
        chapterNumber: isNewChapter ? chapterNumber : undefined,
      };

      if (isNewChapter) {
        previousChapter = note.chapter;
        chapterNumber++;
      }

      return nav;
    });
  }

  createTutorial(createTutorialDto: CreateTutorialDto) {
    const tutorial = this.tutorialRepo.create(createTutorialDto);
    return this.tutorialRepo.save(tutorial);
  }

  deleteTutorial(id: number): Promise<DeleteResult> {
    return this.tutorialRepo.delete(id);
  }
}
