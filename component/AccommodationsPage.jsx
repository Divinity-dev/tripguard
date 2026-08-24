"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getStatesData } from "nigeria-state-lga-data";
import BookStayModal from "./BookStayModal";
import API from "@/axios/index";

import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Heart,
  Users,
  ChevronDown,
  X,
  ShieldCheck,
} from "lucide-react";

const nigeriaStatesData = getStatesData();

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

const guestOptions = [
  "Any number",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
];

const formatPrice = (price) => {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "₦0";
  }

  return `₦${numericPrice.toLocaleString("en-NG")}`;
};

const getAccommodationId = (accommodation) => {
  return accommodation?._id || accommodation?.id;
};

const getAccommodationHref = (accommodation) => {
  const slug = accommodation?.slug;

  if (!slug) {
    return "/accommodations";
  }

  return `/accommodations/${slug}`;
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

const getLocationOptionValue = (item) => {
  if (typeof item === "string") {
    return item;
  }

  return item?.name || "";
};

const AccommodationsPage = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  /*
   * ------------------------------------------------------------
   * URL PARAMETERS
   * ------------------------------------------------------------
   */

  const urlState = searchParams.get("state") || "";
  const urlCity = searchParams.get("city") || "";
  const urlLga = searchParams.get("lga") || "";
  const urlPrice = searchParams.get("price") || "";

  /*
   * ------------------------------------------------------------
   * STATE
   * ------------------------------------------------------------
   */

  const [search, setSearch] = useState("");

  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationRadius, setLocationRadius] = useState(25);

  const [priceRange, setPriceRange] = useState(
    urlPrice || "all"
  );

  const [type, setType] = useState("All types");
  const [guests, setGuests] = useState("Any number");
  const [sort, setSort] = useState("Recommended");

  const [state, setState] = useState(urlState);
  const [city, setCity] = useState(urlCity);
  const [lga, setLga] = useState(urlLga);

  const [page, setPage] = useState(1);

  const limit = 12;

  const [showFilters, setShowFilters] = useState(false);

  const [selectedAccommodation, setSelectedAccommodation] =
    useState(null);

  const [savingAccommodationId, setSavingAccommodationId] =
    useState(null);

  const [bookModalOpen, setBookModalOpen] = useState(false);

  /*
   * ------------------------------------------------------------
   * SAVED ACCOMMODATIONS
   * ------------------------------------------------------------
   */

  const {
    data: savedData,
  } = useQuery({
    queryKey: ["savedAccommodations"],

    queryFn: async () => {
      try {
        const response = await API.get("/saved");

        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          return {
            savedAccommodations: [],
          };
        }

        throw error;
      }
    },

    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const savedAccommodationIds = useMemo(() => {
    const savedAccommodations =
      savedData?.savedAccommodations || [];

    return new Set(
      savedAccommodations
        .map((savedItem) =>
          getAccommodationId(
            savedItem?.accommodation
          )
        )
        .filter(Boolean)
    );
  }, [savedData]);

  /*
   * ------------------------------------------------------------
   * SAVE MUTATION
   * ------------------------------------------------------------
   */

  const saveMutation = useMutation({
    mutationFn: async (accommodationId) => {
      const response = await API.post(
        `/saved/${accommodationId}`
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["savedAccommodations"],
      });
    },
  });

  /*
   * ------------------------------------------------------------
   * REMOVE MUTATION
   * ------------------------------------------------------------
   */

  const removeMutation = useMutation({
    mutationFn: async (accommodationId) => {
      const response = await API.delete(
        `/saved/${accommodationId}`
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["savedAccommodations"],
      });
    },
  });

  /*
   * ------------------------------------------------------------
   * RESET PAGINATION
   * ------------------------------------------------------------
   */

  useEffect(() => {
    setPage(1);
  }, [
    search,
    state,
    city,
    lga,
    priceRange,
    type,
    guests,
    sort,
    userLocation?.latitude,
    userLocation?.longitude,
    locationRadius,
  ]);

  /*
   * ------------------------------------------------------------
   * FETCH ACCOMMODATIONS
   *
   * IMPORTANT:
   * We now use the existing Axios API instance instead of
   * manually constructing NEXT_PUBLIC_API_URL.
   *
   * This keeps this page consistent with the rest of TripGuard.
   * ------------------------------------------------------------
   */

  const fetchAccommodations = async () => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (state) {
      params.state = state;
    }

    if (city) {
      params.city = city;
    }

    if (lga) {
      params.lga = lga;
    }

    if (type !== "All types") {
      params.type = type;
    }

    if (priceRange !== "all") {
      const selectedRange = priceRanges.find(
        (range) => range.label === priceRange
      );

      if (selectedRange) {
        params.minPrice = selectedRange.min;
        params.maxPrice = selectedRange.max;
      }
    }

    if (guests !== "Any number") {
      params.guests = Number(guests);
    }

    params.page = page;
    params.limit = limit;

    /*
     * Nearby search
     */

    if (userLocation) {
      params.latitude = userLocation.latitude;
      params.longitude = userLocation.longitude;
      params.radius = locationRadius;
    }

    /*
     * Sorting
     */

    if (sort === "Price: Low to high") {
      params.sort = "price-low";
    } else if (sort === "Price: High to low") {
      params.sort = "price-high";
    } else if (sort === "Highest rated") {
      params.sort = "rating";
    } else {
      params.sort = "recommended";
    }

    console.log(
      "Fetching accommodations with params:",
      params
    );

    try {
      const response = await API.get(
        "/accommodations",
        {
          params,
          timeout: 15000,
        }
      );

      console.log(
        "Accommodation API response:",
        response.data
      );

      const data = response.data;

      /*
       * Support the expected backend structure:
       *
       * {
       *   success: true,
       *   accommodations: [],
       *   pagination: {}
       * }
       */

      if (data?.success === false) {
        throw new Error(
          data?.message ||
          "Failed to fetch accommodations."
        );
      }

      return data;
    } catch (error) {
      console.error(
        "Accommodation fetch error:",
        error
      );

      if (error.code === "ECONNABORTED") {
        throw new Error(
          "The server took too long to respond. Please try again."
        );
      }

      if (
        error.response?.data?.message
      ) {
        throw new Error(
          error.response.data.message
        );
      }

      if (
        error.response?.status
      ) {
        throw new Error(
          `Unable to load accommodations. Server returned ${error.response.status}.`
        );
      }

      if (
        error.request &&
        !error.response
      ) {
        throw new Error(
          "Unable to connect to the TripGuard server. Please make sure the backend is running."
        );
      }

      throw new Error(
        error.message ||
        "Unable to load accommodations."
      );
    }
  };

  /*
   * ------------------------------------------------------------
   * ACCOMMODATION QUERY
   * ------------------------------------------------------------
   */

  const {
    data,
    isLoading: accommodationsLoading,
    isFetching: accommodationsFetching,
    isError: accommodationsError,
    error: accommodationsErrorDetails,
    refetch: refetchAccommodations,
  } = useQuery({
    queryKey: [
      "accommodations",
      search,
      state,
      city,
      lga,
      priceRange,
      type,
      guests,
      sort,
      page,
      limit,
      userLocation?.latitude,
      userLocation?.longitude,
      locationRadius,
    ],

    queryFn: fetchAccommodations,

    /*
     * Do not repeatedly hammer the backend when
     * there is a connection/configuration problem.
     */
    retry: 1,

    staleTime: 1000 * 60 * 5,

    /*
     * Keep previous results while changing filters/page.
     */
    placeholderData: (previousData) =>
      previousData,
  });

  /*
   * ------------------------------------------------------------
   * NORMALIZE RESPONSE
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

  const pagination = data?.pagination || {
    page,
    limit,
    total: accommodations.length,
    totalPages: 1,
    hasPreviousPage: page > 1,
    hasNextPage: false,
  };

  /*
   * ------------------------------------------------------------
   * LOCATION OPTIONS
   * ------------------------------------------------------------
   */

  const selectedStateRecord = useMemo(() => {
    return nigeriaStatesData.find(
      (countryState) =>
        countryState.name.toLowerCase() ===
        state.toLowerCase()
    );
  }, [state]);

  const cityOptions =
    selectedStateRecord?.towns || [];

  const lgaOptions =
    selectedStateRecord?.lgas || [];

  /*
   * ------------------------------------------------------------
   * SAVE / REMOVE
   * ------------------------------------------------------------
   */

  const toggleSaved = async (accommodationId) => {
    if (!accommodationId) {
      return;
    }

    const isSaved =
      savedAccommodationIds.has(
        accommodationId
      );

    try {
      setSavingAccommodationId(
        accommodationId
      );

      if (isSaved) {
        await removeMutation.mutateAsync(
          accommodationId
        );
      } else {
        await saveMutation.mutateAsync(
          accommodationId
        );
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.error(
          "Please log in to save accommodations."
        );
      } else {
        console.error(
          "Unable to update saved accommodation:",
          error
        );
      }
    } finally {
      setSavingAccommodationId(null);
    }
  };

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
        const {
          latitude,
          longitude,
        } = position.coords;

        setUserLocation({
          latitude,
          longitude,
        });

        setLocationLoading(false);

        setState("");
        setCity("");
        setLga("");
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
   * CLEAR FILTERS
   * ------------------------------------------------------------
   */

  const clearFilters = () => {
    setSearch("");
    setPriceRange("all");
    setType("All types");
    setGuests("Any number");
    setSort("Recommended");

    setState("");
    setCity("");
    setLga("");

    setUserLocation(null);
    setLocationError("");
    setLocationRadius(25);

    setPage(1);
  };

  /*
   * ------------------------------------------------------------
   * LOCATION HANDLERS
   * ------------------------------------------------------------
   */

  const handleStateChange = (value) => {
    setState(value);
    setCity("");
    setLga("");

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
   * BOOKING
   * ------------------------------------------------------------
   */

  const handleBook = (accommodation) => {
    setSelectedAccommodation(
      accommodation
    );

    setBookModalOpen(true);
  };

  const handleCloseBookModal = () => {
    setBookModalOpen(false);
    setSelectedAccommodation(null);
  };

  const handleBookSubmit = () => {
    handleCloseBookModal();

    /*
     * Refresh accommodations after booking.
     */
    queryClient.invalidateQueries({
      queryKey: ["accommodations"],
    });
  };

  /*
   * ------------------------------------------------------------
   * ACTIVE FILTERS
   * ------------------------------------------------------------
   */

  const hasActiveFilters =
    Boolean(search.trim()) ||
    priceRange !== "all" ||
    type !== "All types" ||
    guests !== "Any number" ||
    Boolean(state) ||
    Boolean(city) ||
    Boolean(lga) ||
    Boolean(userLocation);

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#F8F8F4] text-[#172322]">

      {/* =====================================================
          HEADER
      ====================================================== */}

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
              Explore comfortable stays across
              Nigeria, compare your options and
              choose a place that fits your trip.
            </p>

          </div>

          {/* SEARCH */}

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
                    onClick={
                      handleUseMyLocation
                    }
                    disabled={locationLoading}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#397A69] transition hover:text-[#173C37] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MapPin className="h-3.5 w-3.5" />

                    {locationLoading
                      ? "Locating..."
                      : "Use my location"}
                  </button>

                </div>

                {!userLocation ? (
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
                ) : (
                  <div className="rounded-xl border border-[#CDE7DD] bg-[#E1F5ED] p-3">

                    <div className="flex items-center justify-between gap-3">

                      <div>

                        <p className="text-sm font-semibold text-[#277765]">
                          Searching around your
                          location
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
                              Number(
                                e.target.value
                              )
                            )
                          }
                          className="h-10 w-full appearance-none rounded-lg border border-[#CDE7DD] bg-white px-3 pr-8 text-xs font-semibold text-[#277765] outline-none"
                        >
                          <option value={1}>
                            Within 1 km
                          </option>

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
                        onClick={
                          clearUserLocation
                        }
                        className="rounded-lg border border-[#397A69] px-3 py-2.5 text-xs font-semibold text-[#397A69] transition hover:bg-white"
                      >
                        Clear
                      </button>

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
                    <option value="all">
                      Any price
                    </option>

                    {priceRanges.map(
                      (range) => (
                        <option
                          key={range.label}
                          value={range.label}
                        >
                          {range.label}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />

                </div>

              </div>

              {/* FILTER BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setShowFilters(true)
                }
                className="flex min-h-[90px] items-center justify-center gap-2 rounded-2xl bg-[#173C37] px-8 font-semibold text-white transition hover:bg-[#23584E] lg:min-h-full"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>

            </div>

            {/* SEARCH */}

            <div className="mt-3">

              <div className="relative">

                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by accommodation name..."
                  className="h-12 w-full rounded-xl border border-[#E2E3DD] bg-[#F7F7F3] pl-11 pr-4 text-sm font-medium text-[#172322] outline-none transition placeholder:text-[#9AA29F] focus:border-[#397A69] focus:bg-white focus:ring-2 focus:ring-[#397A69]/10"
                />

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        {/* TOP CONTROLS */}

        <div className="flex flex-col gap-5 border-b border-[#E2E1DA] pb-7 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-semibold">
              {userLocation
                ? "Stays near you"
                : "Explore stays"}
            </h2>

            <p className="mt-1 text-sm text-[#7A8581]">

              {userLocation
                ? `Showing accommodations within ${locationRadius} km of your location`
                : `${pagination?.total || 0} ${pagination?.total === 1
                  ? "accommodation"
                  : "accommodations"
                } available`}

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
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="appearance-none rounded-xl border border-[#DCDDD6] bg-white py-3 pl-4 pr-10 text-sm font-medium outline-none transition focus:border-[#397A69]"
              >
                <option>
                  Recommended
                </option>

                <option>
                  Highest rated
                </option>

                <option>
                  Price: Low to high
                </option>

                <option>
                  Price: High to low
                </option>
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
                onClick={() =>
                  setSearch("")
                }
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                Search: {search}
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {userLocation && (
              <button
                type="button"
                onClick={
                  clearUserLocation
                }
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                Within {locationRadius} km
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {state && (
              <button
                type="button"
                onClick={() => {
                  setState("");
                  setCity("");
                  setLga("");
                }}
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                {state}
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {city && (
              <button
                type="button"
                onClick={() => {
                  setCity("");
                  setLga("");
                }}
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                {city}
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {lga && (
              <button
                type="button"
                onClick={() =>
                  setLga("")
                }
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                {lga}
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {priceRange !== "all" && (
              <button
                type="button"
                onClick={() =>
                  setPriceRange("all")
                }
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                {priceRange}
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {type !== "All types" && (
              <button
                type="button"
                onClick={() =>
                  setType("All types")
                }
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                {type}
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {guests !== "Any number" && (
              <button
                type="button"
                onClick={() =>
                  setGuests("Any number")
                }
                className="flex items-center gap-2 rounded-full bg-[#E1F5ED] px-3 py-2 text-xs font-semibold text-[#277765]"
              >
                {guests}+ guests
                <X className="h-3.5 w-3.5" />
              </button>
            )}

          </div>
        )}

        {/* ===================================================
            LOADING
        ==================================================== */}

        {accommodationsLoading && (
          <div className="flex min-h-[400px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E1F5ED] border-t-[#397A69]" />

              <p className="mt-4 text-sm text-[#7A8581]">
                Loading accommodations...
              </p>

            </div>

          </div>
        )}

        {/* ===================================================
            FETCHING INDICATOR
        ==================================================== */}

        {!accommodationsLoading &&
          accommodationsFetching && (
            <div className="flex items-center gap-2 py-4 text-xs font-medium text-[#397A69]">

              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#E1F5ED] border-t-[#397A69]" />

              Updating stays...

            </div>
          )}

        {/* ===================================================
            ERROR
        ==================================================== */}

        {!accommodationsLoading &&
          accommodationsError && (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                <X className="h-7 w-7 text-red-500" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold">
                Unable to load stays
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#7A8581]">
                {accommodationsErrorDetails?.message ||
                  "Something went wrong while loading accommodations."}
              </p>

              <button
                type="button"
                onClick={() =>
                  refetchAccommodations()
                }
                className="mt-6 rounded-xl bg-[#173C37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#23584E]"
              >
                Try again
              </button>

            </div>
          )}

        {/* ===================================================
            ACCOMMODATIONS
        ==================================================== */}

        {!accommodationsLoading &&
          !accommodationsError &&
          accommodations.length > 0 && (
            <div className="grid gap-x-6 gap-y-10 pt-8 sm:grid-cols-2 lg:grid-cols-3">

              {accommodations.map(
                (accommodation) => {
                  const accommodationId =
                    getAccommodationId(
                      accommodation
                    );

                  const accommodationHref =
                    getAccommodationHref(
                      accommodation
                    );

                  const isSaved =
                    savedAccommodationIds.has(
                      accommodationId
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

                  const amenities =
                    Array.isArray(
                      accommodation.amenities
                    )
                      ? accommodation.amenities
                      : [];

                  return (
                    <article
                      key={
                        accommodationId ||
                        accommodation.slug ||
                        accommodation.name
                      }
                      className="group overflow-hidden rounded-[24px] border border-[#E4E3DC] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-[4/3] overflow-hidden">

                        <Link
                          href={
                            accommodationHref
                          }
                        >
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
                        </Link>

                        {/* TYPE */}

                        <div className="absolute left-4 top-4">

                          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#173C37] shadow-sm">
                            {accommodation.type ||
                              "Accommodation"}
                          </span>

                        </div>

                        {/* SAVE */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleSaved(
                              accommodationId
                            )
                          }
                          disabled={
                            savingAccommodationId ===
                            accommodationId
                          }
                          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
                          aria-label={
                            isSaved
                              ? "Remove from saved"
                              : "Save accommodation"
                          }
                        >
                          <Heart
                            className={`h-5 w-5 transition ${isSaved
                                ? "fill-[#397A69] text-[#397A69]"
                                : "text-[#173C37]"
                              } ${savingAccommodationId ===
                                accommodationId
                                ? "animate-pulse"
                                : ""
                              }`}
                          />
                        </button>

                      </div>

                      {/* CONTENT */}

                      <div className="p-5">

                        <div className="flex items-start justify-between gap-4">

                          <Link
                            href={
                              accommodationHref
                            }
                            className="min-w-0"
                          >

                            <h3 className="truncate text-lg font-semibold text-[#172322] transition group-hover:text-[#397A69]">
                              {accommodation.name ||
                                "Unnamed accommodation"}
                            </h3>

                            <div className="mt-2 flex items-center gap-1.5 text-sm text-[#7A8581]">

                              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#397A69]" />

                              <span className="truncate">
                                {location}
                              </span>

                            </div>

                          </Link>

                          <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#173C37]">

                            <Star className="h-4 w-4 fill-[#F3C95D] text-[#F3C95D]" />

                            {rating.toFixed(1)}

                          </div>

                        </div>

                        {/* DESCRIPTION */}

                        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#75817D]">
                          {accommodation.description ||
                            "Comfortable accommodation for your stay."}
                        </p>

                        {/* AMENITIES */}

                        {amenities.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">

                            {amenities
                              .slice(0, 3)
                              .map(
                                (
                                  amenity,
                                  index
                                ) => (
                                  <span
                                    key={`${amenity}-${index}`}
                                    className="rounded-lg bg-[#F3F5F1] px-2.5 py-1.5 text-[11px] font-medium text-[#596661]"
                                  >
                                    {amenity}
                                  </span>
                                )
                              )}

                            {amenities.length >
                              3 && (
                                <span className="rounded-lg bg-[#F3F5F1] px-2.5 py-1.5 text-[11px] font-medium text-[#596661]">
                                  +
                                  {amenities.length -
                                    3}
                                </span>
                              )}

                          </div>
                        )}

                        {/* BOTTOM */}

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

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                            <Link
                              href={
                                accommodationHref
                              }
                              className="rounded-xl bg-[#173C37] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#23584E]"
                            >
                              View stay
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleBook(
                                  accommodation
                                )
                              }
                              className="rounded-xl bg-[#173C37] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#23584E]"
                            >
                              Book
                            </button>

                          </div>

                        </div>

                        {/* REVIEWS */}

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

        {/* ===================================================
            PAGINATION
        ==================================================== */}

        {!accommodationsLoading &&
          !accommodationsError &&
          pagination?.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">

              <button
                type="button"
                disabled={
                  !pagination.hasPreviousPage
                }
                onClick={() =>
                  setPage(
                    (currentPage) =>
                      currentPage - 1
                  )
                }
                className="rounded-xl border border-[#DCDDD6] bg-white px-4 py-2.5 text-sm font-semibold text-[#173C37] transition hover:bg-[#F3F5F1] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm font-medium text-[#596661]">
                Page {pagination.page || page} of{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  !pagination.hasNextPage
                }
                onClick={() =>
                  setPage(
                    (currentPage) =>
                      currentPage + 1
                  )
                }
                className="rounded-xl border border-[#DCDDD6] bg-white px-4 py-2.5 text-sm font-semibold text-[#173C37] transition hover:bg-[#F3F5F1] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>
          )}

        {/* ===================================================
            EMPTY
        ==================================================== */}

        {!accommodationsLoading &&
          !accommodationsError &&
          accommodations.length === 0 && (
            <div className="flex min-h-[400px] flex-col items-center justify-center py-16 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E1F5ED]">
                <Search className="h-7 w-7 text-[#397A69]" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold">
                No stays found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#7A8581]">
                We couldn't find accommodations
                matching your current search and
                filters. Try adjusting your options.
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

      {/* =====================================================
          FILTER DRAWER
      ====================================================== */}

      {showFilters && (
        <div className="fixed inset-0 z-50">

          <button
            type="button"
            onClick={() =>
              setShowFilters(false)
            }
            className="absolute inset-0 bg-[#07110F]/60 backdrop-blur-sm"
            aria-label="Close filters"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-2xl sm:left-auto sm:top-0 sm:max-h-none sm:w-[420px] sm:rounded-none sm:rounded-l-[28px]">

            <div className="flex items-center justify-between border-b border-[#E5E4DD] pb-5">

              <div>

                <h2 className="text-xl font-semibold">
                  Filter stays
                </h2>

                <p className="mt-1 text-xs text-[#7A8581]">
                  Refine your accommodation
                  search
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(false)
                }
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
                    checked={
                      priceRange === "all"
                    }
                    onChange={() =>
                      setPriceRange("all")
                    }
                    className="accent-[#397A69]"
                  />

                  <span className="text-sm">
                    Any price
                  </span>

                </label>

                {priceRanges.map(
                  (range) => (
                    <label
                      key={range.label}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E2E1DA] p-3 transition hover:bg-[#F7F8F4]"
                    >

                      <input
                        type="radio"
                        name="price"
                        checked={
                          priceRange ===
                          range.label
                        }
                        onChange={() =>
                          setPriceRange(
                            range.label
                          )
                        }
                        className="accent-[#397A69]"
                      />

                      <span className="text-sm">
                        {range.label}
                      </span>

                    </label>
                  )
                )}

              </div>

            </div>

            {/* TYPE */}

            <div className="border-b border-[#ECEBE5] py-7">

              <h3 className="text-sm font-semibold">
                Accommodation type
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-2">

                {accommodationTypes.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setType(item)
                      }
                      className={`rounded-xl border px-3 py-3 text-left text-xs font-medium transition ${type === item
                          ? "border-[#397A69] bg-[#E1F5ED] text-[#277765]"
                          : "border-[#E2E1DA] text-[#596661] hover:bg-[#F7F8F4]"
                        }`}
                    >
                      {item}
                    </button>
                  )
                )}

              </div>

            </div>

            {/* GUESTS */}

            <div className="py-7">

              <h3 className="text-sm font-semibold">
                Guests
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-2">

                {guestOptions.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setGuests(item)
                      }
                      className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${guests === item
                          ? "border-[#397A69] bg-[#E1F5ED] text-[#277765]"
                          : "border-[#E2E1DA] text-[#596661] hover:bg-[#F7F8F4]"
                        }`}
                    >
                      {item ===
                        "Any number"
                        ? item
                        : `${item}+ guests`}
                    </button>
                  )
                )}

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
                onClick={() =>
                  setShowFilters(false)
                }
                className="flex-1 rounded-xl bg-[#173C37] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#23584E]"
              >
                Show stays
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          BOOKING MODAL
      ====================================================== */}

      <BookStayModal
        isOpen={bookModalOpen}
        accommodation={
          selectedAccommodation
        }
        onClose={
          handleCloseBookModal
        }
        onSubmit={handleBookSubmit}
      />

    </main>
  );
};

export default AccommodationsPage;