// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- 1. Importar

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Habilitar ValidationPipe globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora propiedades que no estén definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no definidas en el DTO
      transform: true, // Transforma el payload a una instancia del DTO
      transformOptions: {
        enableImplicitConversion: true, // Permite conversión implícita (ej. string de query param a number)
      },
    }),
  );

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();