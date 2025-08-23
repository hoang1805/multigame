import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import hbs from 'hbs'; // 👈 dùng require
import layouts from 'handlebars-layouts';
import cookieParser from 'cookie-parser';

function _initPipes(app: INestApplication<any>) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}

function _initFilters(app: INestApplication<any>) {
  // app.useGlobalFilters(new HttpExceptionFilter());
}

function _initInterceptors(app: INestApplication<any>) {
  app.useGlobalInterceptors(new LoggingInterceptor());
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  _initPipes(app);
  _initFilters(app);
  _initInterceptors(app);

  app.use(cookieParser());

  app.enableCors({
    origin: '*', // hoặc '*' nếu muốn mở cho tất cả
    credentials: true, // nếu cần gửi cookie/token
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(__dirname, '..', 'views', 'layouts'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  layouts.register(hbs.handlebars);

  hbs.registerHelper('json', (context) => {
    return JSON.stringify(context);
  });

  hbs.registerHelper('multiply', (a: number, b: number) => {
    return a * b;
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
