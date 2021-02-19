import 'reflect-metadata';
import dotenv from 'dotenv-safe';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createConnection, getRepository } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import Post from './entities/Post';
import Sub from './entities/Sub';
import Tag from './entities/Tag';
import User from './entities/User';
import Vote from './entities/Vote';
import PostResolver from './resolvers/post';
import UserResolver from './resolvers/user';
import Context from './types/Context';
import { REFRESH_TOKEN_COOKIE_NAME } from './constants';
import {
  generateAccessToken, generateRefreshToken, setRefreshTokenCookie, authChecker,
} from './auth';
import Device from './entities/Device';
import JwtPayload from './types/JwtPayload';
import Role from './entities/Role';

dotenv.config({
  allowEmptyValues: true,
});

const main = async () => {
  try {
    // @ts-ignore
    const DBCon = await createConnection({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ?? 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Post, User, Sub, Tag, Vote, Role, Device],
      synchronize: !process.env.production,
    });

    const app = express();

    app.use(cookieParser());

    app.post('/refresh-tokens', async (req, res) => {
      const token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

      try {
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;

        await getRepository(User)
          .createQueryBuilder('user')
          .leftJoin(Device, 'device', 'device.userId = user.id')
          .where('user.id = :id', payload)
          .andWhere('device.id = :deviceUuid', payload)
          .getOneOrFail();

        setRefreshTokenCookie(res, generateRefreshToken(payload));
        return res.send({ ok: true, accessToken: generateAccessToken(payload) });
      } catch {
        return res.send({
          ok: false,
          accessToken: '',
        });
      }
    });

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [PostResolver, UserResolver],
        authChecker,
      }),
      context: ({ req, res }): Context => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(process.env.PORT ?? 4000, () => {
      console.log(`up on ${process.env.PORT ?? 4000}`);
    });
  } catch (err) {
    console.log(err);
  }
};
main();
