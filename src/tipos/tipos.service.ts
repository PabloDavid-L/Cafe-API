import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTipoDto } from './dto/create-tipo.dto';
import { UpdateTipoDto } from './dto/update-tipo.dto';
import { InjectRepository } from '@nestjs/typeorm'; // <--- 1. Importar
import { Tipo } from './entities/tipo.entity'; // <--- 2. Importar
import { Repository } from 'typeorm'; // <--- 3. Importar

@Injectable()
export class TiposService {
  // 4. Inyectar el repositorio
  constructor(
    @InjectRepository(Tipo)
    private readonly tipoRepository: Repository<Tipo>,
  ) {}

  // 5. Implementar la lógica real
  create(createTipoDto: CreateTipoDto) {
    const tipo = this.tipoRepository.create(createTipoDto);
    return this.tipoRepository.save(tipo);
  }

  findAll() {
    return this.tipoRepository.find();
  }

  async findOne(id: number) {
    const tipo = await this.tipoRepository.findOne({ where: { id } });
    if (!tipo) {
      throw new NotFoundException(`Tipo con id #${id} no encontrado`);
    }
    return tipo;
  }

  async update(id: number, updateTipoDto: UpdateTipoDto) {
    const tipo = await this.tipoRepository.preload({
      id: id,
      ...updateTipoDto,
    });
    if (!tipo) {
      throw new NotFoundException(`Tipo con id #${id} no encontrado`);
    }
    return this.tipoRepository.save(tipo);
  }

  async remove(id: number) {
    const tipo = await this.findOne(id);
    return this.tipoRepository.remove(tipo);
  }
}
