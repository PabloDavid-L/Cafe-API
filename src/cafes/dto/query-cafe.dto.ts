import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';

// Valores por defecto
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50; // Límite máximo de items por página

export class QueryCafeDto {
  // Filtro por nombre del tipo
  @IsOptional()
  @IsString()
  tipoName?: string;

  // Filtro por descripción
  @IsOptional()
  @IsString()
  description?: string;

  // Ordenamiento
  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderBy?: 'ASC' | 'DESC' = 'ASC';

  // Paginación
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) // Transforma string a número
  page?: number = DEFAULT_PAGE;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT) // Limita la cantidad
  @Type(() => Number) // Transforma string a número
  limit?: number = DEFAULT_LIMIT;
}
