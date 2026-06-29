export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

export const getUserIdFromToken = (token) => {
  const payload = decodeToken(token);
  return payload?.user_id ?? null;
};
