"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getStatesData } from "nigeria-state-lga-data";

import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Heart,
  Wifi,
  Car,
  Utensils,
  Waves,
  Sparkles,
  Users,
  ChevronDown,
  X,
  ShieldCheck,
} from "lucide-react";

const nigeriaStatesData = getStatesData();

const accommodations = [
  {
    id: "the-meridian-house",
    name: "The Meridian House",
    location: "Victoria Island, Lagos",
    price: 185000,
    rating: 4.9,
    reviews: 128,
    type: "Luxury Hotel",
    guests: 2,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=90",
    amenities: ["Wi-Fi", "Parking", "Restaurant", "Pool"],
    description:
      "A refined stay in the heart of Victoria Island with contemporary comfort and a peaceful atmosphere.",
  },

  {
    id: "palm-court-residence",
    name: "Palm Court Residence",
    location: "Lekki Phase 1, Lagos",
    price: 95000,
    rating: 4.8,
    reviews: 94,
    type: "Serviced Apartment",
    guests: 2,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
    amenities: ["Wi-Fi", "Parking", "Kitchen", "Housekeeping"],
    description:
      "A stylish and comfortable serviced apartment close to some of Lagos's most popular destinations.",
  },

  {
    id: "cedar-view-suites",
    name: "Cedar View Suites",
    location: "Wuse 2, Abuja",
    price: 120000,
    rating: 4.9,
    reviews: 76,
    type: "Boutique Hotel",
    guests: 2,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=90",
    amenities: ["Wi-Fi", "Parking", "Restaurant", "Pool"],
    description:
      "A calm and sophisticated stay in Wuse 2, designed for travellers who value comfort and convenience.",
  },

  {
    id: "lagoon-view-resort",
    name: "Lagoon View Resort",
    location: "Ikoyi, Lagos",
    price: 250000,
    rating: 4.9,
    reviews: 143,
    type: "Resort",
    guests: 4,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=90",
    amenities: ["Wi-Fi", "Pool", "Restaurant", "Parking"],
    description:
      "A premium waterfront escape offering beautiful surroundings, exceptional service and modern facilities.",
  },

  {
    id: "greenfield-apartments",
    name: "Greenfield Apartments",
    location: "Yaba, Lagos",
    price: 45000,
    rating: 4.6,
    reviews: 61,
    type: "Apartment",
    guests: 3,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=90",
    amenities: ["Wi-Fi", "Kitchen", "Parking"],
    description:
      "A comfortable and affordable apartment for travellers looking for convenience in Lagos.",
  },

  {
    id: "royal-garden-villa",
    name: "Royal Garden Villa",
    location: "Maitama, Abuja",
    price: 350000,
    rating: 5.0,
    reviews: 48,
    type: "Villa",
    guests: 6,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=90",
    amenities: ["Wi-Fi", "Pool", "Parking", "Kitchen"],
    description:
      "An elegant private villa offering spacious living areas, premium amenities and complete privacy.",
  },

  {
    id: "sunrise-guest-house",
    name: "Sunrise Guest House",
    location: "GRA, Port Harcourt",
    price: 30000,
    rating: 4.5,
    reviews: 39,
    type: "Guest House",
    guests: 2,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=90",
    amenities: ["Wi-Fi", "Parking", "Housekeeping"],
    description:
      "A welcoming guest house offering clean rooms and convenient access to major parts of Port Harcourt.",
  },

  {
    id: "the-haven-lodge",
    name: "The Haven Lodge",
    location: "Asokoro, Abuja",
    price: 70000,
    rating: 4.7,
    reviews: 82,
    type: "Lodge",
    guests: 2,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=90",
    amenities: ["Wi-Fi", "Restaurant", "Parking"],
    description:
      "A peaceful lodge in Asokoro with comfortable rooms and easy access to central Abuja.",
  },
];

const priceRanges = [
  {
    label: "₦10,000 – ₦50,000",
    min: 10000,
    max: 50000,
  },
  {
    label: "₦50,000 – ₦100,000",
    min: 50000,
    max: 100000,
  },
  {
    label: "₦100,000 – ₦200,000",
    min: 100000,
    max: 200000,
  },
  {
    label: "₦200,000 – ₦500,000",
    min: 200000,
    max: 500000,
  },
];

const accommodationTypes = [
  "All types",
  "Hotel",
  "Luxury Hotel",
  "Boutique Hotel",
  "Serviced Apartment",
  "Apartment",
  "Resort",
  "Villa",
  "Guest House",
  "Lodge",
];



const formatPrice = (price) => {
  return `₦${price.toLocaleString()}`;
};

