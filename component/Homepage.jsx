"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStatesData } from "nigeria-state-lga-data";
import BookStayModal from "./BookStayModal";
import {
  MapPin,
  Search,
  ChevronDown,
  ShieldCheck,
  Star,
  Users,
  ArrowRight,
  Loader2,
  Navigation,
} from "lucide-react";

import API from "@/axios/index";

const nigeriaStatesData = getStatesData();

const priceRanges = [
  {
    label: "Any price",
    value: "all",
  },
  {
    label: "₦10,000 – ₦50,000",
    value: "10000-50000",
    min: 10000,
    max: 50000,
  },
  {
    label: "₦50,000 – ₦100,000",
    value: "50000-100000",
    min: 50000,
    max: 100000,
  },
  {
    label: "₦100,000 – ₦200,000",
    value: "100000-200000",
    min: 100000,
    max: 200000,
  },
  {
    label: "₦200,000 – ₦500,000",
    value: "200000-500000",
    min: 200000,
    max: 500000,
  },
];

const getLocationOptionValue = (item) => {
  if (typeof item === "string") {
    return item;
  }

  return item?.name || "";
};

const getAccommodationId = (accommodation) => {
  return accommodation?._id || accommodation?.id;
};

const getAccommodationHref = (accommodation) => {
  if (!accommodation?.slug) {
    return "/accommodations";
  }

  return `/accommodations/${accommodation.slug}`;
};

const getAccommodationImage = (accommodation) => {
  if (accommodation?.image) {
    return accommodation.image;
  }

  if (
    Array.isArray(accommodation?.images) &&
    accommodation.images.length > 0
  ) {
    const firstImage = accommodation.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    if (firstImage?.url) {
      return firstImage.url;
    }
  }

  return "/images/accommodation-placeholder.jpg";
};

const getAccommodationLocation = (accommodation) => {
  const location = accommodation?.location;

  if (!location) {
    return "Location unavailable";
  }

  if (typeof location === "string") {
    return location;
  }

  return (
    [location.city, location.lga, location.state]
      .filter(Boolean)
      .join(", ") || "Location unavailable"
  );
};

const formatPrice = (price) => {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "₦0";
  }

  return `₦${numericPrice.toLocaleString("en-NG")}`;
};

