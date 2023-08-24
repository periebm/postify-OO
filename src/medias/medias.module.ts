import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { MediasRepository } from './medias.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MediasController],
  providers: [MediasService, MediasRepository, PrismaService],
  exports: [MediasService],
})
export class MediasModule {}
