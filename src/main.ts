import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  const configService: ConfigService = app.get(ConfigService);

  app.enableCors();

  // Prisma shutdown
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  // Set the versioning type
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Set the validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Start the server
  await app.listen(configService.get('port') as number);
}
bootstrap();
