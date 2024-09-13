import { SORT_ORDER } from '../constants/sort.js';

export const parseSortParams = ({ sortBy, sortFields, sortOrder }) => {
  const parsedSortOrder = SORT_ORDER.includes(sortOrder)
    ? sortOrder
    : SORT_ORDER[0];

  const parseSortBy = sortFields.includes(sortBy) ? sortBy : '_id';

  return {
    sortOrder: parsedSortOrder,
    sortBy: parseSortBy,
  };
};
