import { IsString } from "class-validator";
import { Technology } from "./tutorial.dto";

export class CreateChapterDto {
  @IsString()
  chapter: string;

  @IsString()
  technology: Technology;
}
