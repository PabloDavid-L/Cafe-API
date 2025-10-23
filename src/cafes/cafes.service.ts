import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'; // Añadir BadRequestException
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { Cafe } from './entities/cafe.entity';
import { Tipo } from '../tipos/entities/tipo.entity'; // <-- 1. Importar Tipo

@Injectable()
export class CafesService {
  constructor(
    @InjectRepository(Cafe)
    private readonly cafeRepository: Repository<Cafe>,
    // <-- 2. Inyectar el repositorio de Tipo
    @InjectRepository(Tipo)
    private readonly tipoRepository: Repository<Tipo>,
  ) {}

    async create(createCafeDto: CreateCafeDto): Promise<Cafe> {
    const { name, description, tipoName } = createCafeDto;

    // 3. Buscar el Tipo por nombre
    // Usamos findOneBy para buscar por una propiedad específica
    const tipo = await this.tipoRepository.findOneBy({ name: tipoName });

    // 4. Validar si el Tipo existe
    if (!tipo) {
      // Lanzamos un error si no se encontró el tipo
      throw new BadRequestException(`El tipo con nombre "${tipoName}" no existe.`);
      // O podrías usar NotFoundException si lo preferís semánticamente
      // throw new NotFoundException(`El tipo con nombre "${tipoName}" no fue encontrado.`);
    }

    // 5. Crear el objeto Cafe asociando la entidad Tipo encontrada
    const cafeToCreate = {
        name: name,
        description: description,
        tipo: tipo // <-- Asociamos la entidad Tipo completa
    };

    const cafe = this.cafeRepository.create(cafeToCreate);
    return this.cafeRepository.save(cafe);
  }

  // findAll simple: solo trae todos los cafés (con su tipo por eager loading)
  async findAll(): Promise<Cafe[]> {
    return this.cafeRepository.find();
    // Podríamos añadir { relations: ['tipo'] } si quitáramos el eager,
    // pero con eager: true en Cafe.tipo no es estrictamente necesario
  }

  async findOne(id: number): Promise<Cafe> {
    const cafe = await this.cafeRepository.findOne({
       where: { id },
       // relations: ['tipo'], // Opcional por eager loading
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
            // ILike hace búsqueda case-insensitive (funciona bien en PostgreSQL)
            // Si quieres búsqueda exacta sensible a mayúsculas/minúsculas, usa solo:
            // name: tipoName
            name: ILike(tipoName)
        },
      },
      // Incluir relations es buena práctica aunque tipo sea eager
      relations: ['tipo'],
    });
  }

  async update(id: number, updateCafeDto: UpdateCafeDto): Promise<Cafe> {
     const { tipoId, tipoName, ...restOfDto } = updateCafeDto as any; // Usar any para flexibilidad o crear un DTO específico

     const preloadData: any = { ...restOfDto };

     if (tipoName) {
         const tipo = await this.tipoRepository.findOneBy({ name: tipoName });
         if (!tipo) {
             throw new BadRequestException(`El tipo con nombre "${tipoName}" no existe.`);
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