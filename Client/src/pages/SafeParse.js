export function safeParse(json, fallback = null) {
  if (!json || json === "undefined" || json === "null") return fallback;

  try {
    return JSON.parse(json);
    //eslint-disable-next-line
  } catch (e) {
    return fallback;
  }
}
