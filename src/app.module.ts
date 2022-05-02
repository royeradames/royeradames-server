import { Module } from "@nestjs/common";
import { TutorialModule } from "./tutorial/tutorial.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, TutorialModule],
})
export class AppModule {}
