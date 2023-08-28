import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = await moduleFixture.resolve(PrismaService);
    await prisma.publications.deleteMany();
    await prisma.posts.deleteMany();
    await prisma.medias.deleteMany();

    await app.init();
  });

  it('/health => should get an alive message', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('I’m okay!');
  });

  describe('medias test =>', () => {
    it('/medias => should create media', () => {
      return request(app.getHttpServer())
        .post('/medias')
        .send({
          title: 'Linkedin',
          username: 'User1',
        })
        .expect(HttpStatus.CREATED);
    });

    it('/medias => should get media', async () => {
      await prisma.medias.create({
        data: {
          title: 'Linkedin',
          username: 'User1',
        },
      });
      const res = await request(app.getHttpServer()).get('/medias');
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/medias/:id => should get media by id', async () => {
      const media = await prisma.medias.create({
        data: {
          title: 'Linkedin',
          username: 'User1',
        },
      });

      const res = await request(app.getHttpServer()).get(`/medias/${media.id}`);
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/medias/:id => should update media info', async () => {
      const media = await prisma.medias.create({
        data: {
          title: 'Linkedin',
          username: 'User',
        },
      });
      const updatedMedia = await request(app.getHttpServer())
        .put(`/medias/${media.id}`)
        .send({
          title: 'Linkedin',
          username: 'User2',
        });

      expect(updatedMedia.body.username).toBe('User2');
    });

    it('/medias/:id => should delete media by id', async () => {
      const media = await prisma.medias.create({
        data: {
          title: 'Linkedin',
          username: 'User1',
        },
      });

      return request(app.getHttpServer())
        .delete(`/medias/${media.id}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('posts test =>', () => {
    it('/posts => should create posts', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send({
          title: 'Titulo de post',
          text: 'Texto de post',
        })
        .expect(HttpStatus.CREATED);
    });

    it('/posts => should get posts', async () => {
      await prisma.posts.create({
        data: {
          title: 'Titulo de post',
          text: 'Texto de post',
        },
      });
      const res = await request(app.getHttpServer()).get('/posts');
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/posts/:id => should get posts by id', async () => {
      const posts = await prisma.posts.create({
        data: {
          title: 'Titulo de post',
          text: 'Texto de post',
        },
      });

      const res = await request(app.getHttpServer()).get(`/posts/${posts.id}`);
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/posts/:id => should update posts info', async () => {
      const posts = await prisma.posts.create({
        data: {
          title: 'Titulo de post',
          text: 'Texto de post',
        },
      });
      const updatedPost = await request(app.getHttpServer())
        .put(`/posts/${posts.id}`)
        .send({
          title: 'Titulo de post 2',
          text: 'Texto de post',
        });

      expect(updatedPost.body.title).toBe('Titulo de post 2');
    });

    it('/posts/:id => should delete posts by id', async () => {
      const posts = await prisma.posts.create({
        data: {
          title: 'Titulo de post',
          text: 'Texto de post',
        },
      });

      return request(app.getHttpServer())
        .delete(`/posts/${posts.id}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('publications test =>', () => {
    it('/publications => should create publications', async () => {
      const post = await prisma.posts.create({
        data: {
          title: 'Titulo de post',
          text: 'Texto de post',
        },
      });

      const media = await prisma.medias.create({
        data: {
          title: 'Linkedin',
          username: 'User1',
        },
      });

      return request(app.getHttpServer())
        .post('/publications')
        .send({
          mediaId: media.id,
          postId: post.id,
          date: new Date(),
        })
        .expect(HttpStatus.CREATED);
    });

    it('/publications => should get publications', async () => {
      const post = await prisma.posts.create({
        data: {
          title: 'Titulo de post',
          text: 'Texto de post',
        },
      });

      const media = await prisma.medias.create({
        data: {
          title: 'Linkedin',
          username: 'User1',
        },
      });

      await prisma.publications.create({
        data: {
          mediaId: media.id,
          postId: post.id,
          date: new Date(),
        },
      });

      const res = await request(app.getHttpServer()).get('/publications');
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/publications/:id => should get publications by id', async () => {
      const post = await prisma.posts.create({
        data: {
          title: 'Titulo de post',
          text: 'Texto de post',
        },
      });

      const media = await prisma.medias.create({
        data: {
          title: 'Linkedin',
          username: 'User1',
        },
      });

      const publication = await prisma.publications.create({
        data: {
          mediaId: media.id,
          postId: post.id,
          date: new Date(),
        },
      });

      const res = await request(app.getHttpServer()).get(
        `/publications/${publication.id}`,
      );
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/publications/:id => should update publications info', async () => {
      const post = await prisma.posts.create({
        data: {
          title: 'Titulo de post',
          text: 'Texto de post',
        },
      });

      const media = await prisma.medias.create({
        data: {
          title: 'Linkedin',
          username: 'User1',
        },
      });
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const publication = await prisma.publications.create({
        data: {
          mediaId: media.id,
          postId: post.id,
          date: tomorrow,
        },
      });

      tomorrow.setDate(tomorrow.getDate() + 1);

      const updatedPublication = await request(app.getHttpServer())
        .put(`/publications/${publication.id}`)
        .send({
          mediaId: media.id,
          postId: post.id,
          date: tomorrow,
        });
      console.log(updatedPublication.body);
      expect(updatedPublication.body.date).toBe(tomorrow.toISOString());
    });

    it('/publications/:id => should delete publications by id', async () => {
      const post = await prisma.posts.create({
        data: {
          title: 'Titulo de post',
          text: 'Texto de post',
        },
      });

      const media = await prisma.medias.create({
        data: {
          title: 'Linkedin',
          username: 'User1',
        },
      });
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const publication = await prisma.publications.create({
        data: {
          mediaId: media.id,
          postId: post.id,
          date: new Date(),
        },
      });

      return request(app.getHttpServer())
        .delete(`/publications/${publication.id}`)
        .expect(HttpStatus.OK);
    });
  });
});
