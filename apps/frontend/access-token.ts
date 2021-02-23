const accessTokenManager = (() => {
  let accessToken = '';

  const setAccessToken = (token = '') => {
    accessToken = token;
  };

  const getAccessToken = () => accessToken;

  return {
    setAccessToken,
    getAccessToken,
  };
})();

export default accessTokenManager;
