import jwtDecode, { JwtPayload } from 'jwt-decode';
import store from './store';
import { setAttempted, setAccessToken } from './store/auth/slice';
import { setError } from './store/ui/slice';

namespace AccessTokenManager {
  const { getState, dispatch } = store;
  const getAttemptedToSetToken = () => getState().auth.attemptedToSetToken;

  export const getAccessToken = () => getState().auth.accessToken;

  export const dispatchAccessToken = (accessToken: string) => dispatch(setAccessToken(accessToken));

  export const dispatchError = (error: Error) => dispatch(setError(error));

  const isAccessTokenValid = (): boolean => {
    try {
      const { exp } = jwtDecode<JwtPayload>(getAccessToken());

      // Token is valid
      if (exp && exp > Date.now() * 1000) return true;

      // eslint-disable-next-line
    } catch {}

    return false;
  };

  export const fetchAccessToken = async () => {
    dispatch(setAttempted(null));

    return fetch(
      'http://localhost:4000/refresh-token',
      {
        method: 'POST',
        credentials: 'include',
      },
    );
  };

  export const isAccessTokenUndefined = (): boolean => typeof getAccessToken() !== 'string'
    || (getAttemptedToSetToken() && getAccessToken() === '');

  export const isAccessTokenValidOrUndefined = (): boolean => isAccessTokenUndefined()
    || isAccessTokenValid();
}
export const {
  getAccessToken,
  fetchAccessToken,
  dispatchAccessToken,
  dispatchError,
  isAccessTokenUndefined,
  isAccessTokenValidOrUndefined,
} = AccessTokenManager;
