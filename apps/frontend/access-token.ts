const accessTokenManager = (() => {
  let accessToken = '';

  const setAccessToken = (token: string) => {
    accessToken = token;
  };

  const deleteAccessToken = () => {
    accessToken = '';
  };

  const getAccessToken = () => accessToken;

  return {
    setAccessToken,
    deleteAccessToken,
    getAccessToken,
  };
})();

export default accessTokenManager;
