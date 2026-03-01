import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { baseQueryWithReauth } from "../baseQuery";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "AdminOverview",
    "GrowthStat",
    "Users",
    "Products",
    "Orders",
    "PaymentHistory",
  ],
  // Cache data for 5 minutes by default
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    // ─── Admin Overview ───────────────────────────────────────────────────
    getAdminOverview: builder.query({
      query: () => ({ url: "/admin/overview", method: "GET" }),
      providesTags: [{ type: "AdminOverview", id: "OVERVIEW" }],
      keepUnusedDataFor: 60,
    }),

    // ─── Growth Statistic ─────────────────────────────────────────────────
    // type: "user" | "revenue"   year: number
    getGrowthStatistic: builder.query({
      query: ({ type = "user", year }) => {
        const params = new URLSearchParams({ type, year: String(year) });
        return {
          url: `/admin/growth-statistic?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (_res, _err, { type, year }) => [
        { type: "GrowthStat", id: `${type}-${year}` },
      ],
      keepUnusedDataFor: 120,
    }),

    // ─── Get All Users ────────────────────────────────────────────────────
    // status: "ACTIVE" | "INACTIVE" | "ALL" | "BLOCKED"
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, status = "ALL", searchTerm } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (status && status !== "ALL") params.set("status", status);
        else params.set("status", "ALL");
        if (searchTerm) params.set("searchTerm", searchTerm);
        return { url: `/admin/all-users?${params.toString()}`, method: "GET" };
      },
      providesTags: (result) =>
        result?.data?.result?.length
          ? [
              { type: "Users", id: "LIST" },
              ...result.data.result.map((u) => ({ type: "Users", id: u.id })),
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    // ─── User Action ──────────────────────────────────────────────────────
    // status: "ACTIVE" | "INACTIVE" | "SUSPENDED"
    updateUserAction: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/admin/user-action/${userId}`,
        method: "PUT",
        body: { status },
      }),
      async onQueryStarted({ status }, { queryFulfilled }) {
        try {
          await queryFulfilled;
          const label =
            status === "ACTIVE"
              ? "activated"
              : status === "INACTIVE"
                ? "deactivated"
                : "suspended";
          toast.success(`User ${label} successfully!`);
        } catch (error) {
          const msg =
            error?.error?.data?.message ||
            error?.message ||
            "Failed to update user status";
          toast.error(msg);
        }
      },
      invalidatesTags: [
        { type: "Users", id: "LIST" },
        { type: "AdminOverview", id: "OVERVIEW" },
      ],
    }),

    // ─── All Products ─────────────────────────────────────────────────────
    // isAvailable: boolean | undefined   isSold: boolean | undefined
    getAllProducts: builder.query({
      query: ({
        page = 1,
        limit = 8,
        searchTerm,
        isAvailable,
        isSold,
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (searchTerm) params.set("searchTerm", searchTerm);
        if (isAvailable !== undefined)
          params.set("isAvailable", String(isAvailable));
        if (isSold !== undefined) params.set("isSold", String(isSold));
        return {
          url: `/admin/all-products?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.result?.length
          ? [
              { type: "Products", id: "LIST" },
              ...result.data.result.map((p) => ({
                type: "Products",
                id: p.id,
              })),
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // ─── All Orders ───────────────────────────────────────────────────────
    // status: "PROCESSING" | "READY" | "COMPLETED" | "ALL"
    // sortOrder: "asc" | "desc"
    getAllOrders: builder.query({
      query: ({
        page = 1,
        limit = 8,
        searchTerm,
        status = "ALL",
        sortOrder = "desc",
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        params.set("sortOrder", sortOrder);
        if (searchTerm) params.set("searchTerm", searchTerm);
        if (status && status !== "ALL") params.set("status", status);
        return {
          url: `/admin/all-orders?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.result?.length
          ? [
              { type: "Orders", id: "LIST" },
              ...result.data.result.map((o) => ({ type: "Orders", id: o.id })),
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    // ─── All Payment History ─────────────────────────────────────────────
    // sortOrder: "asc" | "desc"
    getAllPaymentHistory: builder.query({
      query: ({ page = 1, limit = 8, searchTerm, sortOrder = "desc" } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        params.set("sortOrder", sortOrder);
        if (searchTerm) params.set("searchTerm", searchTerm);

        return {
          url: `/admin/all-payment-history?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.result?.length
          ? [
              { type: "PaymentHistory", id: "LIST" },
              ...result.data.result.map((p) => ({
                type: "PaymentHistory",
                id: p.id,
              })),
            ]
          : [{ type: "PaymentHistory", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useGetGrowthStatisticQuery,
  useGetAllUsersQuery,
  useUpdateUserActionMutation,
  useGetAllProductsQuery,
  useGetAllOrdersQuery,
  useGetAllPaymentHistoryQuery,
} = adminApi;
