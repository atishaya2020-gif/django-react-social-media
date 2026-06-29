export const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return path.startsWith("/") ? path : `/${path}`;
};
