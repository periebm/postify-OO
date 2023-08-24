import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly repository: MediasRepository) {}

  async createMedia(body: CreateMediaDto) {
    return await this.repository.createMediaDB(body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, body: CreateMediaDto) {
    return await this.repository.update(id, body);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
