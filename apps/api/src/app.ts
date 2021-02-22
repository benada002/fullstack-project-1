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
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  authChecker,
  verifyAccessTokenAndGetPayload,
} from './auth';
import Device from './entities/Device';
import JwtPayload from './types/JwtPayload';
import Role from './entities/Role';

dotenv.config({
  allowEmptyValues: true,
});

const main = async () => {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

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
      logging: !process.env.production,
    });

    const app = express();

    app.use(cookieParser());

    app.post('/refresh-tokens', async (req, res) => {
      const token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

      try {
        const { id, deviceUuid } = verify(
          token, process.env.REFRESH_TOKEN_SECRET as string,
        ) as JwtPayload;
        const payload = { id, deviceUuid };

        await getRepository(User)
          .createQueryBuilder('u')
          .leftJoin(Device, 'd', 'd.userId = u.id')
          .where('u.id = :id', { id })
          .andWhere('d.id = :deviceUuid', { deviceUuid })
          .getOneOrFail();

        setRefreshTokenCookie(res, generateRefreshToken(payload));
        return res.send({ ok: true, accessToken: generateAccessToken(payload) });
      } catch (err) {
        // console.log(err);
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
      context: ({ req, res }): Context => {
        let payload;

        try {
          payload = verifyAccessTokenAndGetPayload(req);

          // eslint-disable-next-line
        } catch {}

        return {
          req,
          res,
          ...payload ? { payload } : {},
        };
      },
    });

    apolloServer.applyMiddleware({ app });

    app.listen(PORT, () => {
      console.log(`up on ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};
main();
