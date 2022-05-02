import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* allow validation pipe through the app */
  app.useGlobalPipes(
    /* activates class-validator decorators */
    new ValidationPipe({
      /* remove additional properties that are not listed in the dto */
      whitelist: true,
    })
  );
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
