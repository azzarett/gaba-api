import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Promocodes (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await dataSource.query(
      'TRUNCATE TABLE "activations" RESTART IDENTITY CASCADE',
    );
    await dataSource.query(
      'TRUNCATE TABLE "promocodes" RESTART IDENTITY CASCADE',
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /v1/promocodes -> creates promocode', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/promocodes')
      .send({
        code: 'PROMO_E2E_10',
        discount: 10,
        activation_limit: 2,
      })
      .expect(201);

    expect(response.body.data.code).toBe('PROMO_E2E_10');
    expect(response.body.data.discount).toBe(10);
    expect(response.body.data.activation_limit).toBe(2);
  });

  it('GET /v1/promocodes and GET /v1/promocodes/:id', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/v1/promocodes')
      .send({
        code: 'PROMO_E2E_READ',
        discount: 15,
        activation_limit: 5,
      })
      .expect(201);

    const promocodeId = createResponse.body.data.id;

    const listResponse = await request(app.getHttpServer())
      .get('/v1/promocodes')
      .expect(200);

    expect(Array.isArray(listResponse.body.data)).toBe(true);
    expect(listResponse.body.data).toHaveLength(1);
    expect(listResponse.body.data[0].id).toBe(promocodeId);

    const getByIdResponse = await request(app.getHttpServer())
      .get(`/v1/promocodes/${promocodeId}`)
      .expect(200);

    expect(getByIdResponse.body.data.id).toBe(promocodeId);
    expect(getByIdResponse.body.data.code).toBe('PROMO_E2E_READ');
  });

  it('POST /v1/promocodes/:id/activate enforces unique email and limit', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/v1/promocodes')
      .send({
        code: 'PROMO_E2E_LIMIT',
        discount: 20,
        activation_limit: 2,
      })
      .expect(201);

    const promocodeId = createResponse.body.data.id;

    await request(app.getHttpServer())
      .post(`/v1/promocodes/${promocodeId}/activate`)
      .send({ email: 'user1@example.com' })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/v1/promocodes/${promocodeId}/activate`)
      .send({ email: 'user1@example.com' })
      .expect(409);

    await request(app.getHttpServer())
      .post(`/v1/promocodes/${promocodeId}/activate`)
      .send({ email: 'user2@example.com' })
      .expect(201);

    const limitResponse = await request(app.getHttpServer())
      .post(`/v1/promocodes/${promocodeId}/activate`)
      .send({ email: 'user3@example.com' })
      .expect(400);

    expect(limitResponse.body.message).toBe(
      'Promocode activation limit reached',
    );
  });

  it('POST /v1/promocodes/:id/activate rejects expired promocode', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/v1/promocodes')
      .send({
        code: 'PROMO_E2E_EXPIRED',
        discount: 5,
        activation_limit: 10,
        expiration_date: '2020-01-01T00:00:00.000Z',
      })
      .expect(201);

    const promocodeId = createResponse.body.data.id;

    const response = await request(app.getHttpServer())
      .post(`/v1/promocodes/${promocodeId}/activate`)
      .send({ email: 'late@example.com' })
      .expect(400);

    expect(response.body.message).toBe('Promocode is expired');
  });
});
