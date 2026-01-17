import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "./cookies";

const allApi = createApi({
  reducerPath: "allApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://nessa-kolacheowl-backend.vercel.app/api/v1",
    prepareHeaders: (headers) => {
      const token = getCookie("NessasBrokenWorldAuthToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
    }),
    // --- New Endpoints Added Below ---
    verifyOtp: builder.mutation({
      query: (otpData) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: otpData,
      }),
    }),
    resendOtp: builder.mutation({
      query: (email) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: email,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    getUserInfo: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: "/users/profile-image",
        method: "PUT",
        body: formData,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile-update",
        method: "PUT",
        body: data, // Sending { name: "..." }
      }),
    }),
    adminChangePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: data,
      }),
    }),
    // --- ABOUT US (3) ---
    getAboutUs: builder.query({
      query: () => "/legal/about-us",
    }),
    createAboutUs: builder.mutation({
      query: (data) => ({ url: "/legal/about-us", method: "POST", body: data }),
    }),
    updateAboutUs: builder.mutation({
      query: (data) => ({ url: "/legal/about-us", method: "Post", body: data }),
    }),

    // --- PRIVACY POLICY (3) ---
    getPrivacyPolicy: builder.query({
      query: () => "/legal/privacy-policy",
    }),
    createPrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: "/legal/privacy-policy",
        method: "POST",
        body: data,
      }),
    }),
    updatePrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: "/legal/privacy-policy",
        method: "POST",
        body: data,
      }),
    }),

    // --- TERMS & CONDITIONS (3) ---
    getTermsConditions: builder.query({
      query: () => "/legal/terms-and-conditions",
    }),
    createTermsConditions: builder.mutation({
      query: (data) => ({
        url: "/legal/terms-and-conditions",
        method: "POST",
        body: data,
      }),
    }),
    updateTermsConditions: builder.mutation({
      query: (data) => ({
        url: "/legal/terms-and-conditions",
        method: "POST",
        body: data,
      }),
    }),
    // --- BOOK MANAGEMENT ---
    getBooks: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "" } = {}) =>
        `/book/?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
      transformResponse: (response) => ({
        result: response.data.result,
        meta: response.data.meta,
      }),
    }),

    getSingleBook: builder.query({
      query: (bookId) => `/book/single/${bookId}`,
      transformResponse: (response) => response.data,
    }),

    createBook: builder.mutation({
      query: (formData) => ({
        url: "/book/create",
        method: "POST",
        body: formData,
      }),
    }),

    updateBook: builder.mutation({
      query: ({ bookId, formData }) => ({
        url: `/book/update/${bookId}`,
        method: "PUT",
        body: formData,
      }),
    }),

    deleteBook: builder.mutation({
      query: (bookId) => ({
        url: `/book/delete/${bookId}`,
        method: "DELETE",
      }),
    }),
    // --- BLOG MANAGEMENT ---
    getBlogs: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "" } = {}) =>
        `/blog/?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
      transformResponse: (response) => ({
        result: response.data.result,
        meta: response.data.meta,
      }),
    }),

    getSingleBlog: builder.query({
      query: (blogId) => `/blog/single/${blogId}`,
      transformResponse: (response) => response.data,
    }),
    createBlog: builder.mutation({
      query: (formData) => ({
        url: "/blog/create",
        method: "POST",
        body: formData,
      }),
    }),

    updateBlog: builder.mutation({
      query: ({ blogId, formData }) => ({
        url: `/blog/update/${blogId}`,
        method: "PUT",
        body: formData,
      }),
    }),

    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `/blog/delete/${blogId}`,
        method: "DELETE",
      }),
    }),
    // --- CHARACTER MANAGEMENT ---
    getCharacters: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "" } = {}) =>
        `/character/?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
      transformResponse: (response) => ({
        result: response.data.result,
        meta: response.data.meta,
      }),
    }),

    getSingleCharacter: builder.query({
      query: (characterId) => `/character/single/${characterId}`,
      transformResponse: (response) => response.data,
    }),
    createCharacter: builder.mutation({
      query: (formData) => ({
        url: "/character/create",
        method: "POST",
        body: formData,
      }),
    }),

    updateCharacter: builder.mutation({
      query: ({ characterId, formData }) => ({
        url: `/character/update/${characterId}`,
        method: "PUT",
        body: formData,
      }),
    }),

    deleteCharacter: builder.mutation({
      query: (characterId) => ({
        url: `/character/delete/${characterId}`,
        method: "DELETE",
      }),
    }),
    // --- THEMES  MANAGEMENT ---
    getThemes: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "" } = {}) =>
        `/theme/?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
      transformResponse: (response) => ({
        result: response.data.result,
        meta: response.data.meta,
      }),
    }),

    getSingleTheme: builder.query({
      query: (themeId) => `/theme/single/${themeId}`,
      transformResponse: (response) => response.data,
    }),
    createTheme: builder.mutation({
      query: (formData) => ({
        url: "/theme/create",
        method: "POST",
        body: formData,
      }),
    }),

    updateTheme: builder.mutation({
      query: ({ themeId, formData }) => ({
        url: `/theme/update/${themeId}`,
        method: "PUT",
        body: formData,
      }),
    }),

    deleteTheme: builder.mutation({
      query: (themeId) => ({
        url: `/theme/delete/${themeId}`,
        method: "DELETE",
      }),
    }),
    getAdminDashboardStats: builder.query({
      query: ({ type, year }) =>
        `/users/admin-dashboard?type=${type}&year=${year}`,
      transformResponse: (response) => response.data,
    }),

    updateHeroBanner: builder.mutation({
      query: (formData) => ({
        url: `/hero-banner/create`,
        method: "POST",
        body: formData,
      }),
    }),
    getHeroBanner: builder.query({
      query: () => "/hero-banner",
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useChangePasswordMutation,
  useGetUserInfoQuery,
  useUploadProfileImageMutation,
  useUpdateProfileMutation,
  useAdminChangePasswordMutation,
  useCreateAboutUsMutation,
  useCreatePrivacyPolicyMutation,
  useCreateTermsConditionsMutation,
  useGetAboutUsQuery,
  useGetPrivacyPolicyQuery,
  useGetTermsConditionsQuery,
  useUpdateAboutUsMutation,
  useUpdatePrivacyPolicyMutation,
  useUpdateTermsConditionsMutation,
  useCreateBookMutation,
  useDeleteBookMutation,
  useGetBooksQuery,
  useGetSingleBookQuery,
  useUpdateBookMutation,
  useGetBlogsQuery,
  useGetSingleBlogQuery,
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useCreateCharacterMutation,
  useGetCharactersQuery,
  useDeleteCharacterMutation,
  useGetSingleCharacterQuery,
  useUpdateCharacterMutation,
  useCreateThemeMutation,
  useDeleteThemeMutation,
  useGetSingleThemeQuery,
  useGetThemesQuery,
  useUpdateThemeMutation,
  useGetAdminDashboardStatsQuery,
  useUpdateHeroBannerMutation,
  useGetHeroBannerQuery,
} = allApi;

export default allApi;
