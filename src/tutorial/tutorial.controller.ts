import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { DeleteResult } from "typeorm";
import { CreateChapterDto } from "./dto/chapters.dto";
import { CreateTutorialDto, TechnologyDto } from "./dto/tutorial.dto";
import { TutorialsEntity } from "./tutorial.entity";
import { TableOfContentInterface, TutorialService } from "./tutorial.service";

@Controller("tutorials")
export class TutorialController {
  constructor(private reportService: TutorialService) {}

  @Post()
  async createTutorial(@Body() createTutorialDto: CreateTutorialDto) {
    // console.log("createTutorial");
    return this.reportService.createTutorial(createTutorialDto);
  }

  @Post("chapter")
  async createChapter(@Body() createChapterDto: CreateChapterDto) {
    return this.reportService.createChapter(createChapterDto);
  }

  @Get(":technology/table-of-contents")
  async findTutorialTechnologyNavigation(
    @Param("technology") technology: TechnologyDto["technology"]
  ) {
    // : Promise<TableOfContentInterface[]>
    return await this.reportService.tableOfContent(technology);
  }

  @Delete("/:tutorialId")
  async deleteTutorial(
    @Param("tutorialId", ParseIntPipe) tutorialId: number
  ): Promise<DeleteResult> {
    return await this.reportService.deleteTutorial(tutorialId);
  }

  @Get("/:technology/:chapter/:title")
  async findOneTutorial(
    @Param("technology") technology: TechnologyDto["technology"],
    @Param("chapter") chapter: string,
    @Param("title") title: string
  ) {
    return await this.reportService.findOneTutorial({
      technology,
      chapter,
      title,
    });
  }

  @Get(":id")
  async findOneTutorialById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<TutorialsEntity> {
    return await this.reportService.findOneTutorialById(id);
  }
}
