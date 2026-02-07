import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { baseQueryWithReauth } from "../baseQuery";

export const lockerAddressApi = createApi({
  reducerPath: "lockerAddressApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["LockerAddress"],
  endpoints: (builder) => ({
    createLockerAddress: builder.mutation({
      query: (body) => ({
        url: "/locker-address/create",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Locker address created successfully!");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message ||
            error?.message ||
            "Failed to create locker address";
          toast.error(errorMessage);
        }
      },
      invalidatesTags: [{ type: "LockerAddress", id: "LIST" }],
    }),

    getLockerAddresses: builder.query({
      query: ({ page = 1, limit = 10, searchTerm }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (searchTerm) params.set("searchTerm", searchTerm);

        return {
          url: `/locker-address/all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.lockerAddresses?.length
          ? [
              { type: "LockerAddress", id: "LIST" },
              ...result.data.lockerAddresses.map((l) => ({
                type: "LockerAddress",
                id: l._id,
              })),
            ]
          : [{ type: "LockerAddress", id: "LIST" }],
    }),

    getLockerAddressById: builder.query({
      query: (id) => ({
        url: `/locker-address/details/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "LockerAddress", id }],
    }),

    updateLockerAddress: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/locker-address/update/${id}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Locker address updated successfully!");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message ||
            error?.message ||
            "Failed to update locker address";
          toast.error(errorMessage);
        }
      },
      invalidatesTags: (_res, _err, { id }) => [
        { type: "LockerAddress", id },
        { type: "LockerAddress", id: "LIST" },
      ],
    }),

    deleteLockerAddress: builder.mutation({
      query: (id) => ({
        url: `/locker-address/delete/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Locker address deleted successfully!");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message ||
            error?.message ||
            "Failed to delete locker address";
          toast.error(errorMessage);
        }
      },
      invalidatesTags: (_res, _err, id) => [
        { type: "LockerAddress", id },
        { type: "LockerAddress", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateLockerAddressMutation,
  useGetLockerAddressesQuery,
  useGetLockerAddressByIdQuery,
  useUpdateLockerAddressMutation,
  useDeleteLockerAddressMutation,
} = lockerAddressApi;
