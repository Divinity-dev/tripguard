import AccommodationDetailPage from "@/component/AccommodationsDetailspage";

export default async function Page({ params }) {
  const { id } = await params;

  return <AccommodationDetailPage id={id} />;
}