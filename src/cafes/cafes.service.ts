import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { Cafe } from './entities/cafe.entity';
// No necesitamos QueryCafeDto aquí

@Injectable()
export class CafesService {
  constructor(
    @InjectRepository(Cafe)
    private readonly cafeRepository: Repository<Cafe>,
  ) {}

async create(createCafeDto: CreateCafeDto): Promise<Cafe> {
    // Extraemos las propiedades del DTO
    const { name, description, tipoId } = createCafeDto;

    // Creamos el objeto para TypeORM, incluyendo la relación
    // directamente, sin incluir tipoId por separado.
    const cafeToCreate = {
        name: name,
        description: description, // Será undefined si no se envió, lo cual está bien para TypeORM
        tipo: { id: tipoId }      // Asigna la relación por ID
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

  // --- MÉTODO findByTipo RESTAURADO ---
  // Busca todos los cafés que pertenecen a un tipo específico
  async findByTipo(tipoId: number): Promise<Cafe[]> {
    // Usamos find con 'where' para filtrar por el ID de la relación 'tipo'
    return this.cafeRepository.find({
      where: {
        tipo: { id: tipoId },
      },
      // relations: ['tipo'], // Opcional por eager loading
    });
  }
  // --- FIN MÉTODO findByTipo RESTAURADO ---

  async update(id: number, updateCafeDto: UpdateCafeDto): Promise<Cafe> {
    const preloadData: any = { ...updateCafeDto };
    if (updateCafeDto.tipoId) {
        preloadData.tipo = { id: updateCafeDto.tipoId };
        delete preloadData.tipoId;
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