import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediasRepository } from './medias.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class MediasService {
  constructor(
    private readonly repository: MediasRepository,
    private readonly publicationRep: PublicationsRepository,
  ) {}

  async createMedia(body: CreateMediaDto) {
    await this.searchForCombination(body);

    return await this.repository.createMediaDB(body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    const media = await this.searchForMedia(id);

    return media;
  }

  async update(id: number, body: CreateMediaDto) {
    await this.searchForMedia(id);
    await this.searchForCombination(body);

    return await this.repository.update(id, body);
  }

  async remove(id: number) {
    await this.searchForMedia(id);
    await this.searchForMediaInPublications(id);

    return await this.repository.remove(id);
  }

  async searchForMedia(id: number) {
    const media = await this.repository.findOne(id);
    if (!media) throw new NotFoundException();

    return media;
  }

  private async searchForCombination(body: CreateMediaDto) {
    const combination = await this.repository.findExistingCombination(body);
    if (combination) throw new ConflictException();
  }

  private async searchForMediaInPublications(id: number) {
    const media = await this.publicationRep.findMediaById(id);
    if (media) throw new ForbiddenException();
  }
}