const AccommodationsPage = () => {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [type, setType] = useState("All types");
  const [guests, setGuests] = useState("Any number");
  const [sort, setSort] = useState("Recommended");

  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [lga, setLga] = useState("");

  const selectedStateRecord = nigeriaStatesData.find(
    (countryState) => countryState.name === state
  );

  const cityOptions = selectedStateRecord?.towns ?? [];
  const lgaOptions = selectedStateRecord?.lgas ?? [];

  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState([]);

  const filteredAccommodations = useMemo(() => {
    let results = accommodations.filter((accommodation) => {
      const searchValue = search.toLowerCase().trim();
      const matchesState =
  !state ||
  accommodation.location
    .toLowerCase()
    .includes(state.toLowerCase());

const matchesCity =
  !city ||
  accommodation.location
    .toLowerCase()
    .includes(city.toLowerCase());

const matchesLga =
  !lga ||
  accommodation.location
    .toLowerCase()
    .includes(lga.toLowerCase());

      const matchesSearch =
        !searchValue ||
        accommodation.name.toLowerCase().includes(searchValue) ||
        accommodation.location.toLowerCase().includes(searchValue) ||
        accommodation.type.toLowerCase().includes(searchValue);

      const selectedRange = priceRanges.find(
        (range) => range.label === priceRange
      );

      const matchesPrice =
        priceRange === "all" ||
        (accommodation.price >= selectedRange.min &&
          accommodation.price <= selectedRange.max);

      const matchesType =
        type === "All types" ||
        accommodation.type.toLowerCase().includes(type.toLowerCase());

      const matchesGuests =
        guests === "Any number" ||
        accommodation.guests >= Number(guests);

      return (
  matchesSearch &&
  matchesPrice &&
  matchesType &&
  matchesGuests &&
  matchesState &&
  matchesCity &&
  matchesLga
);
    });

    if (sort === "Price: Low to high") {
      results.sort((a, b) => a.price - b.price);
    }

    if (sort === "Price: High to low") {
      results.sort((a, b) => b.price - a.price);
    }

    if (sort === "Highest rated") {
      results.sort((a, b) => b.rating - a.rating);
    }

    return results;
  }, [search, priceRange, type, guests, sort, state, city, lga]);

  const toggleSaved = (id) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

 const clearFilters = () => {
  setSearch("");
  setPriceRange("all");
  setType("All types");
  setGuests("Any number");
  setSort("Recommended");
  setState("");
  setCity("");
  setLga("");
};

  const hasActiveFilters =
  search ||
  priceRange !== "all" ||
  type !== "All types" ||
  guests !== "Any number" ||
  state ||
  city ||
  lga;

    

  return (
    <main className="min-h-screen bg-[#F8F8F4] text-[#172322]">

      {/* PAGE HEADER */}
      <section className="bg-[#173C37]">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-12 lg:px-8 lg:pb-16 lg:pt-14">

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-[#63E6BE]">
              <ShieldCheck className="h-4 w-4" />
              Safer stays with TripGuard
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find a stay that feels right.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              Explore comfortable stays across Nigeria, compare your
              options and choose a place that fits your trip.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-9 rounded-[28px] border border-white/20 bg-white p-3 shadow-2xl">
            <div className="grid gap-3 lg:grid-cols-[2fr_1.2fr_auto]">
              <div className="rounded-2xl bg-[#F7F7F3] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#397A69]" />

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8581]">
                      Location
                    </p>

                    <p className="text-xs text-[#9AA29F]">
                      Where are you staying?
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="relative">
                    <select
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setCity("");
                        setLga("");
                      }}
                      className="h-11 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                    >
                      <option value="">State</option>
                      {nigeriaStatesData.map((countryState) => (
                        <option key={countryState.name} value={countryState.name}>
                          {countryState.name}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />
                  </div>

                  <div className="relative">
                    <select
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setLga("");
                      }}
                      disabled={!state}
                      className="h-11 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition disabled:cursor-not-allowed disabled:bg-[#F3F4F1] disabled:text-[#A0A8A5] focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                    >
                      <option value="">City</option>
                      {cityOptions.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />
                  </div>

                  <div className="relative">
                    <select
                      value={lga}
                      onChange={(e) => setLga(e.target.value)}
                      disabled={!state}
                      className="h-11 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition disabled:cursor-not-allowed disabled:bg-[#F3F4F1] disabled:text-[#A0A8A5] focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                    >
                      <option value="">LGA</option>
                      {lgaOptions.map((lgaName) => (
                        <option key={lgaName} value={lgaName}>
                          {lgaName}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#F7F7F3] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#E1F5ED] text-xs font-bold text-[#397A69]">
                    ₦
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8581]">
                      Price range
                    </p>

                    <p className="text-xs text-[#9AA29F]">
                      Per night
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                  >
                    <option value="all">Any price</option>
                    {priceRanges.map((range) => (
                      <option value={range.label} key={range.label}>
                        {range.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="flex min-h-[90px] items-center justify-center gap-2 rounded-2xl bg-[#173C37] px-8 font-semibold text-white transition hover:bg-[#23584E] lg:min-h-full"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        {/* TOP CONTROLS */}
        <div className="flex flex-col gap-5 border-b border-[#E2E1DA] pb-7 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              Explore stays
            </h2>

            <p className="mt-1 text-sm text-[#7A8581]">
              {filteredAccommodations.length}{" "}
              {filteredAccommodations.length === 1
                ? "accommodation"
                : "accommodations"}{" "}
              available
            </p>
          </div>

          <div className="flex items-center gap-3">

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-[#397A69] transition hover:text-[#173C37]"
              >
                Clear filters
              </button>
            )}

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-xl border border-[#DCDDD6] bg-white py-3 pl-4 pr-10 text-sm font-medium outline-none transition focus:border-[#397A69]"
              >
                <option>Recommended</option>
                <option>Highest rated</option>
                <option>Price: Low to high</option>
                <option>Price: High to low</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />
            </div>

          </div>
        </div>

        {/* ACTIVE FILTERS */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 py-5">

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                Search: {search}
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {priceRange !== "all" && (
              <button
                type="button"
                onClick={() => setPriceRange("all")}
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                {priceRange}
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {type !== "All types" && (
              <button
                type="button"
                onClick={() => setType("All types")}
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                {type}
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {guests !== "Any number" && (
              <button
                type="button"
                onClick={() => setGuests("Any number")}
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                {guests}+ guests
                <X className="h-3.5 w-3.5" />
              </button>
            )}

          </div>
        )}

        {/* ACCOMMODATION GRID */}
        {filteredAccommodations.length > 0 ? (
          <div className="grid gap-x-6 gap-y-10 pt-8 sm:grid-cols-2 lg:grid-cols-3">

            {filteredAccommodations.map((accommodation) => {
              const isSaved = saved.includes(accommodation.id);

              return (
                <article
                  key={accommodation.id}
                  className="group overflow-hidden rounded-[24px] border border-[#E4E3DC] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* IMAGE */}
                  <div className="relative aspect-[4/3] overflow-hidden">

                    <Link href={`/accommodations/${accommodation.id}`}>
                      <Image
                        src={accommodation.image}
                        alt={accommodation.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </Link>

                    {/* TYPE */}
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#173C37] shadow-sm">
                        {accommodation.type}
                      </span>
                    </div>

                    {/* SAVE */}
                    <button
                      type="button"
                      onClick={() => toggleSaved(accommodation.id)}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105"
                      aria-label={
                        isSaved
                          ? "Remove from saved"
                          : "Save accommodation"
                      }
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isSaved
                            ? "fill-[#397A69] text-[#397A69]"
                            : "text-[#173C37]"
                        }`}
                      />
                    </button>

                  </div>

                  {/* CARD CONTENT */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-4">

                      <Link
                        href={`/accommodations/${accommodation.id}`}
                        className="min-w-0"
                      >
                        <h3 className="truncate text-lg font-semibold text-[#172322] transition group-hover:text-[#397A69]">
                          {accommodation.name}
                        </h3>

                        <div className="mt-2 flex items-center gap-1.5 text-sm text-[#7A8581]">
                          <MapPin className="h-3.5 w-3.5 text-[#397A69]" />
                          {accommodation.location}
                        </div>
                      </Link>

                      <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#173C37]">
                        <Star className="h-4 w-4 fill-[#F3C95D] text-[#F3C95D]" />
                        {accommodation.rating}
                      </div>

                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#75817D]">
                      {accommodation.description}
                    </p>

                    {/* AMENITIES */}
                    <div className="mt-5 flex flex-wrap gap-2">

                      {accommodation.amenities
                        .slice(0, 3)
                        .map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-lg bg-[#F3F5F1] px-2.5 py-1.5 text-[11px] font-medium text-[#596661]"
                          >
                            {amenity}
                          </span>
                        ))}

                      {accommodation.amenities.length > 3 && (
                        <span className="rounded-lg bg-[#F3F5F1] px-2.5 py-1.5 text-[11px] font-medium text-[#596661]">
                          +{accommodation.amenities.length - 3}
                        </span>
                      )}

                    </div>

                    {/* BOTTOM */}
                    <div className="mt-5 flex items-end justify-between border-t border-[#ECEBE5] pt-5">

                      <div>
                        <span className="text-xl font-bold text-[#173C37]">
                          {formatPrice(accommodation.price)}
                        </span>

                        <span className="text-xs text-[#7A8581]">
                          {" "}
                          / night
                        </span>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8A9390]">
                          <Users className="h-3.5 w-3.5" />
                          Up to {accommodation.guests} guests
                        </div>
                      </div>

                      <Link
                        href={`/accommodations/${accommodation.id}`}
                        className="rounded-xl bg-[#173C37] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#23584E]"
                      >
                        View stay
                      </Link>

                    </div>

                    {/* REVIEWS */}
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-[#7A8581]">
                      <Star className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]" />
                      <span className="font-semibold text-[#596661]">
                        {accommodation.rating}
                      </span>
                      <span>·</span>
                      <span>{accommodation.reviews} reviews</span>
                    </div>

                  </div>
                </article>
              );
            })}

          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex min-h-[400px] flex-col items-center justify-center py-16 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E1F5ED]">
              <Search className="h-7 w-7 text-[#397A69]" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold">
              No stays found
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#7A8581]">
              We couldn't find accommodations matching your current
              search and filters. Try adjusting your options.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-[#173C37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#23584E]"
            >
              Clear filters
            </button>

          </div>
        )}

      </div>

      {/* FILTER DRAWER */}
      {showFilters && (
        <div className="fixed inset-0 z-50">

          {/* BACKDROP */}
          <button
            type="button"
            onClick={() => setShowFilters(false)}
            className="absolute inset-0 bg-[#07110F]/60 backdrop-blur-sm"
            aria-label="Close filters"
          />

          {/* PANEL */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-2xl sm:left-auto sm:top-0 sm:max-h-none sm:w-[420px] sm:rounded-none sm:rounded-l-[28px]">

            <div className="flex items-center justify-between border-b border-[#E5E4DD] pb-5">

              <div>
                <h2 className="text-xl font-semibold">
                  Filter stays
                </h2>

                <p className="mt-1 text-xs text-[#7A8581]">
                  Refine your accommodation search
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F5F1] text-[#173C37]"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* PRICE */}
            <div className="border-b border-[#ECEBE5] py-7">

              <h3 className="text-sm font-semibold">
                Price per night
              </h3>

              <div className="mt-4 space-y-2">

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E2E1DA] p-3 transition hover:bg-[#F7F8F4]">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === "all"}
                    onChange={() => setPriceRange("all")}
                    className="accent-[#397A69]"
                  />

                  <span className="text-sm">
                    Any price
                  </span>
                </label>

                {priceRanges.map((range) => (
                  <label
                    key={range.label}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E2E1DA] p-3 transition hover:bg-[#F7F8F4]"
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === range.label}
                      onChange={() => setPriceRange(range.label)}
                      className="accent-[#397A69]"
                    />

                    <span className="text-sm">
                      {range.label}
                    </span>
                  </label>
                ))}

              </div>
            </div>

            {/* TYPE */}
            <div className="border-b border-[#ECEBE5] py-7">

              <h3 className="text-sm font-semibold">
                Accommodation type
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-2">

                {accommodationTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setType(item)}
                    className={`rounded-xl border px-3 py-3 text-left text-xs font-medium transition ${
                      type === item
                        ? "border-[#397A69] bg-[#E1F5ED] text-[#277765]"
                        : "border-[#E2E1DA] text-[#596661] hover:bg-[#F7F8F4]"
                    }`}
                  >
                    {item}
                  </button>
                ))}

              </div>
            </div>

            {/* GUESTS */}
            <div className="py-7">

              <h3 className="text-sm font-semibold">
                Guests
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-2">

                {[
                  "Any number",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGuests(item)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      guests === item
                        ? "border-[#397A69] bg-[#E1F5ED] text-[#277765]"
                        : "border-[#E2E1DA] text-[#596661] hover:bg-[#F7F8F4]"
                    }`}
                  >
                    {item === "Any number"
                      ? item
                      : `${item}+ guests`}
                  </button>
                ))}

              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 border-t border-[#ECEBE5] pt-5">

              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 rounded-xl border border-[#173C37] px-5 py-3.5 text-sm font-semibold text-[#173C37] transition hover:bg-[#F3F5F1]"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="flex-1 rounded-xl bg-[#173C37] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#23584E]"
              >
                Show stays
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
};

export default AccommodationsPage;