import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicationsRepository } from '../publications/publications.repository';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PublicationsRepository],
  exports: [PostsService],
  imports: [PrismaModule],
})
export class PostsModule {}
