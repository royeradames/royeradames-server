import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChaptersEntity } from "./chapters.entity";
import { TutorialController } from "./tutorial.controller";
import { TutorialsEntity } from "./tutorial.entity";
import { TutorialService } from "./tutorial.service";

@Module({
  imports: [TypeOrmModule.forFeature([TutorialsEntity, ChaptersEntity])],
  controllers: [TutorialController],
  providers: [TutorialService],
})
export class TutorialModule {}
