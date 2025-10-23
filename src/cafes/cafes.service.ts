import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { Cafe } from './entities/cafe.entity';
// Asegúrate de importar la entidad Tipo si necesitas hacer validaciones o cargas explícitas
// import { Tipo } from '../tipos/entities/tipo.entity';

@Injectable()
export class CafesService {
  constructor(
    @InjectRepository(Cafe)
    private readonly cafeRepository: Repository<Cafe>,
    // Opcionalmente, puedes inyectar el repositorio de Tipo si necesitas validar
    // que el tipoId proporcionado en CreateCafeDto exista, por ejemplo.
    // @InjectRepository(Tipo)
    // private readonly tipoRepository: Repository<Tipo>,
  ) {}

  async create(createCafeDto: CreateCafeDto): Promise<Cafe> {
    // Aquí deberías añadir lógica si necesitas validar que el 'tipo' (o tipoId)
    // exista antes de crear el café. Por ejemplo:
    // const tipo = await this.tipoRepository.findOne({ where: { id: createCafeDto.tipoId } });
    // if (!tipo) {
    //   throw new NotFoundException(`Tipo con id #${createCafeDto.tipoId} no encontrado`);
    // }
    //
    // Luego, al crear, podrías asignar la entidad encontrada:
    // const cafe = this.cafeRepository.create({ ...createCafeDto, tipo });

    // Si CreateCafeDto espera un objeto 'tipo' completo o solo el 'id' dependerá
    // de cómo definas tu DTO y la lógica de negocio.
    // Asumiendo que TypeORM puede manejar la relación con solo el id:
    const cafe = this.cafeRepository.create(createCafeDto);
    return this.cafeRepository.save(cafe);
  }

  findAll(): Promise<Cafe[]> {
    // Si quisieras cargar explícitamente la relación 'tipo' (aunque ya está eager):
    // return this.cafeRepository.find({ relations: ['tipo'] });
    return this.cafeRepository.find();
  }

  async findOne(id: number): Promise<Cafe> {
    const cafe = await this.cafeRepository.findOne({
       where: { id },
       // relations: ['tipo'], // No necesario si 'tipo' es eager
    });
    if (!cafe) {
      throw new NotFoundException(`Café con id #${id} no encontrado`);
    }
    return cafe;
  }

  // Busca todos los cafés que pertenecen a un tipo específico
  findByTipo(tipoId: number): Promise<Cafe[]> {
    return this.cafeRepository.find({
      where: {
        tipo: { id: tipoId }, // Filtra por el id de la relación 'tipo'
      },
      // relations: ['tipo'], // No necesario si 'tipo' es eager
    });
  }


  async update(id: number, updateCafeDto: UpdateCafeDto): Promise<Cafe> {
    // preload busca la entidad por id y fusiona los nuevos datos del DTO.
    // Si la entidad no existe, retorna undefined.
    const cafe = await this.cafeRepository.preload({
      id: id,
      ...updateCafeDto,
      // Si recibes tipoId en el DTO y necesitas asignar la relación:
      // ...(updateCafeDto.tipoId && { tipo: { id: updateCafeDto.tipoId } })
    });
    if (!cafe) {
      throw new NotFoundException(`Café con id #${id} no encontrado`);
    }

    // Aquí también podrías añadir validación para el tipoId si se actualiza.

    return this.cafeRepository.save(cafe);
  }

  async remove(id: number): Promise<Cafe> {
    // Primero, busca el café para asegurarte de que existe
    const cafe = await this.findOne(id);
    // remove retorna la entidad eliminada
    return this.cafeRepository.remove(cafe);
    // Alternativamente, puedes usar delete que solo ejecuta la consulta
    // const result = await this.cafeRepository.delete(id);
    // if (result.affected === 0) {
    //   throw new NotFoundException(`Café con id #${id} no encontrado`);
    // }
  }
}
