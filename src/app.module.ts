import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MeasureModule } from './measure/measure.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'shopper',
      autoLoadModels: true,
      synchronize: true,
    }),
    MeasureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
