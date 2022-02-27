export const calculateRemainingTime = (expirationTime: string) => {
  const currentTime = new Date().getTime();
  const futureExpirationTime = new Date(expirationTime).getTime();
  return futureExpirationTime - currentTime;
};

export const retrieveAppData = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationTime = localStorage.getItem('expirationTime');
  const remainingTime = calculateRemainingTime(storedExpirationTime || '');

  if (remainingTime <= 0) {
    // clear the storage and return null
    localStorage.clear();
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime
  };
}