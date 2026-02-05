I will refactor the bookings feature to be cleaner, type-safe, and fully support server-side pagination and filtering as requested.

### 1. Type Safety Improvements
- **Update `src/services/bookings.ts`**: Replace `Promise<any>` with `Promise<GetBookingsResponse | null>` to ensure type safety across the application.

### 2. Server-Side Logic Refinement (`src/app/(dashboard)/bookings/page.tsx`)
- **Dynamic Pagination**: Parse `page` and `limit` from URL search parameters (defaulting to 1 and 10).
- **Cleaner Fetching**: Pass these parameters to the `getBookings` service instead of hardcoded values.
- **Data Passing**: Pass the full `meta` object (total items, pages, etc.) to the client component.

### 3. Client-Side UI Enhancements (`src/components/bookings/bookings-view.tsx`)
- **Pagination Controls**: Integrate the existing `Pagination` component to allow navigating through pages.
- **Smart Filtering**: Use `useSmartFilter` to handle page changes, ensuring filters (tab, date) are preserved while navigating.
- **Meta Integration**: Update props to accept and use the `meta` object for pagination logic.

### 4. Implementation Details
- **Pagination Component**: I will use the existing `src/components/ui/pagination.tsx` for a consistent UI.
- **Clean Code**: Remove hardcoded "50" limit and ensure the code follows the "clean way" standard.

This approach ensures that all filters (status, date) and pagination work harmoniously with the API response structure you provided.