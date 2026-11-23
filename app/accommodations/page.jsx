// app/accommodations/page.jsx

import { Suspense } from "react";
import AccommodationsPage from "@/component/AccommodationsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading accommodations...</div>}>
      <AccommodationsPage />
    </Suspense>
  );
}
