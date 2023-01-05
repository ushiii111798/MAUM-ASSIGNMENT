import { Module } from '@nestjs/common';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './apis/auth/auth.module';
import { MemberModule } from './apis/member/member.module';
import { BoardModule } from './apis/board/board.module';
import { ReplyModule } from './apis/reply/reply.module';

const ALLOWED_HOSTS = process.env.ALLOWED_HOSTS.split(',');
@Module({
  imports: [
    AuthModule,
    MemberModule,
    BoardModule,
    ReplyModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      cache: 'bounded',
      autoSchemaFile: 'src/common/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: ALLOWED_HOSTS,
        credentials: true,
        exposedHeaders: ['Set-Cookie', 'Cookie'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: [
          'Access-Control-Allow-Origin',
          'Authorization',
          'X-Requested-With',
          'Content-Type',
          'Accept',
        ],
      },
      playground: true,
      introspection: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/apis/**/*.entity.*'],
      logging: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
