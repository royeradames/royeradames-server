import { IsString, IsIn } from "class-validator";

export type Technology =
  | "angular"
  | "react"
  | "nestjs"
  | "typescript"
  | "nodejs"
  | "elasticsearch"
  | "nextjs";

export class TechnologyDto {
  @IsIn(["angular", "react", "typescript", "nodejs", "elasticsearch", "nextjs"])
  technology: Technology;
}

export class CreateTutorialDto extends TechnologyDto {
  @IsString()
  chapter: string;

  @IsString()
  section: string;

  @IsString()
  domainPath: string;

  @IsString()
  markdown: string;

  @IsString()
  aPath: string;

  @IsString()
  bPath: string;
}
