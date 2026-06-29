const FOLLOWING_KEY = "pulse_following";

export const getFollowingIds = () => {
  try {
    const raw = localStorage.getItem(FOLLOWING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const isFollowingProfile = (profileId) => {
  return getFollowingIds().includes(Number(profileId));
};

export const setFollowingProfile = (profileId, following) => {
  const ids = new Set(getFollowingIds().map(Number));
  const id = Number(profileId);
  if (following) ids.add(id);
  else ids.delete(id);
  localStorage.setItem(FOLLOWING_KEY, JSON.stringify([...ids]));
};
