import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { baseQueryWithReauth } from "../baseQuery";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // Create Category
    createCategory: builder.mutation({
      query: (body) => ({
        url: "/categories/create",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Category created successfully!");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message ||
            error?.message ||
            "Failed to create category";
          toast.error(errorMessage);
        }
      },
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // Get Categories
    getCategories: builder.query({
      query: ({ page = 1, limit = 10, searchTerm }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (searchTerm) params.set("searchTerm", searchTerm);

        return {
          url: `/categories/all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.length
          ? [
              { type: "Category", id: "LIST" },
              ...result.data.map((c) => ({ type: "Category", id: c._id })),
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    // Get Category by ID
    getCategoryById: builder.query({
      query: (id) => ({
        url: `/categories/details/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Category", id }],
    }),

    // Update Category
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/categories/update/${id}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Category updated successfully!");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message ||
            error?.message ||
            "Failed to update category";
          toast.error(errorMessage);
        }
      },
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),

    // Delete Category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/delete/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Category deleted successfully!");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message ||
            error?.message ||
            "Failed to delete category";
          toast.error(errorMessage);
        }
      },
      invalidatesTags: (_res, _err, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
