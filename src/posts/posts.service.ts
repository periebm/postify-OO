import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsRepository } from './posts.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly repository: PostsRepository,
    private readonly publicationRep: PublicationsRepository,
  ) {}

  async createPost(body: CreatePostDto) {
    return await this.repository.createPostDB(body);
  }

  async findAll() {
    const posts = await this.repository.findAll();
    if (!posts) {
      return posts;
    }

    const formattedPosts = posts.map((e) => {
      if (e.image === null) {
        delete e.image;
      }
      return e;
    });

    return formattedPosts;
  }

  async findOne(id: number) {
    const post = await this.searchForPost(id);
    if (post.image === null) delete post.image;

    return post;
  }

  async update(id: number, body: CreatePostDto) {
    await this.searchForPost(id);

    return await this.repository.update(id, body);
  }

  async remove(id: number) {
    await this.searchForPost(id);
    await this.searchForPostInPublications(id);

    return await this.repository.remove(id);
  }

  async searchForPost(id: number) {
    const post = await this.repository.findOne(id);
    if (!post) throw new NotFoundException();

    return post;
  }

  private async searchForPostInPublications(id: number) {
    const post = await this.publicationRep.findPostById(id);
    if (post) throw new ForbiddenException();
  }
}
