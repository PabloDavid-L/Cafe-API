import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { Cafe } from './entities/cafe.entity';
import { Tipo } from '../tipos/entities/tipo.entity';
import { QueryCafeDto } from './dto/query-cafe.dto';

@Injectable()
export class CafesService {
  constructor(
    @InjectRepository(Cafe)
    private readonly cafeRepository: Repository<Cafe>,
    //Inyectar el repositorio de Tipo
    @InjectRepository(Tipo)
    private readonly tipoRepository: Repository<Tipo>,
  ) {}

  async create(createCafeDto: CreateCafeDto): Promise<Cafe> {
    const { name, description, tipoName } = createCafeDto;

    // Buscar el Tipo por nombre
    // Usamos findOneBy para buscar por una propiedad específica
    const tipo = await this.tipoRepository.findOneBy({ name: tipoName });

    // Validar si el Tipo existe
    if (!tipo) {
      // Lanzamos un error si no se encontró el tipo
      throw new BadRequestException(
        `El tipo con nombre "${tipoName}" no existe.`,
      );
    }

    // Crear el objeto Cafe asociando la entidad Tipo encontrada
    const cafeToCreate = {
      name: name,
      description: description,
      tipo: tipo, // Asociamos la entidad Tipo completa
    };

    const cafe = this.cafeRepository.create(cafeToCreate);
    return this.cafeRepository.save(cafe);
  }

  // findAll:  trae todos los cafés, query filtrado especifico
  async findAll(query: QueryCafeDto): Promise<Cafe[]> {
    // Extraemos los parámetros del DTO, usando los valores por defecto si no vienen
    const {
      tipoName,
      description,
      sortBy = 'id',
      orderBy = 'ASC',
      page = 1,
      limit = 10,
    } = query;

    // Calcula el offset para la paginación
    const skip = (page - 1) * limit;

    // Construye las opciones de búsqueda para TypeORM
    const options: FindManyOptions<Cafe> = {
      relations: ['tipo'], // Asegura que cargue la relación tipo
      where: {},
      order: {
        [sortBy]: orderBy.toUpperCase() as 'ASC' | 'DESC', // Asegura que sea ASC o DESC
      },
      skip: skip,
      take: limit,
    };

    // --- Aplicar Filtros ---
    // Filtro por nombre de tipo (case-insensitive, parcial)
    if (tipoName) {
      (options.where as any).tipo = { name: ILike(`%${tipoName}%`) };
    }

    // Filtro por descripción (case-insensitive, parcial)
    if (description) {
      (options.where as any).description = ILike(`%${description}%`);
    }

    // Ejecuta la consulta
    return this.cafeRepository.find(options);
  }

  async findOne(id: number): Promise<Cafe> {
    const cafe = await this.cafeRepository.findOne({
      where: { id },
    });
    if (!cafe) {
      throw new NotFoundException(`Café con id #${id} no encontrado`);
    }
    return cafe;
  }

  async findByTipoName(tipoName: string): Promise<Cafe[]> {
    return this.cafeRepository.find({
      where: {
        // Accede a la propiedad 'name' de la relación 'tipo'
        tipo: {
          name: ILike(tipoName),
        },
      },
      relations: ['tipo'],
    });
  }

  async update(id: number, updateCafeDto: UpdateCafeDto): Promise<Cafe> {
    const { tipoId, tipoName, ...restOfDto } = updateCafeDto as any; // Usar any para flexibilidad o crear un DTO específico

    const preloadData: any = { ...restOfDto };

    if (tipoName) {
      const tipo = await this.tipoRepository.findOneBy({ name: tipoName });
      if (!tipo) {
        throw new BadRequestException(
          `El tipo con nombre "${tipoName}" no existe.`,
        );
      }
      preloadData.tipo = tipo; // Asociar la entidad encontrada
    } else if (tipoId) {
      // Mantenemos la lógica anterior si se envía tipoId (opcional)
      preloadData.tipo = { id: tipoId };
    }

    const cafe = await this.cafeRepository.preload({
      id: id,
      ...preloadData,
    });

    if (!cafe) {
      throw new NotFoundException(`Café con id #${id} no encontrado`);
    }
    return this.cafeRepository.save(cafe);
  }

  async remove(id: number): Promise<Cafe> {
    const cafe = await this.findOne(id);
    return this.cafeRepository.remove(cafe);
  }
}
