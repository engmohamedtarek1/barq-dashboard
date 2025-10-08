// hooks/useProfile.ts
import { useState, useEffect } from "react";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  AdminProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "@/lib/api/profile";
import { setAdminData, getAdminData } from "@/lib/api/auth";

export const useProfile = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminProfile();
      setProfile(response.data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data: UpdateProfilePayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateAdminProfile(data);
      setProfile(response.data);

      // Update localStorage adminData with the new profile data
      setAdminData(response.data);

      return response.data;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message || "فشل في تحديث البيانات";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (data: ChangePasswordPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await changeAdminPassword(data);
      setProfile(response.data);

      // Update localStorage adminData with the updated profile data
      setAdminData(response.data);

      return response.data;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message || "فشل في تغيير كلمة المرور";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to load profile data from localStorage first for faster initial load
    const cachedAdminData = getAdminData();
    if (cachedAdminData) {
      setProfile(cachedAdminData);
    }

    // Always fetch fresh data from API
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    setError, // For clearing errors manually
  };
};
