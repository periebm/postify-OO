import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPublicationDB(data: CreatePublicationDto) {
    return this.prisma.publications.create({ data });
  }

  findAll(published, after) {
    let where = {};

    if (published === 'true') {
      if (after) {
        where = {
          date: {
            gte: after,
            lte: new Date(), // Publicado até a data de hoje
          },
        };
      } else {
        where = {
          date: {
            lte: new Date(),
          },
        };
      }
    } else if (published === 'false') {
      where = {
        date: {
          gt: new Date(),
        },
      };
    }

    const query = {
      select: {
        id: true,
        mediaId: true,
        postId: true,
        date: true,
      },
      where: where,
    };

    return this.prisma.publications.findMany(query);
  }

  findOne(id: number) {
    return this.prisma.publications.findFirst({
      where: { id },
      select: {
        id: true,
        mediaId: true,
        postId: true,
        date: true,
      },
    });
  }

  findMediaById(id: number) {
    return this.prisma.publications.findFirst({
      where: { mediaId: id },
      select: {
        id: true,
        mediaId: true,
        postId: true,
        date: true,
      },
    });
  }

  findPostById(id: number) {
    return this.prisma.publications.findFirst({
      where: { postId: id },
      select: {
        id: true,
        mediaId: true,
        postId: true,
        date: true,
      },
    });
  }

  update(id: number, data: CreatePublicationDto) {
    return this.prisma.publications.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.publications.delete({
      where: { id },
    });
  }
}
