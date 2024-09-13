const parseInteger = (value, defaultValue) => {
  if (typeof value !== 'string') return defaultValue;

  const parsedValue = parseInt(value);
  if (Number.isNaN(parsedValue)) return defaultValue;

  return parsedValue;
};

export const parsePaginationParams = ({ page, perPage }) => {
  const pagePagination = parseInteger(page, 1);
  const perPagePagination = parseInteger(perPage, 10);

  return {
    page: pagePagination,
    perPage: perPagePagination,
  };
};
