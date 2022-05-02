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
import { CreateTutorialDto, TechnologyDto } from "./tutorial.dto";
import { NotesNav, TutorialService } from "./tutorial.service";

@Controller("tutorials")
export class TutorialController {
  constructor(private reportService: TutorialService) {}

  @Post()
  async createTutorial(@Body() createTutorialDto: CreateTutorialDto) {
    console.log("createTutorial");
    return this.reportService.createTutorial(createTutorialDto);
  }

  @Get("navigation/:technology")
  async findTutorialTechnologyNavigation(
    @Param("technology") technology: TechnologyDto["technology"]
  ): Promise<NotesNav[]> {
    return await this.reportService.findNav(technology);
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
}
