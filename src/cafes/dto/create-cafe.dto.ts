// src/cafes/dto/create-cafe.dto.ts
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateCafeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description: string;

// Cambio tipoId por tipoName
  @IsString()
  @IsNotEmpty()
  tipoName: string; // Nombre del tipo
}
