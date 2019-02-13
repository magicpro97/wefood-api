import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const hostDomain = AppModule.isDev
    ? `${AppModule.host}:${AppModule.port}`
    : AppModule.host;
  await app.listen(AppModule.port);
}
bootstrap();
