import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'anotheruser@mail.ru',
          password: 'testpasswsssord22@',
          role: 'ADMIN',
        })
        .expect(400);
    });

    it('should login and return a JWT', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'tohach22@mail.ru', password: 'QwerT123@33' })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('token');
          authToken = response.body.token;
        });
    });
  });

  describe('Users', () => {
    it('should get a list of users (admin only)', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should get a user profile', () => {
      return request(app.getHttpServer())
        .get('/users/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should update a user profile', () => {
      return request(app.getHttpServer())
        .patch('/users/3')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'updatedusera@mail.ru' })
        .expect(200);
    });

    // it('should delete a user', () => {
    //    return request(app.getHttpServer())
    //     .delete('/users/1')
    //     .set('Authorization', `Bearer ${authToken}`)
    //     .expect(200);
    // });
  });

  describe('Posts', () => {
    let postId: number;

    it('should create a new post', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Post', content: 'This is a test post' })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          postId = response.body.id;
        });
    });

    it('should get a list of posts', () => {
      return request(app.getHttpServer()).get('/posts').expect(200);
    });

    it('should get a post by id', () => {
      return request(app.getHttpServer()).get(`/posts/${postId}`).expect(200);
    });

    it('should update a post', () => {
      return request(app.getHttpServer())
        .patch(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Post' })
        .expect(200);
    });

    it('should delete a post', () => {
      return request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
