import AccommodationDetailPage from "@/component/AccommodationsDetailspage";

const Page = async ({ params }) => {
  const { slug } = await params;

  return <AccommodationDetailPage slug={slug} />;
};

export default Page;