const HomePage = () => {
  /*
   * ------------------------------------------------------------
   * LOCATION FILTER STATE
   * ------------------------------------------------------------
   */

  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [lga, setLga] = useState("");

  /*
   * ------------------------------------------------------------
   * PRICE
   * ------------------------------------------------------------
   */

  const [priceRange, setPriceRange] = useState("all");

  const [isBookingModalOpen, setIsBookingModalOpen] =
  useState(false);

const [selectedAccommodation, setSelectedAccommodation] =
  useState(null);

  /*
   * ------------------------------------------------------------
   * GEOLOCATION
   *
   * IMPORTANT:
   *
   * We keep coordinates completely separate from:
   *
   * state
   * city
   * lga
   *
   * We NEVER reverse-geocode the location into Ogun,
   * Sagamu, etc.
   * ------------------------------------------------------------
   */

  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationRadius, setLocationRadius] = useState(25);

  /*
   * ------------------------------------------------------------
   * LOCATION OPTIONS
   * ------------------------------------------------------------
   */

  const selectedStateRecord = useMemo(() => {
    if (!state) {
      return null;
    }

    return nigeriaStatesData.find(
      (item) =>
        item.name.toLowerCase() === state.toLowerCase()
    );
  }, [state]);

  const cityOptions = selectedStateRecord?.towns || [];

  const lgaOptions = selectedStateRecord?.lgas || [];

  /*
   * ------------------------------------------------------------
   * GEOLOCATION
   * ------------------------------------------------------------
   */

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        "Location services are not supported by your browser."
      );

      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        /*
         * IMPORTANT:
         *
         * Do NOT do this:
         *
         * setState("Ogun");
         * setCity("Sagamu");
         * setLga("Sagamu");
         *
         * Coordinates are kept independently.
         */

        setUserLocation({
          latitude,
          longitude,
        });

        /*
         * Clear manual location filters because
         * geolocation is now the active location filter.
         */

        setState("");
        setCity("");
        setLga("");

        setLocationLoading(false);
      },

      (error) => {
        setLocationLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location permission was denied. Please allow location access and try again."
            );
            break;

          case error.POSITION_UNAVAILABLE:
            setLocationError(
              "Your location could not be determined. Please try again."
            );
            break;

          case error.TIMEOUT:
            setLocationError(
              "Location request timed out. Please try again."
            );
            break;

          default:
            setLocationError(
              "Unable to determine your location."
            );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  };

  const clearUserLocation = () => {
    setUserLocation(null);
    setLocationError("");
  };

  /*
   * ------------------------------------------------------------
   * MANUAL LOCATION HANDLERS
   * ------------------------------------------------------------
   */

  const handleStateChange = (value) => {
    setState(value);
    setCity("");
    setLga("");

    /*
     * Manual location takes priority over
     * browser geolocation.
     */

    if (userLocation) {
      setUserLocation(null);
    }

    setLocationError("");
  };

  const handleCityChange = (value) => {
    setCity(value);
    setLga("");

    if (userLocation) {
      setUserLocation(null);
    }

    setLocationError("");
  };

  const handleLgaChange = (value) => {
    setLga(value);

    if (userLocation) {
      setUserLocation(null);
    }

    setLocationError("");
  };

  /*
   * ------------------------------------------------------------
   * ACCOMMODATION QUERY
   * ------------------------------------------------------------
   *
   * This uses the SAME filtering mechanism as
   * AccommodationsPage.
   * ------------------------------------------------------------
   */

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: [
      "home-accommodations",
      state,
      city,
      lga,
      priceRange,
      userLocation?.latitude,
      userLocation?.longitude,
      locationRadius,
    ],

    queryFn: async () => {
      const params = {};

      /*
       * MANUAL LOCATION
       */

      if (state) {
        params.state = state;
      }

      if (city) {
        params.city = city;
      }

      if (lga) {
        params.lga = lga;
      }

      /*
       * PRICE
       */

      if (priceRange !== "all") {
        const selectedRange = priceRanges.find(
          (range) => range.value === priceRange
        );

        if (selectedRange) {
          params.minPrice = selectedRange.min;
          params.maxPrice = selectedRange.max;
        }
      }

      /*
       * GEOLOCATION
       *
       * This is the important part.
       *
       * The coordinates go directly to the backend.
       */

      if (userLocation) {
        params.latitude = userLocation.latitude;
        params.longitude = userLocation.longitude;
        params.radius = locationRadius;
      }

      /*
       * Home page only needs a small number of
       * accommodations.
       */

      params.page = 1;
      params.limit = 6;
      params.sort = "recommended";

      const response = await API.get(
        "/accommodations",
        {
          params,
          timeout: 15000,
        }
      );

      return response.data;
    },

    staleTime: 1000 * 60 * 5,

    retry: 1,
  });

  /*
   * ------------------------------------------------------------
   * NORMALIZE ACCOMMODATIONS
   * ------------------------------------------------------------
   */

  const accommodations = useMemo(() => {
    if (Array.isArray(data?.accommodations)) {
      return data.accommodations;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  }, [data]);

  /*
   * ------------------------------------------------------------
   * SEARCH
   *
   * This sends the user to the accommodations page with
   * the same filters already selected.
   * ------------------------------------------------------------
   */

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (state) {
      params.set("state", state);
    }

    if (city) {
      params.set("city", city);
    }

    if (lga) {
      params.set("lga", lga);
    }

    if (priceRange !== "all") {
      params.set("price", priceRange);
    }

    /*
     * If using location, pass the coordinates.
     *
     * We DO NOT convert them into state/city/LGA.
     */

    if (userLocation) {
      params.set(
        "latitude",
        String(userLocation.latitude)
      );

      params.set(
        "longitude",
        String(userLocation.longitude)
      );

      params.set(
        "radius",
        String(locationRadius)
      );
    }

    const query = params.toString();

    window.location.href = query
      ? `/accommodations?${query}`
      : "/accommodations";
  };

  const handleBookStay = (accommodation) => {
  setSelectedAccommodation(accommodation);
  setIsBookingModalOpen(true);
};

