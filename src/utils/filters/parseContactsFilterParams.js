import { parseInteger } from './parseNumber.js';

export const parseContactsFilterParams = ({ userID }) => {
  const ID = parseInteger(userID);

  return {
    userID: ID,
  };
};
