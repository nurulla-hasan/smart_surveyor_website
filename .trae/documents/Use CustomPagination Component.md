I will replace the manual pagination logic in `BookingsView` with the provided `CustomPagination` component.

### Changes
- **Modify `src/components/bookings/bookings-view.tsx`**:
    - Import `CustomPagination` from `@/components/ui/custom/CustomPagination`.
    - Remove the manual `Pagination`, `PaginationItem`, etc., imports and the `handlePageChange` function.
    - Replace the inline pagination JSX with `<CustomPagination currentPage={meta.currentPage} totalPages={meta.totalPages} />`.

This will streamline the code and use your preferred custom component for consistent pagination across the app.