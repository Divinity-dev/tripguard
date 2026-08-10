"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BookStayModal from "./BookStayModal";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  House,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
  Sparkles,
  LockKeyhole,
  Phone,
} from "lucide-react";

const accommodations = {
  "the-meridian-house": {
    name: "The Meridian House",
    location: "Victoria Island, Lagos",
    price: "₦185,000",
    rating: "4.9",
    reviews: 128,

    description:
      "A refined stay in the heart of Victoria Island, The Meridian House combines contemporary comfort with a peaceful atmosphere. Whether you're travelling for business, leisure, or a short escape, everything you need for a comfortable stay is close by.",

    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=90",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=90",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=90",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=90",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=90",
    ],

    propertyType: "Luxury Hotel",
    guests: "2 guests",
    bedrooms: "1 bedroom",
    beds: "1 king bed",
    bathrooms: "1 bathroom",

    amenities: [
      {
        icon: Wifi,
        title: "Free Wi-Fi",
        description: "High-speed internet throughout the property",
      },
      {
        icon: Car,
        title: "Free parking",
        description: "Secure on-site parking available",
      },
      {
        icon: Utensils,
        title: "Restaurant",
        description: "On-site dining and room service",
      },
      {
        icon: Dumbbell,
        title: "Fitness centre",
        description: "Fully equipped fitness facilities",
      },
      {
        icon: Waves,
        title: "Swimming pool",
        description: "Outdoor swimming pool",
      },
      {
        icon: Sparkles,
        title: "Daily cleaning",
        description: "Professional housekeeping service",
      },
    ],

    reviewsList: [
      {
        name: "Amaka Okafor",
        location: "Lagos, Nigeria",
        initials: "AO",
        rating: 5,
        date: "2 weeks ago",
        text:
          "Everything about my stay was excellent. The room was clean, spacious and exactly as described. I especially loved how peaceful the environment felt despite being in the middle of Victoria Island.",
      },
      {
        name: "Daniel Williams",
        location: "Abuja, Nigeria",
        initials: "DW",
        rating: 5,
        date: "1 month ago",
        text:
          "The staff were incredibly helpful and the whole check-in process was smooth. I also really appreciated the TripGuard safety feature. It gave my family peace of mind while I was away.",
      },
      {
        name: "Sarah Adeyemi",
        location: "Port Harcourt, Nigeria",
        initials: "SA",
        rating: 5,
        date: "2 months ago",
        text:
          "Beautiful property with great facilities. The bed was extremely comfortable and the location made it easy to get around Lagos. I would definitely stay here again.",
      },
    ],

    rules: [
      "Check-in from 2:00 PM",
      "Check-out before 12:00 PM",
      "No smoking indoors",
      "Pets are not allowed",
      "Valid identification required",
    ],
  },

  "palm-court-residence": {
    name: "Palm Court Residence",
    location: "Lekki Phase 1, Lagos",
    price: "₦95,000",
    rating: "4.8",
    reviews: 94,

    description:
      "Palm Court Residence offers a stylish and comfortable escape in Lekki Phase 1, with modern interiors, thoughtful amenities and easy access to some of Lagos's most popular destinations.",

    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=90",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=90",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=90",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=90",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=90",
    ],

    propertyType: "Serviced Apartment",
    guests: "2 guests",
    bedrooms: "1 bedroom",
    beds: "1 king bed",
    bathrooms: "1 bathroom",

    amenities: [
      {
        icon: Wifi,
        title: "Free Wi-Fi",
        description: "Fast and reliable internet",
      },
      {
        icon: Car,
        title: "Parking",
        description: "Secure parking available",
      },
      {
        icon: Utensils,
        title: "Kitchen",
        description: "Fully equipped kitchen",
      },
      {
        icon: Sparkles,
        title: "Housekeeping",
        description: "Regular cleaning service",
      },
    ],

    reviewsList: [
      {
        name: "Chinedu Okoro",
        location: "Enugu, Nigeria",
        initials: "CO",
        rating: 5,
        date: "3 weeks ago",
        text:
          "A really beautiful apartment in a great location. Everything was clean and well organised when I arrived.",
      },
      {
        name: "Fatima Bello",
        location: "Kano, Nigeria",
        initials: "FB",
        rating: 5,
        date: "1 month ago",
        text:
          "I had a wonderful stay. The apartment felt like home and the host was very responsive.",
      },
    ],

    rules: [
      "Check-in from 2:00 PM",
      "Check-out before 12:00 PM",
      "No smoking indoors",
      "No parties or events",
      "Valid identification required",
    ],
  },

  "cedar-view-suites": {
    name: "Cedar View Suites",
    location: "Wuse 2, Abuja",
    price: "₦120,000",
    rating: "4.9",
    reviews: 76,

    description:
      "Cedar View Suites provides a calm and sophisticated stay in Wuse 2. Designed for travellers who value comfort and convenience, the property offers modern rooms and easy access to major parts of Abuja.",

    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=90",
      "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1200&q=90",
      "https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=1200&q=90",
    ],

    propertyType: "Boutique Hotel",
    guests: "2 guests",
    bedrooms: "1 bedroom",
    beds: "1 king bed",
    bathrooms: "1 bathroom",

    amenities: [
      {
        icon: Wifi,
        title: "Free Wi-Fi",
        description: "High-speed internet",
      },
      {
        icon: Car,
        title: "Free parking",
        description: "Secure on-site parking",
      },
      {
        icon: Utensils,
        title: "Restaurant",
        description: "Breakfast and dining available",
      },
      {
        icon: Waves,
        title: "Swimming pool",
        description: "Outdoor swimming pool",
      },
      {
        icon: Sparkles,
        title: "Housekeeping",
        description: "Daily room cleaning",
      },
    ],

    reviewsList: [
      {
        name: "David James",
        location: "Lagos, Nigeria",
        initials: "DJ",
        rating: 5,
        date: "2 weeks ago",
        text:
          "One of the best stays I've had in Abuja. The room was spotless and the staff were very professional.",
      },
      {
        name: "Grace Nwosu",
        location: "Owerri, Nigeria",
        initials: "GN",
        rating: 5,
        date: "6 weeks ago",
        text:
          "Very comfortable and peaceful. The location is excellent and the facilities were exactly what I needed.",
      },
    ],

    rules: [
      "Check-in from 2:00 PM",
      "Check-out before 12:00 PM",
      "No smoking indoors",
      "Pets are not allowed",
      "Valid identification required",
    ],
  },
};

