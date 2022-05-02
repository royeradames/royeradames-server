import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TutorialController } from "./tutorial.controller";
import { tutorial } from "./tutorial.entity";
import { TutorialService } from "./tutorial.service";

@Module({
  imports: [TypeOrmModule.forFeature([tutorial])],
  controllers: [TutorialController],
  providers: [TutorialService],
})
export class TutorialModule {}
