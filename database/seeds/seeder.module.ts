import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppEnvironment, getAppConfig } from 'src/config/app.config';
import { getDatabaseConfig } from 'src/config/database.config';
import { daos } from 'src/common/dao';
import { Seeder } from './seeder';
import { PromocodesSeeder } from './modules/promocodes/promocodes.seeder';

const appConfig = getAppConfig();
const databaseConfig = getDatabaseConfig();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      entities: daos,
      extra:
        appConfig.environment !== AppEnvironment.Local
          ? {
              ssl: {
                rejectUnauthorized: false,
              },
            }
          : undefined,
      ssl: appConfig.environment !== AppEnvironment.Local,
      synchronize: false,
    }),
    TypeOrmModule.forFeature(daos),
  ],
  providers: [Seeder, PromocodesSeeder],
})
export class SeederModule {}
