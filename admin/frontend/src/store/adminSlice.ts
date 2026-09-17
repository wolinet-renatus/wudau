"use client";

import { apiInstance, apiInstanceFetch } from "@/util/ApiInstance";
import { jwtDecode } from "jwt-decode";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setToast } from "@/util/toast";
import { SetDevKey } from "@/util/setAuthAxios";
import { secretKey } from "@/util/config";
import axios from "axios";

interface UserState {
  isAuth: boolean;
  admin: any;
  isLoading: boolean;
}

const initialState: UserState = {
  isAuth: false,
  admin: {},
  isLoading: false,
};

interface AllUsersPayload {
  adminId: string;
  start?: number;
  limit?: number;
  startDate?: string;
  data: any;
  endDate?: string;
  type?: string;
  email?: string;
}

export const signUpAdmin = createAsyncThunk(
  "admin/admin/signUp",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.post("admin/admin/signUp", payload);
  }
);

export const login = createAsyncThunk(
  "admin/admin/login",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.post("admin/admin/login", payload);
  }
);

export const adminProfileGet = createAsyncThunk(
  "admin/admin/profile",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(`admin/admin/profile`);
  }
);

export const adminProfileUpdate = createAsyncThunk(
  "admin/admin/updateProfile",
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(`admin/admin/updateProfile`, payload?.data);
  }
);

export const updateAdminPassword = createAsyncThunk(
  "admin/admin/updatePassword",
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(`admin/admin/updatePassword`, payload?.data);
  }
);

export const sendEmail: any = createAsyncThunk(
  "admin/admin/forgotPassword",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstance.post(
      `admin/admin/forgotPassword?email=${payload?.email}`
    );
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logoutApi(state: any, action: PayloadAction<any>) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("admin");
      sessionStorage.removeItem("key");
      sessionStorage.removeItem("isAuth");
      state.admin = {};
      state.isAuth = false;
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      signUpAdmin.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      signUpAdmin.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload && action.payload?.status !== false) {
          const token = action.payload.data;
          if (token) {
            try {
              const decodedToken: any = jwtDecode(token);
              const role = action.payload?.role || decodedToken?.role || "user";
              state.isAuth = true;
              state.admin = decodedToken;
              localStorage.setItem("token", token);
              sessionStorage.setItem("token", token);
              sessionStorage.setItem("isAuth", JSON.stringify(true));
              sessionStorage.setItem("role", role);
              if (action.payload?.user) {
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                sessionStorage.setItem("user", JSON.stringify(action.payload.user));
              }
            } catch (err) {
              console.warn("Token decode warning:", err);
            }
          }
          setToast("success", "Account created successfully! Welcome to WUDAU.");
          setTimeout(() => {
            window.location.href = "/";
          }, 1200);
        } else {
          setToast("error", action.payload?.message || "Sign up failed");
        }
      }
    );
    builder.addCase(
      signUpAdmin.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message || "Sign up request error");
      }
    );

    builder.addCase(login.pending, (state: any, action: PayloadAction<any>) => {
      state.isLoading = true;
    });
    builder.addCase(
      login.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload && action.payload?.status !== false) {
          const token = action.payload.data;
          const decodedToken: any = jwtDecode(token);
          const role = action.payload?.role || decodedToken?.role || "user";
          state.isAuth = true;
          state.admin = decodedToken;
          axios.defaults.headers.common["Authorization"] = token;
          SetDevKey(secretKey);
          localStorage.setItem("token", token);
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("isAuth", JSON.stringify(true));
          sessionStorage.setItem("role", role);
          sessionStorage.setItem("admin_", JSON.stringify(decodedToken));
          if (action.payload?.user) {
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            sessionStorage.setItem("user", JSON.stringify(action.payload.user));
          }
          setToast("success", role === "admin" ? "Logged in as Administrator" : "Welcome back to WUDAU!");
          setTimeout(() => {
            if (role === "admin") {
              window.location.href = "/dashboard";
            } else {
              window.location.href = "/";
            }
          }, 1200);
        } else {
          setToast("error", action.payload?.message || "Login failed");
        }
      }
    );
    builder.addCase(
      login.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message || "Login request error");
      }
    );

    builder.addCase(
      adminProfileGet.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      adminProfileGet.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.admin = action.payload.data;
      }
    );
    builder.addCase(
      adminProfileGet.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      sendEmail.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      sendEmail.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload?.status) {
          setToast("success", action?.payload?.message);
          // window.location.href = "/"
        }
      }
    );
    builder.addCase(
      sendEmail.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      adminProfileUpdate.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      adminProfileUpdate.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload.data?.status === true) {
          state.admin = action.payload.data?.data;
          setToast("success", "Admin profile  update successfully");
        } else {
          setToast("error", action.payload.data.message);
        }
      }
    );
    builder.addCase(
      adminProfileUpdate.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      updateAdminPassword.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      updateAdminPassword.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload.data?.status === true) {
          state.admin = action.payload.data?.data;
          setToast("success", "Admin password update successfully");
          window.location.href = "/";
        } else {
          setToast("error", action.payload.data.message);
        }
      }
    );
    builder.addCase(
      updateAdminPassword.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );
  },
});

export default adminSlice.reducer;
export const { logoutApi } = adminSlice.actions;
