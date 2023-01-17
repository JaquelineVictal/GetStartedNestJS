export const mockDateNow = () => {
  const now = 1579122000000; // 2020-01-15 21:00:00
  jest.spyOn(Date, 'now').mockReturnValue(now);
};
