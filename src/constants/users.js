export const emailRegexp =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const accessTokenLifeTime = 1000 * 60 * 15;
export const refreshTokenLifeTime = 1000 * 60 * 60 * 24;
