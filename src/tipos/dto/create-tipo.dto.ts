// src/tipos/dto/create-tipo.dto.ts
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateTipoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3) // Ejemplo: requerir al menos 3 caracteres
  name: string;

  @IsString()
  @IsOptional() // Hacemos la descripción opcional
  description: string;
}