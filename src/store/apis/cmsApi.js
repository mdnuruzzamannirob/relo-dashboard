import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";

const endpoints = {
  aboutUs: "/legal/about-us",
  termsCondition: "/legal/terms-and-conditions",
  privacyPolicy: "/legal/privacy-policy",
  howItWorks: "/legal/how-it-works",
  trustSafety: "/legal/trust-and-safety",
  helpCenter: "/legal/help-center",
  sellingGuide: "/legal/selling-guide",
  buyingGuide: "/legal/buying-guide",
};

export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cms"],
  endpoints: (builder) => ({
    // About Us
    getAboutUs: builder.query({
      query: () => ({
        url: endpoints.aboutUs,
        method: "GET",
      }),
      providesTags: [{ type: "Cms", id: "about-us" }],
    }),
    updateAboutUs: builder.mutation({
      query: (body) => ({
        url: endpoints.aboutUs,
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          cmsApi.util.updateQueryData("getAboutUs", undefined, (draft) => {
            if (draft?.data) {
              draft.data.content = body.content;
            } else if (draft) {
              draft.content = body.content;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Cms", id: "about-us" }],
    }),

    // Terms & Conditions
    getTermsCondition: builder.query({
      query: () => ({
        url: endpoints.termsCondition,
        method: "GET",
      }),
      providesTags: [{ type: "Cms", id: "terms-condition" }],
    }),
    updateTermsCondition: builder.mutation({
      query: (body) => ({
        url: endpoints.termsCondition,
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cmsApi.util.updateQueryData(
            "getTermsCondition",
            undefined,
            (draft) => {
              if (draft?.data) {
                draft.data.content = body.content;
              } else if (draft) {
                draft.content = body.content;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Cms", id: "terms-condition" }],
    }),

    // Privacy Policy
    getPrivacyPolicy: builder.query({
      query: () => ({
        url: endpoints.privacyPolicy,
        method: "GET",
      }),
      providesTags: [{ type: "Cms", id: "privacy-policy" }],
    }),
    updatePrivacyPolicy: builder.mutation({
      query: (body) => ({
        url: endpoints.privacyPolicy,
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cmsApi.util.updateQueryData(
            "getPrivacyPolicy",
            undefined,
            (draft) => {
              if (draft?.data) {
                draft.data.content = body.content;
              } else if (draft) {
                draft.content = body.content;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Cms", id: "privacy-policy" }],
    }),

    // How It Works
    getHowItWorks: builder.query({
      query: () => ({
        url: endpoints.howItWorks,
        method: "GET",
      }),
      providesTags: [{ type: "Cms", id: "how-it-works" }],
    }),
    updateHowItWorks: builder.mutation({
      query: (body) => ({
        url: endpoints.howItWorks,
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cmsApi.util.updateQueryData("getHowItWorks", undefined, (draft) => {
            if (draft?.data) {
              draft.data.content = body.content;
            } else if (draft) {
              draft.content = body.content;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Cms", id: "how-it-works" }],
    }),

    // Trust & Safety
    getTrustSafety: builder.query({
      query: () => ({
        url: endpoints.trustSafety,
        method: "GET",
      }),
      providesTags: [{ type: "Cms", id: "trust-safety" }],
    }),
    updateTrustSafety: builder.mutation({
      query: (body) => ({
        url: endpoints.trustSafety,
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cmsApi.util.updateQueryData("getTrustSafety", undefined, (draft) => {
            if (draft?.data) {
              draft.data.content = body.content;
            } else if (draft) {
              draft.content = body.content;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Cms", id: "trust-safety" }],
    }),

    // Help Center
    getHelpCenter: builder.query({
      query: () => ({
        url: endpoints.helpCenter,
        method: "GET",
      }),
      providesTags: [{ type: "Cms", id: "help-center" }],
    }),
    updateHelpCenter: builder.mutation({
      query: (body) => ({
        url: endpoints.helpCenter,
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cmsApi.util.updateQueryData("getHelpCenter", undefined, (draft) => {
            if (draft?.data) {
              draft.data.content = body.content;
            } else if (draft) {
              draft.content = body.content;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Cms", id: "help-center" }],
    }),

    // Selling Guide
    getSellingGuide: builder.query({
      query: () => ({
        url: endpoints.sellingGuide,
        method: "GET",
      }),
      providesTags: [{ type: "Cms", id: "selling-guide" }],
    }),
    updateSellingGuide: builder.mutation({
      query: (body) => ({
        url: endpoints.sellingGuide,
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cmsApi.util.updateQueryData("getSellingGuide", undefined, (draft) => {
            if (draft?.data) {
              draft.data.content = body.content;
            } else if (draft) {
              draft.content = body.content;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Cms", id: "selling-guide" }],
    }),

    // Buying Guide
    getBuyingGuide: builder.query({
      query: () => ({
        url: endpoints.buyingGuide,
        method: "GET",
      }),
      providesTags: [{ type: "Cms", id: "buying-guide" }],
    }),
    updateBuyingGuide: builder.mutation({
      query: (body) => ({
        url: endpoints.buyingGuide,
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cmsApi.util.updateQueryData("getBuyingGuide", undefined, (draft) => {
            if (draft?.data) {
              draft.data.content = body.content;
            } else if (draft) {
              draft.content = body.content;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Cms", id: "buying-guide" }],
    }),
  }),
});

export const {
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
  useGetTermsConditionQuery,
  useUpdateTermsConditionMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetHowItWorksQuery,
  useUpdateHowItWorksMutation,
  useGetTrustSafetyQuery,
  useUpdateTrustSafetyMutation,
  useGetHelpCenterQuery,
  useUpdateHelpCenterMutation,
  useGetSellingGuideQuery,
  useUpdateSellingGuideMutation,
  useGetBuyingGuideQuery,
  useUpdateBuyingGuideMutation,
} = cmsApi;
