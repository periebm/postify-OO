import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPostDB(data: CreatePostDto) {
    return this.prisma.posts.create({ data });
  }

  findAll() {
    return this.prisma.posts.findMany({
      select: {
        id: true,
        title: true,
        text: true,
        image: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.posts.findFirst({
      where: { id },
      select: {
        id: true,
        title: true,
        text: true,
        image: true,
      },
    });
  }

  update(id: number, data: CreatePostDto) {
    return this.prisma.posts.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.posts.delete({
      where: { id },
    });
  }
}
