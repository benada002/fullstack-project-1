import { Response, Request } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import { REFRESH_TOKEN_COOKIE_NAME } from './constants';
import Device from './entities/Device';
import User from './entities/User';
import AccessTokenResponse from './objects/user/AccessToken';
import Context from './types/Context';
import JwtPayload from './types/JwtPayload';

type GenerateToken = (payload: Parameters<typeof sign>[0]) => string;

export const generateAccessToken: GenerateToken = (payload) => sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
  expiresIn: '10min',
});

export const generateRefreshToken: GenerateToken = (payload) => sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
  expiresIn: '1y',
});

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
  });
};

export const generateAccessAndRefreshTokenAndSetCookie = async (userId: User['id'], res: Response): Promise<AccessTokenResponse> => {
  const { id: deviceUuid } = await Device.create({ userId }).save();
  const payload = { id: userId, deviceUuid };

  setRefreshTokenCookie(res, generateRefreshToken(payload));
  return {
    accessToken: generateAccessToken(payload),
  };
};

export const verifyAccessTokenAndGetPayload = (req: Request) => {
  if (!req.headers.authorization) throw new Error('No authorization header');
  const token = req.headers.authorization.split(' ')[1];

  return verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
};

export const revokeTokens = async (
  userId: number,
  deviceUuid?: number,
): Promise<boolean> => !!await Device.delete({
  user: { id: userId },
  ...deviceUuid ? { id: deviceUuid } : {},
});
