export function parseQueryString(queryString: string) {
  const value = queryString?.split("/");
  return value?.[5];
}
