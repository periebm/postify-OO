import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { MediasService } from '../medias/medias.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly repository: PublicationsRepository,
    private readonly media: MediasService,
    private readonly post: PostsService,
  ) {}

  async create(body: CreatePublicationDto) {
    await this.media.searchForMedia(body.mediaId);
    await this.post.searchForPost(body.postId);

    return await this.repository.createPublicationDB(body);
  }

  async findAll(published?: string, after?: string) {
    await this.checkQueriesValidation(published, after);
    let sendAfter = undefined;
    if (after !== undefined) sendAfter = new Date(after);
    return await this.repository.findAll(published, sendAfter);
  }

  async findOne(id: number) {
    const publication = await this.searchForPublication(id);

    return publication;
  }

  async update(id: number, body: CreatePublicationDto) {
    await this.media.searchForMedia(body.mediaId);
    await this.post.searchForPost(body.postId);
    const publication = await this.searchForPublication(id);
    await this.checkIfAlreadyPublished(new Date(publication.date), new Date());
    return this.repository.update(id, body);
  }

  async remove(id: number) {
    await this.searchForPublication(id);

    return await this.repository.remove(id);
  }

  async checkIfAlreadyPublished(scheduleDate: Date, today: Date) {
    if (today.getTime() >= scheduleDate.getTime()) {
      //if enters the conditional, it means that the post has already been published;
      throw new ForbiddenException();
    }
  }

  private async checkQueriesValidation(published?: string, after?: string) {
    const afterDate = new Date(after);

    if (
      published !== undefined &&
      published !== 'true' &&
      published !== 'false'
    ) {
      console.log('query invalido');
      throw new NotAcceptableException();
    }

    if (after !== undefined && isNaN(afterDate.getTime())) {
      console.log('data invalido');
      throw new NotAcceptableException();
    }
  }

  private async searchForPublication(id: number) {
    const publication = await this.repository.findOne(id);
    if (!publication) throw new NotFoundException();
    return publication;
  }
}