const handleCloseBookingModal = () => {
  setIsBookingModalOpen(false);
  setSelectedAccommodation(null);
};

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#F8F8F4] text-[#172322]">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="bg-[#173C37]">

        <div className="mx-auto max-w-7xl px-5 pb-14 pt-12 lg:px-8 lg:pb-20 lg:pt-16">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-[#63E6BE]">

              <ShieldCheck className="h-4 w-4" />

              Safer stays with TripGuard

            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">

              Find a stay that feels right.

            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">

              Explore comfortable stays across Nigeria,
              compare your options and choose a place
              that fits your trip.

            </p>

          </div>

          {/* ==================================================
              SEARCH BOX
          =================================================== */}

          <div className="mt-9 rounded-[28px] border border-white/20 bg-white p-3 shadow-2xl">

            <div className="grid gap-3 lg:grid-cols-[2fr_1.2fr_auto]">

              {/* LOCATION */}

              <div className="rounded-2xl bg-[#F7F7F3] p-4">

                <div className="mb-3 flex items-center justify-between gap-3">

                  <div className="flex items-center gap-2">

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

                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={locationLoading}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#397A69] transition hover:text-[#173C37] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {locationLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Navigation className="h-3.5 w-3.5" />
                    )}

                    {locationLoading
                      ? "Locating..."
                      : "Use my location"}

                  </button>

                </div>

                {/* =================================================
                    GEOLOCATION ACTIVE
                ================================================== */}

                {userLocation ? (

                  <div className="rounded-xl border border-[#CDE7DD] bg-[#E1F5ED] p-3">

                    <div className="flex items-center justify-between gap-3">

                      <div>

                        <p className="text-sm font-semibold text-[#277765]">
                          Searching around your location
                        </p>

                        <p className="mt-1 text-xs text-[#5E7770]">
                          Showing stays within{" "}
                          {locationRadius} km
                        </p>

                      </div>

                      <MapPin className="h-5 w-5 shrink-0 text-[#397A69]" />

                    </div>

                    <div className="mt-3 flex items-center gap-2">

                      <div className="relative flex-1">

                        <select
                          value={locationRadius}
                          onChange={(e) =>
                            setLocationRadius(
                              Number(e.target.value)
                            )
                          }
                          className="h-10 w-full appearance-none rounded-lg border border-[#CDE7DD] bg-white px-3 pr-8 text-xs font-semibold text-[#277765] outline-none"
                        >
                          <option value={5}>
                            Within 5 km
                          </option>

                          <option value={10}>
                            Within 10 km
                          </option>

                          <option value={25}>
                            Within 25 km
                          </option>

                          <option value={50}>
                            Within 50 km
                          </option>

                          <option value={100}>
                            Within 100 km
                          </option>

                        </select>

                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#397A69]" />

                      </div>

                      <button
                        type="button"
                        onClick={clearUserLocation}
                        className="rounded-lg border border-[#397A69] px-3 py-2.5 text-xs font-semibold text-[#397A69] transition hover:bg-white"
                      >
                        Clear
                      </button>

                    </div>

                  </div>

                ) : (

                  /* =================================================
                     MANUAL LOCATION
                  ================================================== */

                  <div className="grid gap-2 sm:grid-cols-3">

                    {/* STATE */}

                    <div className="relative">

                      <select
                        value={state}
                        onChange={(e) =>
                          handleStateChange(
                            e.target.value
                          )
                        }
                        className="h-11 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                      >

                        <option value="">
                          State
                        </option>

                        {nigeriaStatesData.map(
                          (item) => (
                            <option
                              key={item.name}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          )
                        )}

                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />

                    </div>

                    {/* CITY */}

                    <div className="relative">

                      <select
                        value={city}
                        onChange={(e) =>
                          handleCityChange(
                            e.target.value
                          )
                        }
                        disabled={!state}
                        className="h-11 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 disabled:cursor-not-allowed disabled:bg-[#ECEEEA] disabled:text-[#9AA29F]"
                      >

                        <option value="">
                          City
                        </option>

                        {cityOptions.map(
                          (item, index) => {

                            const value =
                              getLocationOptionValue(
                                item
                              );

                            if (!value) {
                              return null;
                            }

                            return (
                              <option
                                key={`${value}-${index}`}
                                value={value}
                              >
                                {value}
                              </option>
                            );
                          }
                        )}

                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />

                    </div>

                    {/* LGA */}

                    <div className="relative">

                      <select
                        value={lga}
                        onChange={(e) =>
                          handleLgaChange(
                            e.target.value
                          )
                        }
                        disabled={!state}
                        className="h-11 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 disabled:cursor-not-allowed disabled:bg-[#ECEEEA] disabled:text-[#9AA29F]"
                      >

                        <option value="">
                          LGA
                        </option>

                        {lgaOptions.map(
                          (item, index) => {

                            const value =
                              getLocationOptionValue(
                                item
                              );

                            if (!value) {
                              return null;
                            }

                            return (
                              <option
                                key={`${value}-${index}`}
                                value={value}
                              >
                                {value}
                              </option>
                            );
                          }
                        )}

                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />

                    </div>

                  </div>
                )}

                {locationError && (
                  <p className="mt-3 text-xs font-medium text-red-500">
                    {locationError}
                  </p>
                )}

              </div>

              {/* PRICE */}

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
                    onChange={(e) =>
                      setPriceRange(
                        e.target.value
                      )
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                  >

                    {priceRanges.map(
                      (range) => (
                        <option
                          key={range.value}
                          value={range.value}
                        >
                          {range.label}
                        </option>
                      )
                    )}

                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />

                </div>

              </div>

              {/* SEARCH BUTTON */}

              <button
                type="button"
                onClick={handleSearch}
                className="flex min-h-[90px] items-center justify-center gap-2 rounded-2xl bg-[#173C37] px-8 font-semibold text-white transition hover:bg-[#23584E] lg:min-h-full"
              >

                <Search className="h-4 w-4" />

                Search

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          LOCATION RESULT
      ======================================================= */}

      <section className="mx-auto max-w-7xl px-5 pt-10 lg:px-8">

        {userLocation && (
          <div className="mb-6 rounded-2xl border border-[#CDE7DD] bg-[#E1F5ED] p-4">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">

                  <Navigation className="h-5 w-5 text-[#397A69]" />

                </div>

                <div>

                  <p className="text-sm font-semibold text-[#277765]">
                    Location detected
                  </p>

                  <p className="mt-1 text-xs text-[#5E7770]">
                    Showing stays within{" "}
                    {locationRadius} km of your
                    current location.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={clearUserLocation}
                className="self-start rounded-lg border border-[#397A69] px-3 py-2 text-xs font-semibold text-[#397A69] transition hover:bg-white sm:self-auto"
              >
                Clear location
              </button>

            </div>

          </div>
        )}

        {/* ====================================================
            RESULT HEADING
        ===================================================== */}

        <div className="flex items-end justify-between gap-4">

          <div>

            <h2 className="text-2xl font-semibold text-[#172322]">
              {userLocation
                ? "Stays near you"
                : "Explore stays"}
            </h2>

            <p className="mt-1 text-sm text-[#7A8581]">

              {isLoading
                ? "Finding accommodations..."
                : `${accommodations.length} ${
                    accommodations.length === 1
                      ? "accommodation"
                      : "accommodations"
                  } available`}

            </p>

          </div>

          <Link
            href="/accommodations"
            className="hidden items-center gap-2 text-sm font-semibold text-[#397A69] sm:flex"
          >
            View all

            <ArrowRight className="h-4 w-4" />

          </Link>

        </div>

        {/* ====================================================
            LOADING
        ===================================================== */}

        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#E1F5ED] border-t-[#397A69]" />

              <p className="mt-4 text-sm text-[#7A8581]">
                Finding stays...
              </p>

            </div>

          </div>
        )}

        {/* ====================================================
            FETCHING
        ===================================================== */}

        {!isLoading && isFetching && (
          <div className="py-4 text-xs font-medium text-[#397A69]">
            Updating stays...
          </div>
        )}

        {/* ====================================================
            ACCOMMODATIONS
        ===================================================== */}

        {!isLoading &&
          !isError &&
          accommodations.length > 0 && (

            <div className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-3">

              {accommodations.map(
                (accommodation) => {

                  const id =
                    getAccommodationId(
                      accommodation
                    );

                  const href =
                    getAccommodationHref(
                      accommodation
                    );

                  const image =
                    getAccommodationImage(
                      accommodation
                    );

                  const location =
                    getAccommodationLocation(
                      accommodation
                    );

                  const rating =
                    Number(
                      accommodation.averageRating
                    ) || 0;

                  const reviews =
                    Number(
                      accommodation.reviewCount ??
                        accommodation.totalReviews ??
                        accommodation.reviews
                    ) || 0;

                  return (
                    <article
                      key={
                        id ||
                        accommodation.slug ||
                        accommodation.name
                      }
                      className="group overflow-hidden rounded-[24px] border border-[#E4E3DC] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >

                      {/* IMAGE */}

                      <Link href={href}>

                        <div className="relative aspect-[4/3] overflow-hidden">

                          <Image
                            src={image}
                            alt={
                              accommodation.name ||
                              "Accommodation"
                            }
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />

                          <div className="absolute left-4 top-4">

                            <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#173C37] shadow-sm">
                              {accommodation.type ||
                                "Accommodation"}
                            </span>

                          </div>

                        </div>

                      </Link>

                      {/* CONTENT */}

                      <div className="p-5">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <Link href={href}>

                              <h3 className="truncate text-lg font-semibold text-[#172322] transition group-hover:text-[#397A69]">
                                {accommodation.name ||
                                  "Unnamed accommodation"}
                              </h3>

                            </Link>

                            <div className="mt-2 flex items-center gap-1.5 text-sm text-[#7A8581]">

                              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#397A69]" />

                              <span className="truncate">
                                {location}
                              </span>

                            </div>

                          </div>

                          <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#173C37]">

                            <Star className="h-4 w-4 fill-[#F3C95D] text-[#F3C95D]" />

                            {rating.toFixed(1)}

                          </div>

                        </div>

                        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#75817D]">
                          {accommodation.description ||
                            "Comfortable accommodation for your stay."}
                        </p>

                        <div className="mt-5 flex items-end justify-between border-t border-[#ECEBE5] pt-5">

                          <div>

                            <span className="text-xl font-bold text-[#173C37]">
                              {formatPrice(
                                accommodation.pricePerNight
                              )}
                            </span>

                            <span className="text-xs text-[#7A8581]">
                              {" "}
                              / night
                            </span>

                            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8A9390]">

                              <Users className="h-3.5 w-3.5" />

                              Up to{" "}
                              {Number(
                                accommodation.maxGuests
                              ) || 0}{" "}
                              guests

                            </div>

                          </div>

                          <div className="flex items-center gap-2">
  <Link
    href={href}
   className="rounded-xl bg-[#173C37] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#23584E]"
  >
    View stay
  </Link>

  <button
    type="button"
    onClick={() =>
      handleBookStay(accommodation)
    }
    className="rounded-xl bg-[#173C37] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#23584E]"
  >
    Book stay
  </button>
</div>

                        </div>

                        <div className="mt-4 flex items-center gap-1.5 text-xs text-[#7A8581]">

                          <Star className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]" />

                          <span className="font-semibold text-[#596661]">
                            {rating.toFixed(1)}
                          </span>

                          <span>·</span>

                          <span>
                            {reviews}{" "}
                            {reviews === 1
                              ? "review"
                              : "reviews"}
                          </span>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        {/* ====================================================
            ERROR
        ===================================================== */}

        {!isLoading && isError && (
          <div className="py-16 text-center">

            <h3 className="text-xl font-semibold">
              Unable to load stays
            </h3>

            <p className="mt-2 text-sm text-[#7A8581]">
              Something went wrong while loading
              accommodations.
            </p>

          </div>
        )}

        {/* ====================================================
            EMPTY
        ===================================================== */}

        {!isLoading &&
          !isError &&
          accommodations.length === 0 && (

            <div className="py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E1F5ED]">

                <Search className="h-7 w-7 text-[#397A69]" />

              </div>

              <h3 className="mt-5 text-xl font-semibold">
                No stays found nearby
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A8581]">

                {userLocation
                  ? `We couldn't find accommodations within ${locationRadius} km of your current location. Try increasing the search radius.`
                  : "We couldn't find accommodations matching your selected filters."}

              </p>

              {userLocation && (
                <div className="mt-5 flex justify-center gap-2">

                  {[10, 25, 50, 100].map(
                    (radius) => (
                      <button
                        key={radius}
                        type="button"
                        onClick={() =>
                          setLocationRadius(
                            radius
                          )
                        }
                        className="rounded-lg border border-[#DCDDD6] bg-white px-3 py-2 text-xs font-semibold text-[#397A69] transition hover:bg-[#F3F5F1]"
                      >
                        {radius} km
                      </button>
                    )
                  )}

                </div>
              )}

            </div>
          )}

        <div className="pb-12 pt-2 sm:hidden">

          <Link
            href="/accommodations"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-3.5 text-sm font-semibold text-white"
          >
            View all stays

            <ArrowRight className="h-4 w-4" />

          </Link>

        </div>

      </section>
<BookStayModal
  isOpen={isBookingModalOpen}
  onClose={handleCloseBookingModal}
  accommodation={selectedAccommodation}
/>
    </main>
    
  );
};

export default HomePage;