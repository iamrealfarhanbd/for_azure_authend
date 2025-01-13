export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  filterable: T,
  options: K[]
): Partial<T> => {
  const finalFilter: Partial<T> = {};
  for (const option of options) {
    if (filterable && filterable.hasOwnProperty.call(filterable, option)) {
      finalFilter[option] = filterable[option];
    }
  }
  return finalFilter;
};
