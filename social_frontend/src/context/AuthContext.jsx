import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { setTokens, clearTokens, getAccessToken } from "../utils/token";
import { TOKEN_URL } from "../utils/constants";
import { getUserIdFromToken } from "../utils/jwt";
import axios from "axios";

export const AuthContext = createContext(null);

const normalizeProfiles = (data) => data?.results ?? data ?? [];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfiles = useCallback(async () => {
    const { data } = await api.get("/api/profiles/");
    const list = normalizeProfiles(data);
    setProfiles(list);
    return list;
  }, []);

  const buildUserFromProfiles = useCallback((userId, list, username) => {
    const myProfile = list.find(
    (p) => Number(p.user?.id) === Number(userId)
);
    if (!myProfile) {
      return username
        ? { id: userId, username, authenticated: true }
        : { id: userId, authenticated: true };
    }
    return {
      id: userId,
      username: myProfile.user.username,
      profileId: myProfile.id,
      profileImage: myProfile.profile_image,
      bio: myProfile.bio,
      authenticated: true,
    };
  }, []);

  const fetchUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setProfiles([]);
      setLoading(false);
      return;
    }

    try {
      const userId = Number(getUserIdFromToken(token));
      const list = await loadProfiles();
      setUser(buildUserFromProfiles(userId, list));
    } catch {
      setUser(null);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [loadProfiles, buildUserFromProfiles]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const getProfileId = useCallback(
    (userId) => profiles.find((p) => p.user?.id === userId)?.id ?? null,
    [profiles]
  );

  const getProfileById = useCallback(
    (profileId) => profiles.find((p) => p.id === Number(profileId)) ?? null,
    [profiles]
  );

  const updateUserProfile = useCallback((updatedProfile) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? { ...p, ...updatedProfile } : p))
    );
    setUser((prev) =>
      prev?.profileId === updatedProfile.id
        ? {
            ...prev,
            profileImage: updatedProfile.profile_image ?? prev.profileImage,
            bio: updatedProfile.bio ?? prev.bio,
          }
        : prev
    );
  }, []);

  const login = async (username, password) => {
    const { data } = await axios.post(TOKEN_URL, { username, password });
    setTokens(data.access, data.refresh);
    const userId = Number(getUserIdFromToken(data.access));
    const list = await loadProfiles();
    const nextUser = buildUserFromProfiles(userId, list, username);
    setUser(nextUser);
    return data;
  };

  const register = async (username, email, password) => {
    const { data } = await axios.post("/api/register/", {
      username,
      email,
      password,
    });
    return data;
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setProfiles([]);
  };

  const refreshProfiles = useCallback(async () => {
    const list = await loadProfiles();
    const token = getAccessToken();
    if (token && user?.id) {
      setUser(buildUserFromProfiles(user.id, list, user.username));
    }
    return list;
  }, [loadProfiles, buildUserFromProfiles, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profiles,
        loading,
        login,
        logout,
        register,
        getProfileId,
        getProfileById,
        updateUserProfile,
        refreshProfiles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
