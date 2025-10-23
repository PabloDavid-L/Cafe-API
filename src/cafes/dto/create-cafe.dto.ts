// src/cafes/dto/create-cafe.dto.ts
import { IsString, IsNotEmpty, IsOptional, MinLength, IsInt, IsPositive } from 'class-validator';

export class CreateCafeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  // Añadimos tipoId para recibir el ID del Tipo al que pertenece este café
  @IsInt() // Valida que sea un número entero
  @IsPositive() // Valida que sea un número positivo
  @IsNotEmpty() // Asegura que no sea nulo o vacío
  tipoId: number;
}