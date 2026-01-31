I will implement the "Create Report" feature by adding a button to the report list, and updating the create report page to fetch and populate data from selected bookings.

### 1. Add "Create Report" Button
**File:** `src/app/(dashboard)/reports/page.tsx`
- Add a header section with a "Create Report" button that links to `/reports/new`.
- Ensure it matches the styling of other pages (e.g., Clients page).

### 2. Update Calculation Service
**File:** `src/services/calculations.ts`
- Update `getCalculations` to accept query parameters (e.g., `bookingId`) so we can fetch specific calculations.

### 3. Enhance Create Report View
**File:** `src/components/reports/create-report-view.tsx`
- **Booking Selection Logic**:
  - When a booking is selected, fetch its associated calculation/map data.
  - Populate the form fields (`areaSqFt`, `mouzaName`, `plotNo` etc.) with the fetched data.
- **Calculator Feature**:
  - Add a collapsible or modal "Unit Converter" calculator as requested, to allow manual conversions if needed (in addition to the existing auto-convert fields).
- **PDF Preview**:
  - Ensure the "Live Preview" section updates in real-time as the form is filled (already partially implemented, will refine to match requirements).

### 4. Verification
- Verify that selecting a client loads bookings.
- Verify that selecting a booking loads calculation data.
- Verify that the report saves correctly.
- Verify the PDF preview reflects the data.