const AccommodationDetailPage = ({ id }) => {
  const accommodation = accommodations[id];
  const [activeImage, setActiveImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  const handleBookSubmit = () => {
    setBookModalOpen(false);
  };

  if (!accommodation) {
    return (
      <main className="min-h-screen bg-[#F7F6F0]">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5">
          <div className="text-center">
            <House className="mx-auto h-12 w-12 text-[#397A69]" />

            <h1 className="mt-5 text-3xl font-semibold text-[#172322]">
              Accommodation not found
            </h1>

            <p className="mt-3 text-[#75817D]">
              The accommodation you're looking for doesn't exist.
            </p>

            <Link
              href="/accommodations"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#173C37] px-5 py-3 text-sm font-semibold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to accommodations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const nextImage = () => {
    setActiveImage((current) =>
      current === accommodation.images.length - 1 ? 0 : current + 1
    );
  };

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0 ? accommodation.images.length - 1 : current - 1
    );
  };

  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#172322]">

      {/* TOP NAV */}
      <div className="border-b border-[#E4E3DC] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/accommodations"
            className="flex items-center gap-2 text-sm font-semibold text-[#397A69] transition hover:text-[#173C37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to accommodations
          </Link>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-[#E2E1DA] bg-white px-4 py-2 text-sm font-medium transition hover:bg-[#F7F6F0]"
          >
            <Heart className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>

      {/* IMAGE GALLERY */}
      <section className="mx-auto max-w-7xl px-5 pt-6 lg:px-8">
        <div className="relative grid h-[420px] gap-2 overflow-hidden rounded-[28px] lg:h-[540px] lg:grid-cols-2">

          {/* MAIN IMAGE */}
          <button
            type="button"
            onClick={() => setShowGallery(true)}
            className="relative overflow-hidden lg:rounded-l-[28px]"
          >
            <Image
              src={accommodation.images[0]}
              alt={accommodation.name}
              fill
              priority
              className="object-cover transition duration-500 hover:scale-105"
            />
          </button>

          {/* SMALL IMAGES */}
          <div className="hidden grid-cols-2 gap-2 lg:grid">
            {accommodation.images.slice(1, 5).map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => {
                  setActiveImage(index + 1);
                  setShowGallery(true);
                }}
                className="relative overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${accommodation.name} ${index + 2}`}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />

                {index === 3 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#173C37]">
                      View all photos
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* MOBILE GALLERY BUTTON */}
          <button
            type="button"
            onClick={() => setShowGallery(true)}
            className="absolute bottom-4 right-4 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#173C37] shadow-lg lg:hidden"
          >
            View all photos
          </button>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* LEFT */}
          <div>

            {/* TITLE */}
            <div className="border-b border-[#E1E0D9] pb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#E1F5ED] px-3 py-1.5 text-xs font-bold text-[#277765]">
                  {accommodation.propertyType}
                </span>

                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#173C37]">
                  <Star className="h-4 w-4 fill-[#F3C95D] text-[#F3C95D]" />
                  {accommodation.rating}
                </div>

                <span className="text-sm text-[#7A8581]">
                  {accommodation.reviews} reviews
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {accommodation.name}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-sm text-[#75817D]">
                <MapPin className="h-4 w-4 text-[#397A69]" />
                {accommodation.location}
              </div>
            </div>

            {/* QUICK INFO */}
            <div className="grid grid-cols-2 gap-4 border-b border-[#E1E0D9] py-8 sm:grid-cols-4">
              <div>
                <Users className="h-5 w-5 text-[#397A69]" />
                <p className="mt-3 text-sm font-semibold">
                  {accommodation.guests}
                </p>
                <p className="mt-1 text-xs text-[#7A8581]">
                  Capacity
                </p>
              </div>

              <div>
                <House className="h-5 w-5 text-[#397A69]" />
                <p className="mt-3 text-sm font-semibold">
                  {accommodation.bedrooms}
                </p>
                <p className="mt-1 text-xs text-[#7A8581]">
                  Bedrooms
                </p>
              </div>

              <div>
                <div className="flex h-5 items-center text-lg text-[#397A69]">
                  🛏
                </div>
                <p className="mt-3 text-sm font-semibold">
                  {accommodation.beds}
                </p>
                <p className="mt-1 text-xs text-[#7A8581]">
                  Sleeping
                </p>
              </div>

              <div>
                <div className="flex h-5 items-center text-lg text-[#397A69]">
                  🚿
                </div>
                <p className="mt-3 text-sm font-semibold">
                  {accommodation.bathrooms}
                </p>
                <p className="mt-1 text-xs text-[#7A8581]">
                  Bathrooms
                </p>
              </div>
            </div>

            {/* ABOUT */}
            <section className="border-b border-[#E1E0D9] py-10">
              <h2 className="text-2xl font-semibold">
                About this stay
              </h2>

              <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#596661]">
                {accommodation.description}
              </p>
            </section>

            {/* AMENITIES */}
            <section className="border-b border-[#E1E0D9] py-10">
              <h2 className="text-2xl font-semibold">
                What this place offers
              </h2>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                {accommodation.amenities.map((amenity) => {
                  const Icon = amenity.icon;

                  return (
                    <div
                      key={amenity.title}
                      className="flex gap-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E1F5ED] text-[#277765]">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">
                          {amenity.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-[#7A8581]">
                          {amenity.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* TRIPGUARD SAFETY */}
            <section className="border-b border-[#E1E0D9] py-10">
              <div className="rounded-[28px] bg-[#173C37] p-7 text-white sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#63E6BE]/15">
                    <ShieldCheck className="h-7 w-7 text-[#63E6BE]" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
                      TripGuard protection
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold">
                      Stay comfortable. Stay connected.
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-white/65">
                      When you check in, you can choose someone you trust
                      to receive your stay information. When you check out,
                      they'll know you're safely on your way.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/75">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#63E6BE]" />
                        Trusted contact notifications
                      </div>

                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#63E6BE]" />
                        Check-in confirmation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* REVIEWS */}
            <section className="border-b border-[#E1E0D9] py-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-[#F3C95D] text-[#F3C95D]" />
                    <span className="text-xl font-bold">
                      {accommodation.rating}
                    </span>

                    <span className="text-sm text-[#7A8581]">
                      · {accommodation.reviews} reviews
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold">
                    What guests are saying
                  </h2>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {accommodation.reviewsList.map((review) => (
                  <article
                    key={review.name}
                    className="rounded-2xl border border-[#E5E4DD] bg-white p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173C37] text-sm font-semibold text-[#63E6BE]">
                          {review.initials}
                        </div>

                        <div>
                          <p className="font-semibold">
                            {review.name}
                          </p>

                          <p className="mt-0.5 text-xs text-[#7A8581]">
                            {review.location}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-[#8A9390]">
                        {review.date}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]"
                        />
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[#596661]">
                      “{review.text}”
                    </p>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-xl border border-[#173C37] py-3 text-sm font-semibold text-[#173C37] transition hover:bg-[#173C37] hover:text-white"
              >
                View all {accommodation.reviews} reviews
              </button>
            </section>

            {/* LOCATION */}
            <section className="border-b border-[#E1E0D9] py-10">
              <h2 className="text-2xl font-semibold">
                Where you'll be
              </h2>

              <div className="mt-6 overflow-hidden rounded-[24px] border border-[#E2E1DA] bg-white">
                <div className="flex h-[280px] items-center justify-center bg-[#E1E8E4]">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#173C37] text-white shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>

                    <p className="mt-4 font-semibold">
                      {accommodation.location}
                    </p>

                    <p className="mt-1 text-sm text-[#75817D]">
                      Exact location provided after booking
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm leading-6 text-[#596661]">
                    Located in {accommodation.location}, with convenient
                    access to restaurants, shops, entertainment and major
                    roads.
                  </p>
                </div>
              </div>
            </section>

            {/* HOUSE RULES */}
            <section className="py-10">
              <h2 className="text-2xl font-semibold">
                House rules & policies
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {accommodation.rules.map((rule) => (
                  <div
                    key={rule}
                    className="flex items-center gap-3 text-sm text-[#596661]"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E1F5ED]">
                      <Check className="h-3.5 w-3.5 text-[#277765]" />
                    </div>

                    {rule}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* BOOKING CARD */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-[28px] border border-[#E1E0D9] bg-white p-6 shadow-xl sm:p-7">

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl font-bold text-[#173C37]">
                    {accommodation.price}
                  </span>

                  <span className="text-sm text-[#7A8581]">
                    {" "}
                    / night
                  </span>
                </div>

                <div className="flex items-center gap-1 text-sm font-semibold">
                  <Star className="h-4 w-4 fill-[#F3C95D] text-[#F3C95D]" />
                  {accommodation.rating}
                </div>
              </div>

              {/* DATES */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-[#DCDDD6]">
                <div className="grid grid-cols-2">
                  <div className="border-r border-[#DCDDD6] p-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#397A69]" />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                        Check in
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      Add date
                    </p>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#397A69]" />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                        Check out
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      Add date
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#DCDDD6] p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#397A69]" />

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                      Guests
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold">
                    2 guests
                  </p>
                </div>
              </div>

              {/* BOOK */}
              <button
                type="button"
                onClick={() => setBookModalOpen(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-4 font-semibold text-white transition hover:bg-[#23584E]"
              >
                <ShieldCheck className="h-5 w-5 text-[#63E6BE]" />
                Book
              </button>

              <p className="mt-3 text-center text-xs text-[#8A9390]">
                You won't be charged yet
              </p>

              {/* SAFETY NOTE */}
              <div className="mt-6 rounded-2xl bg-[#F0F7F4] p-4">
                <div className="flex gap-3">
                  <LockKeyhole className="h-5 w-5 shrink-0 text-[#397A69]" />

                  <div>
                    <p className="text-sm font-semibold text-[#173C37]">
                      Your safety comes first
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#6E7B76]">
                      TripGuard can notify your trusted contact when you
                      check in and check out.
                    </p>
                  </div>
                </div>
              </div>

              {/* PROPERTY INFO */}
              <div className="mt-6 border-t border-[#ECEBE5] pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7A8581]">
                  Need help?
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E1F5ED]">
                    <Phone className="h-4 w-4 text-[#277765]" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      TripGuard support
                    </p>

                    <p className="mt-0.5 text-xs text-[#7A8581]">
                      Available to help with your stay
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* FULLSCREEN GALLERY */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07110F]/95 p-5">
          <button
            type="button"
            onClick={() => setShowGallery(false)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close gallery"
          >
            ✕
          </button>

          <div className="relative h-[75vh] w-full max-w-6xl">
            <Image
              src={accommodation.images[activeImage]}
              alt={accommodation.name}
              fill
              className="object-contain"
            />

            <button
              type="button"
              onClick={previousImage}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#173C37] shadow-xl"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#173C37] shadow-xl"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
              {activeImage + 1} / {accommodation.images.length}
            </div>
          </div>
        </div>
      )}

      <BookStayModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSubmit={handleBookSubmit}
      />
    </main>
  );
};

export default AccommodationDetailPage;