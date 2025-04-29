import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './configs/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(environment.APP_PORT);
}

bootstrap();
