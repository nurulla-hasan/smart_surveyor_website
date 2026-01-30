I will update `src/app/(dashboard)/bookings/page.tsx` to use the `SearchParams` type from `@/types/global.type` for better consistency and cleaner code.

### Changes
- **Update `src/app/(dashboard)/bookings/page.tsx`**:
    - Import `SearchParams` from `@/types/global.type`.
    - Use `SearchParams` as the type for the `searchParams` prop in the `BookingsPage` component.
    - Ensure the rest of the logic remains intact as it already handles the `searchParams` as a Promise.

This will make the code more maintainable by using a centralized type definition.