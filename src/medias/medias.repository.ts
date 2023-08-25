import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}

  createMediaDB(data: CreateMediaDto) {
    return this.prisma.medias.create({ data });
  }

  findExistingCombination(body: CreateMediaDto) {
    return this.prisma.medias.findFirst({
      where: {
        AND: { username: body.username, title: body.title },
      },
    });
  }

  findAll() {
    return this.prisma.medias.findMany({
      select: {
        id: true,
        title: true,
        username: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.medias.findFirst({
      where: { id },
      select: {
        id: true,
        title: true,
        username: true,
      },
    });
  }

  update(id: number, data: CreateMediaDto) {
    return this.prisma.medias.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.medias.delete({
      where: { id },
    });
  }
}
