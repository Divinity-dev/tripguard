"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Trash2,
  Upload,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
  Sparkles,
  Wind,
  Tv,
  WashingMachine,
  Refrigerator,
  CookingPot,
  LockKeyhole,
  Loader2,
} from "lucide-react";

import { getStatesData } from "nigeria-state-lga-data";

import API from "@/axios/index";

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/*
|--------------------------------------------------------------------------
| PROPERTY TYPES
|--------------------------------------------------------------------------
| These values MUST match the Accommodation mongoose enum.
*/

const propertyTypes = [
  {
    value: "hotel",
    label: "Luxury Hotel",
  },
  {
    value: "hotel",
    label: "Boutique Hotel",
  },
  {
    value: "apartment",
    label: "Serviced Apartment",
  },
  {
    value: "apartment",
    label: "Apartment",
  },
  {
    value: "short-let",
    label: "Short-let Apartment",
  },
  {
    value: "guest-house",
    label: "Guest House",
  },
  {
    value: "resort",
    label: "Resort",
  },
  {
    value: "villa",
    label: "Villa",
  },
  {
    value: "other",
    label: "Lodge",
  },
  {
    value: "other",
    label: "Other",
  },
];

/*
|--------------------------------------------------------------------------
| AMENITIES
|--------------------------------------------------------------------------
*/

const amenities = [
  {
    id: "wifi",
    label: "Free Wi-Fi",
    icon: Wifi,
  },
  {
    id: "parking",
    label: "Free parking",
    icon: Car,
  },
  {
    id: "restaurant",
    label: "Restaurant",
    icon: Utensils,
  },
  {
    id: "gym",
    label: "Fitness centre",
    icon: Dumbbell,
  },
  {
    id: "pool",
    label: "Swimming pool",
    icon: Waves,
  },
  {
    id: "cleaning",
    label: "Daily cleaning",
    icon: Sparkles,
  },
  {
    id: "air-conditioning",
    label: "Air conditioning",
    icon: Wind,
  },
  {
    id: "tv",
    label: "TV",
    icon: Tv,
  },
  {
    id: "washing-machine",
    label: "Washing machine",
    icon: WashingMachine,
  },
  {
    id: "refrigerator",
    label: "Refrigerator",
    icon: Refrigerator,
  },
  {
    id: "kitchen",
    label: "Fully equipped kitchen",
    icon: CookingPot,
  },
  {
    id: "security",
    label: "24/7 security",
    icon: LockKeyhole,
  },
];

/*
|--------------------------------------------------------------------------
| NIGERIAN LOCATION DATA
|--------------------------------------------------------------------------
*/

const statesData = getStatesData();

/*
|--------------------------------------------------------------------------
| DEFAULT HOUSE RULES
|--------------------------------------------------------------------------
| These are currently UI-only because your Accommodation schema
| does not contain a rules field.
*/

const defaultRules = [
  "Check-in from 2:00 PM",
  "Check-out before 12:00 PM",
  "No smoking indoors",
  "Pets are not allowed",
  "Valid identification required",
];

/*
|--------------------------------------------------------------------------
| INITIAL FORM
|--------------------------------------------------------------------------
*/

const initialFormData = {
  propertyName: "",
  propertyType: "",
  state: "",
  city: "",
  lga: "",
  address: "",
  website: "",
  description: "",
  price: "",
  guests: "2",
  bedrooms: "1",
  bathrooms: "1",
  checkInTime: "14:00",
  checkOutTime: "12:00",
};

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

const ListPropertyPage = () => {
  const searchParams = useSearchParams();

  /*
   * If edit exists, we are editing an accommodation.
   */
  const editId = searchParams.get("id");

  const isEditMode = Boolean(editId);
  

  /*
   * FORM STATE
   */

  const [formData, setFormData] =
  useState(initialFormData);

const [unavailableDates, setUnavailableDates] =
  useState([]);

const [unavailableStartDate, setUnavailableStartDate] =
  useState("");

const [unavailableEndDate, setUnavailableEndDate] =
  useState("");

const [selectedAmenities, setSelectedAmenities] =
  useState([]);

  const [rules, setRules] =
    useState(defaultRules);

  const [newRule, setNewRule] =
    useState("");

  /*
   * Images contain two possible types:
   *
   * Existing:
   * {
   *   id,
   *   url,
   *   isExisting: true
   * }
   *
   * New:
   * {
   *   id,
   *   file,
   *   preview,
   *   isExisting: false
   * }
   */

  const [images, setImages] =
    useState([]);

  const [errors, setErrors] =
    useState({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isLoadingProperty, setIsLoadingProperty] =
    useState(isEditMode);

  /*
   * Existing property information.
   */
  const [propertyStatus, setPropertyStatus] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | SELECTED STATE
  |--------------------------------------------------------------------------
  */

  const selectedState = useMemo(
    () =>
      statesData.find(
        (state) => state.name === formData.state
      ),
    [formData.state]
  );

  /*
  |--------------------------------------------------------------------------
  | CITIES
  |--------------------------------------------------------------------------
  */

  const availableCities =
    selectedState?.towns || [];

  /*
  |--------------------------------------------------------------------------
  | LGAs
  |--------------------------------------------------------------------------
  */

  const availableLgas =
    selectedState?.lgas || [];

  /*
  |--------------------------------------------------------------------------
  | FETCH PROPERTY FOR EDIT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isEditMode || !editId) {
      setIsLoadingProperty(false);
      return;
    }

    const fetchProperty = async () => {
      setIsLoadingProperty(true);

      try {
        /*
         * This assumes your backend exposes:
         *
         * GET /accommodations/:id
         *
         * If your controller returns the accommodation
         * directly or inside another property, the helper
         * below handles common response structures.
         */

       const response = await API.get(
  `/accommodations/owner/${editId}`
);

        const data = response.data;

        const accommodation =
          data.accommodation ||
          data.data ||
          data.property ||
          data;

        if (!accommodation) {
          throw new Error(
            "Accommodation could not be found."
          );
        }

        /*
         * PREFILL BASIC INFORMATION
         */

        setFormData({
          propertyName:
            accommodation.name || "",

          propertyType:
            accommodation.type || "",

          state:
            accommodation.location?.state || "",

          city:
            accommodation.location?.city || "",

          lga:
            accommodation.location?.lga || "",

          address:
            accommodation.location?.address || "",

          website:
            accommodation.propertyWebsite || "",

          description:
            accommodation.description || "",

          price:
            accommodation.pricePerNight !== undefined &&
            accommodation.pricePerNight !== null
              ? String(
                  accommodation.pricePerNight
                )
              : "",

          guests:
            accommodation.maxGuests !== undefined &&
            accommodation.maxGuests !== null
              ? String(
                  accommodation.maxGuests
                )
              : "2",

          bedrooms:
            accommodation.bedrooms !== undefined &&
            accommodation.bedrooms !== null
              ? String(
                  accommodation.bedrooms
                )
              : "1",

          bathrooms:
            accommodation.bathrooms !== undefined &&
            accommodation.bathrooms !== null
              ? String(
                  accommodation.bathrooms
                )
              : "1",

          checkInTime:
            accommodation.checkInTime ||
            "14:00",

          checkOutTime:
            accommodation.checkOutTime ||
            "12:00",
        });

        /*
         * AMENITIES
         */

        setSelectedAmenities(
          Array.isArray(
            accommodation.amenities
          )
            ? accommodation.amenities
            : []
        );

        /*
         * IMAGES
         */

        const existingImages = Array.isArray(
          accommodation.images
        )
          ? accommodation.images
          : [];

        setImages(
          existingImages.map(
            (url, index) => ({
              id: `existing-${index}-${url}`,
              url,
              isExisting: true,
            })
          )
        );

        /*
         * STATUS
         */

        setPropertyStatus(
          accommodation.status || ""
        );

        /*
         * HOUSE RULES
         *
         * Currently the schema does not contain rules.
         * If an older document has rules, we can still display
         * them. Otherwise use the defaults.
         */

        if (
          Array.isArray(accommodation.rules)
        ) {
          setRules(accommodation.rules);
        } else {
          setRules([...defaultRules]);
        }
      } catch (error) {
        console.error(
          "Fetch accommodation error:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.message ||
          "Unable to load this property.";

        setErrors({
          submit: message,
        });
      } finally {
        setIsLoadingProperty(false);
      }
    };

    fetchProperty();
  }, [editId, isEditMode]);

  /*
  |--------------------------------------------------------------------------
  | HANDLE NORMAL INPUTS
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  /*
  |--------------------------------------------------------------------------
  | STATE CHANGE
  |--------------------------------------------------------------------------
  */

  const handleStateChange = (
    event
  ) => {
    const { value } =
      event.target;

    setFormData((current) => ({
      ...current,
      state: value,
      city: "",
      lga: "",
    }));

    setErrors((current) => ({
      ...current,
      state: "",
      city: "",
      lga: "",
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | CITY CHANGE
  |--------------------------------------------------------------------------
  */

  const handleCityChange = (
    event
  ) => {
    const { value } =
      event.target;

    setFormData((current) => ({
      ...current,
      city: value,
      lga: "",
    }));

    setErrors((current) => ({
      ...current,
      city: "",
      lga: "",
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | LGA CHANGE
  |--------------------------------------------------------------------------
  */

  const handleLgaChange = (
    event
  ) => {
    const { value } =
      event.target;

    setFormData((current) => ({
      ...current,
      lga: value,
    }));

    if (errors.lga) {
      setErrors((current) => ({
        ...current,
        lga: "",
      }));
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TOGGLE AMENITY
  |--------------------------------------------------------------------------
  */

  const toggleAmenity = (
    amenityId
  ) => {
    setSelectedAmenities(
      (current) =>
        current.includes(amenityId)
          ? current.filter(
              (item) =>
                item !== amenityId
            )
          : [
              ...current,
              amenityId,
            ]
    );

    if (errors.amenities) {
      setErrors((current) => ({
        ...current,
        amenities: "",
      }));
    }
  };

  /*
  |--------------------------------------------------------------------------
  | IMAGE SELECTION
  |--------------------------------------------------------------------------
  */

  const handleImageUpload = (
    event
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    const remainingSlots =
      10 - images.length;

    const selectedFiles =
      files.slice(
        0,
        remainingSlots
      );

    const imageObjects =
      selectedFiles.map(
        (file) => ({
          id: `${file.name}-${file.lastModified}-${Math.random()}`,
          file,
          preview:
            URL.createObjectURL(
              file
            ),
          isExisting: false,
        })
      );

    setImages(
      (current) => [
        ...current,
        ...imageObjects,
      ]
    );

    if (errors.images) {
      setErrors((current) => ({
        ...current,
        images: "",
      }));
    }

    event.target.value = "";
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE IMAGE
  |--------------------------------------------------------------------------
  */

  const removeImage = (
    imageId
  ) => {
    setImages((current) => {
      const imageToRemove =
        current.find(
          (image) =>
            image.id === imageId
        );

      /*
       * Only revoke object URLs for newly
       * uploaded local files.
       */

      if (
        imageToRemove &&
        !imageToRemove.isExisting &&
        imageToRemove.preview
      ) {
        URL.revokeObjectURL(
          imageToRemove.preview
        );
      }

      return current.filter(
        (image) =>
          image.id !== imageId
      );
    });
  };

  /*
  |--------------------------------------------------------------------------
  | ADD HOUSE RULE
  |--------------------------------------------------------------------------
  */

  const addRule = () => {
    const trimmedRule =
      newRule.trim();

    if (!trimmedRule) {
      return;
    }

    setRules(
      (current) => [
        ...current,
        trimmedRule,
      ]
    );

    setNewRule("");
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE HOUSE RULE
  |--------------------------------------------------------------------------
  */

  const removeRule = (
    ruleToRemove
  ) => {
    setRules(
      (current) =>
        current.filter(
          (rule) =>
            rule !== ruleToRemove
        )
    );
  };

  /*
|--------------------------------------------------------------------------
| ADD UNAVAILABLE DATE RANGE
|--------------------------------------------------------------------------
*/

const addUnavailableDateRange = () => {
  if (
    !unavailableStartDate ||
    !unavailableEndDate
  ) {
    return;
  }

  if (
    unavailableEndDate <
    unavailableStartDate
  ) {
    setErrors((current) => ({
      ...current,
      unavailableDates:
        "The end date must be after or the same as the start date.",
    }));

    return;
  }

  /*
   * Prevent duplicate/overlapping ranges.
   */

  const overlapsExistingRange =
    unavailableDates.some(
      (range) =>
        unavailableStartDate <= range.end &&
        unavailableEndDate >= range.start
    );

  if (overlapsExistingRange) {
    setErrors((current) => ({
      ...current,
      unavailableDates:
        "This date range overlaps an existing unavailable period.",
    }));

    return;
  }

  setUnavailableDates((current) => [
    ...current,
    {
      id: `${unavailableStartDate}-${unavailableEndDate}-${Date.now()}`,
      start: unavailableStartDate,
      end: unavailableEndDate,
    },
  ]);

  setUnavailableStartDate("");
  setUnavailableEndDate("");

  setErrors((current) => ({
    ...current,
    unavailableDates: "",
  }));
};

/*
|--------------------------------------------------------------------------
| REMOVE UNAVAILABLE DATE RANGE
|--------------------------------------------------------------------------
*/

const removeUnavailableDateRange = (
  rangeId
) => {
  setUnavailableDates((current) =>
    current.filter(
      (range) => range.id !== rangeId
    )
  );
};

  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.propertyName.trim()
    ) {
      newErrors.propertyName =
        "Property name is required.";
    }

    if (!formData.propertyType) {
      newErrors.propertyType =
        "Please select a property type.";
    }

    if (!formData.state) {
      newErrors.state =
        "State is required.";
    }

    if (!formData.city) {
      newErrors.city =
        "City is required.";
    }

    if (!formData.lga) {
      newErrors.lga =
        "LGA is required.";
    }

    if (
      !formData.address.trim()
    ) {
      newErrors.address =
        "Property address is required.";
    }

    if (
      !formData.description.trim()
    ) {
      newErrors.description =
        "Please describe your property.";
    }

    if (
      !formData.price ||
      Number(formData.price) <= 0
    ) {
      newErrors.price =
        "Enter a valid price per night.";
    }

    if (!images.length) {
      newErrors.images =
        "Please have at least one property photo.";
    }

    if (
      !selectedAmenities.length
    ) {
      newErrors.amenities =
        "Select at least one amenity.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  /*
  |--------------------------------------------------------------------------
  | UPLOAD NEW IMAGES
  |--------------------------------------------------------------------------
  */

  const uploadNewImagesToCloudinary =
    async () => {
      if (
        !CLOUDINARY_CLOUD_NAME ||
        !CLOUDINARY_UPLOAD_PRESET
      ) {
        throw new Error(
          "Cloudinary configuration is missing. Please check your frontend environment variables."
        );
      }

      /*
       * Only new images have a file.
       */

      const newImages =
        images.filter(
          (image) =>
            !image.isExisting &&
            image.file
        );

      const uploadedImages = [];

      for (
        const image of newImages
      ) {
        const uploadData =
          new FormData();

        uploadData.append(
          "file",
          image.file
        );

        uploadData.append(
          "upload_preset",
          CLOUDINARY_UPLOAD_PRESET
        );

        const response =
          await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: uploadData,
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.secure_url
        ) {
          throw new Error(
            data.error?.message ||
              "Unable to upload property image."
          );
        }

        uploadedImages.push(
          data.secure_url
        );
      }

      return uploadedImages;
    };

  /*
  |--------------------------------------------------------------------------
  | BUILD IMAGE ARRAY
  |--------------------------------------------------------------------------
  */

  const buildFinalImageArray =
    async () => {
      /*
       * Existing images are already URLs.
       */

      const existingImages =
        images
          .filter(
            (image) =>
              image.isExisting
          )
          .map(
            (image) =>
              image.url
          );

      /*
       * Upload only newly selected images.
       */

      const newImages =
        await uploadNewImagesToCloudinary();

      return [
        ...existingImages,
        ...newImages,
      ];
    };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setIsSubmitting(true);

    setErrors((current) => ({
      ...current,
      submit: "",
    }));

    try {
      /*
       * STEP 1
       *
       * Prepare images.
       */

      const finalImageUrls =
        await buildFinalImageArray();

      /*
       * Make absolutely sure there is
       * still at least one image.
       */

      if (!finalImageUrls.length) {
        throw new Error(
          "Please have at least one property photo."
        );
      }

      /*
       * STEP 2
       *
       * Build backend payload.
       *
       * Notice:
       *
       * owner is NOT included.
       *
       * slug is NOT included.
       *
       * status is NOT included.
       *
       * averageRating is NOT included.
       *
       * totalReviews is NOT included.
       *
       * isAvailable is NOT included.
       *
       * These belong to the backend.
       */

      const accommodationData = {
        name:
          formData.propertyName.trim(),

        description:
          formData.description.trim(),

        type:
          formData.propertyType,

        images:
          finalImageUrls,

        pricePerNight:
          Number(formData.price),

        location: {
          state:
            formData.state,

          city:
            formData.city,

          lga:
            formData.lga,

          address:
            formData.address.trim(),
        },

        amenities:
          selectedAmenities,

        bedrooms:
          Number(formData.bedrooms),

        bathrooms:
          Number(formData.bathrooms),

        maxGuests:
          Number(formData.guests),

        checkInTime:
          formData.checkInTime.trim(),

        checkOutTime:
          formData.checkOutTime.trim(),

        propertyWebsite:
          formData.website.trim(),
      };

      console.log(
        isEditMode
          ? "Updating accommodation:"
          : "Creating accommodation:",
        accommodationData
      );

      /*
       * STEP 3
       *
       * CREATE
       */

      let response;

      if (!isEditMode) {
        response = await API.post(
          "/accommodations",
          accommodationData
        );
      } else {
        /*
         * EDIT
         *
         * PUT /accommodations/:id
         */

        response = await API.put(
          `/accommodations/${editId}`,
          accommodationData
        );
      }

      const data =
        response.data;

      console.log(
        isEditMode
          ? "Accommodation updated:"
          : "Accommodation created:",
        data
      );

      /*
       * STEP 4
       *
       * Clean object URLs.
       */

      images.forEach(
        (image) => {
          if (
            !image.isExisting &&
            image.preview
          ) {
            URL.revokeObjectURL(
              image.preview
            );
          }
        }
      );

      /*
       * EDIT MODE
       *
       * Keep the user on the page and
       * update the current UI with the
       * final images.
       */

      if (isEditMode) {
        setImages(
          finalImageUrls.map(
            (url, index) => ({
              id: `updated-${index}-${url}`,
              url,
              isExisting: true,
            })
          )
        );

        alert(
          data.message ||
            "Your property has been updated successfully."
        );

        return;
      }

      /*
       * CREATE MODE
       *
       * Reset everything.
       */

      setFormData({
        ...initialFormData,
      });

      setSelectedAmenities(
        []
      );

      setRules([
        ...defaultRules,
      ]);

      setNewRule("");

      setImages([]);

      setErrors({});

      alert(
        data.message ||
          "Your property has been submitted successfully for review."
      );
    } catch (error) {
      console.error(
        isEditMode
          ? "Update property error:"
          : "Submit property error:",
        error
      );

      const message =
        error.response?.data
          ?.message ||
        error.message ||
        (isEditMode
          ? "Unable to update your property. Please try again."
          : "Unable to submit your property. Please try again.");

      setErrors({
        submit: message,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PRICE CALCULATION
  |--------------------------------------------------------------------------
  */

  const TRIPGUARD_FEE_PERCENTAGE =
    10;

  const basePrice =
    Number(formData.price) || 0;

  const tripGuardFee =
    basePrice *
    (TRIPGUARD_FEE_PERCENTAGE /
      100);

  const customerPrice =
    basePrice +
    tripGuardFee;

  /*
  |--------------------------------------------------------------------------
  | LOADING SCREEN
  |--------------------------------------------------------------------------
  */

  if (isLoadingProperty) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F2]">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1F5ED]">
            <Loader2 className="h-7 w-7 animate-spin text-[#397A69]" />
          </div>

          <p className="mt-5 text-sm font-semibold text-[#173C37]">
            Loading property...
          </p>

          <p className="mt-2 text-xs text-[#7A8581]">
            Preparing your property information.
          </p>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#F7F7F2] text-[#172322]">

      {/* TOP BAR */}
      <div className="border-b border-[#E3E3DC] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 lg:px-8">

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-[#397A69] transition hover:text-[#173C37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#397A69]" />

            <span className="text-sm font-semibold text-[#173C37]">
              TripGuard
            </span>
          </div>

        </div>
      </div>

      {/* HEADER */}
      <section className="border-b border-[#E3E3DC] bg-white">
        <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">

          <div className="max-w-2xl">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
              {isEditMode
                ? "Edit your property"
                : "List your property"}
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {isEditMode
                ? "Keep your property information up to date."
                : "Give travellers a place worth staying."}
            </h1>

            <p className="mt-5 text-[15px] leading-8 text-[#697570]">
              {isEditMode
                ? "Update your property details, photos, amenities and pricing. Your changes will be saved to your TripGuard property."
                : "Tell travellers about your property, the experience you offer and everything they need to know before booking."}
            </p>

          </div>

          {/* PROGRESS */}
          <div className="mt-10 flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-[#173C37]" />
            <div className="h-2 flex-1 rounded-full bg-[#DDE5E1]" />
            <div className="h-2 flex-1 rounded-full bg-[#DDE5E1]" />
          </div>

          <p className="mt-3 text-xs text-[#7A8581]">
            Complete all required information before{" "}
            {isEditMode
              ? "saving your changes."
              : "submitting your property."}
          </p>

          {isEditMode &&
            propertyStatus && (
              <div className="mt-5 inline-flex rounded-full bg-[#F1F5F3] px-4 py-2 text-xs font-semibold capitalize text-[#397A69]">
                Property status:{" "}
                <span className="ml-1">
                  {propertyStatus}
                </span>
              </div>
            )}

          {errors.submit && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errors.submit}
            </div>
          )}

        </div>
      </section>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14"
      >

        {/* BASIC INFORMATION */}
        <section className="rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
            01
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Tell us about your property
          </h2>

          <p className="mt-2 text-sm text-[#7A8581]">
            Start with the basic information travellers will see first.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            {/* PROPERTY NAME */}
            <div className="sm:col-span-2">

              <label
                htmlFor="propertyName"
                className="mb-2 block text-sm font-semibold"
              >
                Property name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                id="propertyName"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                placeholder="e.g. The Meridian House"
                className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 ${
                  errors.propertyName
                    ? "border-red-400"
                    : "border-[#DCE2DF]"
                }`}
              />

              {errors.propertyName && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.propertyName}
                </p>
              )}

            </div>

            {/* PROPERTY TYPE */}
            <div>

              <label
                htmlFor="propertyType"
                className="mb-2 block text-sm font-semibold"
              >
                Property type{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">

                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 ${
                    errors.propertyType
                      ? "border-red-400"
                      : "border-[#DCE2DF]"
                  }`}
                >
                  <option value="">
                    Select property type
                  </option>

                  {propertyTypes.map(
                    (type, index) => (
                      <option
                        key={`${type.label}-${index}`}
                        value={type.value}
                      >
                        {type.label}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />

              </div>

              {errors.propertyType && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.propertyType}
                </p>
              )}

            </div>

            {/* PRICE */}
            <div>

              <label
                htmlFor="price"
                className="mb-2 block text-sm font-semibold"
              >
                Price per night{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#397A69]">
                  ₦
                </span>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="185000"
                  className={`h-12 w-full rounded-xl border bg-white pl-9 pr-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 ${
                    errors.price
                      ? "border-red-400"
                      : "border-[#DCE2DF]"
                  }`}
                />

              </div>

              {errors.price && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.price}
                </p>
              )}

              {basePrice > 0 && (
                <div className="mt-3 rounded-xl bg-[#F4F8F6] p-3 text-xs text-[#697570]">

                  <div className="flex justify-between">
                    <span>
                      Your listed price
                    </span>

                    <span className="font-semibold text-[#173C37]">
                      ₦
                      {basePrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span>
                      TripGuard fee (10%)
                    </span>

                    <span>
                      ₦
                      {tripGuardFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between border-t border-[#DDE5E1] pt-2">

                    <span className="font-semibold text-[#173C37]">
                      Guest pays
                    </span>

                    <span className="font-bold text-[#397A69]">
                      ₦
                      {customerPrice.toLocaleString()}
                    </span>

                  </div>

                </div>
              )}

            </div>

          </div>
        </section>

        {/* LOCATION */}
        <section className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E1F5ED]">
              <MapPin className="h-5 w-5 text-[#277765]" />
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
                02
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Where is your property?
              </h2>

              <p className="mt-2 text-sm text-[#7A8581]">
                This helps travellers find your property using TripGuard&apos;s location search.
              </p>

            </div>

          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">

            {/* STATE */}
            <div>

              <label
                htmlFor="state"
                className="mb-2 block text-sm font-semibold"
              >
                State{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">

                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 ${
                    errors.state
                      ? "border-red-400"
                      : "border-[#DCE2DF]"
                  }`}
                >
                  <option value="">
                    Select state
                  </option>

                  {statesData.map(
                    (state) => (
                      <option
                        key={state.name}
                        value={state.name}
                      >
                        {state.name}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />

              </div>

              {errors.state && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.state}
                </p>
              )}

            </div>

            {/* CITY */}
            <div>

              <label
                htmlFor="city"
                className="mb-2 block text-sm font-semibold"
              >
                City{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">

                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  disabled={!formData.state}
                  className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 disabled:cursor-not-allowed disabled:bg-[#F3F5F4] disabled:text-[#9AA29F] ${
                    errors.city
                      ? "border-red-400"
                      : "border-[#DCE2DF]"
                  }`}
                >
                  <option value="">
                    {formData.state
                      ? "Select city"
                      : "Select state first"}
                  </option>

                  {availableCities.map(
                    (city) => (
                      <option
                        key={city}
                        value={city}
                      >
                        {city}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />

              </div>

              {errors.city && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.city}
                </p>
              )}

            </div>

            {/* LGA */}
            <div>

              <label
                htmlFor="lga"
                className="mb-2 block text-sm font-semibold"
              >
                LGA{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">

                <select
                  id="lga"
                  name="lga"
                  value={formData.lga}
                  onChange={handleLgaChange}
                  disabled={!formData.state}
                  className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 disabled:cursor-not-allowed disabled:bg-[#F3F5F4] disabled:text-[#9AA29F] ${
                    errors.lga
                      ? "border-red-400"
                      : "border-[#DCE2DF]"
                  }`}
                >
                  <option value="">
                    {formData.state
                      ? "Select LGA"
                      : "Select state first"}
                  </option>

                  {availableLgas.map(
                    (lga) => (
                      <option
                        key={lga}
                        value={lga}
                      >
                        {lga}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />

              </div>

              {errors.lga && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.lga}
                </p>
              )}

            </div>

            {/* ADDRESS */}
            <div className="sm:col-span-3">

              <label
                htmlFor="address"
                className="mb-2 block text-sm font-semibold"
              >
                Full property address{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter the full address of the property"
                className={`h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 ${
                  errors.address
                    ? "border-red-400"
                    : "border-[#DCE2DF]"
                }`}
              />

              {errors.address && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.address}
                </p>
              )}

            </div>

            {/* WEBSITE */}
            <div className="sm:col-span-3">

              <label
                htmlFor="website"
                className="mb-2 flex items-center gap-2 text-sm font-semibold"
              >
                Property website

                <span className="text-xs font-normal text-[#9AA29F]">
                  Optional
                </span>
              </label>

              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourproperty.com"
                className="h-12 w-full rounded-xl border border-[#DCE2DF] px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
              />

            </div>

          </div>
        </section>

        {/* PROPERTY DETAILS */}
        <section className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
            03
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Property details
          </h2>

          <p className="mt-2 text-sm text-[#7A8581]">
            Tell guests how many people your property can comfortably accommodate.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">

            {/* GUESTS */}
            <div>

              <label
                htmlFor="guests"
                className="mb-2 block text-sm font-semibold"
              >
                Maximum guests
              </label>

              <input
                id="guests"
                name="guests"
                type="number"
                min="1"
                value={formData.guests}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[#DCE2DF] px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
              />

            </div>

            {/* BEDROOMS */}
            <div>

              <label
                htmlFor="bedrooms"
                className="mb-2 block text-sm font-semibold"
              >
                Bedrooms
              </label>

              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[#DCE2DF] px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
              />

            </div>

            {/* BATHROOMS */}
            <div>

              <label
                htmlFor="bathrooms"
                className="mb-2 block text-sm font-semibold"
              >
                Bathrooms
              </label>

              <input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                step="0.5"
                value={formData.bathrooms}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[#DCE2DF] px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
              />

            </div>

          </div>
        </section>

        {/* DESCRIPTION */}
        <section className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
            04
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Describe your property
          </h2>

          <p className="mt-2 text-sm text-[#7A8581]">
            Give travellers a clear idea of what makes your property special.
          </p>

          <div className="mt-8">

            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold"
            >
              Property description{" "}
              <span className="text-red-500">*</span>
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={7}
              maxLength={1500}
              placeholder="Tell travellers about your property, its atmosphere, location, rooms and what makes staying there special..."
              className={`w-full resize-none rounded-2xl border bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 ${
                errors.description
                  ? "border-red-400"
                  : "border-[#DCE2DF]"
              }`}
            />

            <div className="mt-2 flex justify-between">

              {errors.description ? (
                <p className="text-xs text-red-500">
                  {errors.description}
                </p>
              ) : (
                <span />
              )}

              <span className="text-xs text-[#9AA29F]">
                {formData.description.length}/1500
              </span>

            </div>

          </div>
        </section>

        {/* PHOTOS */}
        <section className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
            05
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Add property photos
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#7A8581]">
            Upload clear photos of your property. Your first photo will be used as the main image.
          </p>

          <div className="mt-8">

            {images.length < 10 && (
              <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#CBD8D3] bg-[#F8FBF9] px-6 text-center transition hover:border-[#397A69] hover:bg-[#F2F8F5]">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1F5ED]">
                  <ImagePlus className="h-7 w-7 text-[#277765]" />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#173C37]">
                  {isEditMode
                    ? "Add more property photos"
                    : "Upload property photos"}
                </p>

                <p className="mt-2 text-xs text-[#7A8581]">
                  PNG, JPG or WEBP · Up to 10 photos
                </p>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

              </label>
            )}

            {errors.images && (
              <p className="mt-3 text-xs text-red-500">
                {errors.images}
              </p>
            )}

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                {images.map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      key={
                        image.id
                      }
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-[#DDE4E1]"
                    >

                      <img
                        src={
                          image.isExisting
                            ? image.url
                            : image.preview
                        }
                        alt={`Property ${
                          index + 1
                        }`}
                        className="h-full w-full object-cover"
                      />

                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#173C37] px-2.5 py-1 text-[10px] font-bold text-white">
                          Main photo
                        </span>
                      )}

                      {!image.isExisting && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-[#397A69] px-2.5 py-1 text-[10px] font-bold text-white">
                          New
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            image.id
                          )
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 opacity-0 shadow transition group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

            <p className="mt-4 text-xs text-[#8A9390]">
              {images.length}/10 photos selected
            </p>

            {isEditMode && (
              <p className="mt-2 text-xs text-[#8A9390]">
                Removing an existing photo will remove it from this property when you save your changes.
              </p>
            )}

          </div>
        </section>

        {/* AMENITIES */}
        <section className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
            06
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            What does your property offer?
          </h2>

          <p className="mt-2 text-sm text-[#7A8581]">
            Select all amenities available to your guests.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {amenities.map(
              (amenity) => {
                const Icon =
                  amenity.icon;

                const isSelected =
                  selectedAmenities.includes(
                    amenity.id
                  );

                return (
                  <button
                    key={
                      amenity.id
                    }
                    type="button"
                    onClick={() =>
                      toggleAmenity(
                        amenity.id
                      )
                    }
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#397A69] bg-[#EAF6F1]"
                        : "border-[#E0E4E1] bg-white hover:border-[#AFC8BE]"
                    }`}
                  >

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isSelected
                          ? "bg-[#173C37] text-[#63E6BE]"
                          : "bg-[#F1F4F2] text-[#397A69]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="flex-1 text-sm font-semibold">
                      {
                        amenity.label
                      }
                    </span>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-[#397A69] bg-[#397A69] text-white"
                          : "border-[#CBD5D1]"
                      }`}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>

                  </button>
                );
              }
            )}

          </div>

          {errors.amenities && (
            <p className="mt-4 text-xs text-red-500">
              {errors.amenities}
            </p>
          )}

        </section>

        {/* HOUSE RULES */}
        <section className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
            07
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            House rules & policies
          </h2>

          <p className="mt-2 text-sm text-[#7A8581]">
            Let guests know what is expected during their stay.
          </p>

          <div className="mt-8 space-y-3">

            {rules.map(
              (rule, index) => (
                <div
                  key={`${rule}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[#E2E6E3] bg-[#FAFBF9] px-4 py-3"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E1F5ED]">
                      <Check className="h-3.5 w-3.5 text-[#277765]" />
                    </div>

                    <span className="text-sm text-[#596661]">
                      {rule}
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeRule(
                        rule
                      )
                    }
                    className="text-xs font-semibold text-[#9A6666] transition hover:text-red-600"
                  >
                    Remove
                  </button>

                </div>
              )
            )}

          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <input
              type="text"
              value={newRule}
              onChange={(event) =>
                setNewRule(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  event.preventDefault();
                  addRule();
                }
              }}
              placeholder="Add another house rule"
              className="h-12 flex-1 rounded-xl border border-[#DCE2DF] px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
            />

            <button
              type="button"
              onClick={addRule}
              className="h-12 rounded-xl border border-[#173C37] px-5 text-sm font-semibold text-[#173C37] transition hover:bg-[#173C37] hover:text-white"
            >
              Add rule
            </button>

          </div>

          <p className="mt-4 text-xs text-[#9AA29F]">
            House rules are currently displayed on this form only. Your current Accommodation schema does not yet contain a rules field.
          </p>

        </section>

        {/* CHECK IN / CHECK OUT */}
        <section className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
            08
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Check-in & check-out
          </h2>

          <p className="mt-2 text-sm text-[#7A8581]">
            Tell guests when they can arrive and when they should leave.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            <div>

              <label
                htmlFor="checkInTime"
                className="mb-2 block text-sm font-semibold"
              >
                Check-in time
              </label>

              <input
                id="checkInTime"
                name="checkInTime"
                value={formData.checkInTime}
                onChange={handleChange}
                placeholder="14:00"
                className="h-12 w-full rounded-xl border border-[#DCE2DF] px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
              />

            </div>

            <div>

              <label
                htmlFor="checkOutTime"
                className="mb-2 block text-sm font-semibold"
              >
                Check-out time
              </label>

              <input
                id="checkOutTime"
                name="checkOutTime"
                value={formData.checkOutTime}
                onChange={handleChange}
                placeholder="12:00"
                className="h-12 w-full rounded-xl border border-[#DCE2DF] px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
              />

            </div>

          </div>
        </section>

        {/* UNAVAILABLE DATES */}
<section className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
    09
  </p>

  <h2 className="mt-2 text-2xl font-semibold">
    Unavailable dates
  </h2>

  <p className="mt-2 text-sm leading-6 text-[#7A8581]">
    Let travellers know when your property is unavailable for
    bookings. These dates will be blocked on your property
    calendar.
  </p>

  <div className="mt-8 rounded-2xl border border-[#DCE3E1] bg-[#F8FBF9] p-5">

    <div className="grid gap-5 sm:grid-cols-2">

      {/* START DATE */}
      <div>

        <label
          htmlFor="unavailableStartDate"
          className="mb-2 block text-sm font-semibold"
        >
          Unavailable from
        </label>

        <input
          id="unavailableStartDate"
          type="date"
          value={unavailableStartDate}
          min={new Date()
            .toISOString()
            .slice(0, 10)}
          onChange={(event) => {
            setUnavailableStartDate(
              event.target.value
            );

            if (
              errors.unavailableDates
            ) {
              setErrors((current) => ({
                ...current,
                unavailableDates: "",
              }));
            }
          }}
          className="h-12 w-full rounded-xl border border-[#DCE2DF] bg-white px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
        />

      </div>

      {/* END DATE */}
      <div>

        <label
          htmlFor="unavailableEndDate"
          className="mb-2 block text-sm font-semibold"
        >
          Unavailable until
        </label>

        <input
          id="unavailableEndDate"
          type="date"
          value={unavailableEndDate}
          min={
            unavailableStartDate ||
            new Date()
              .toISOString()
              .slice(0, 10)
          }
          onChange={(event) => {
            setUnavailableEndDate(
              event.target.value
            );

            if (
              errors.unavailableDates
            ) {
              setErrors((current) => ({
                ...current,
                unavailableDates: "",
              }));
            }
          }}
          className="h-12 w-full rounded-xl border border-[#DCE2DF] bg-white px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
        />

      </div>

    </div>

    {errors.unavailableDates && (
      <p className="mt-3 text-xs text-red-500">
        {errors.unavailableDates}
      </p>
    )}

    <button
      type="button"
      onClick={addUnavailableDateRange}
      className="mt-5 inline-flex h-11 items-center justify-center rounded-xl border border-[#173C37] px-5 text-sm font-semibold text-[#173C37] transition hover:bg-[#173C37] hover:text-white"
    >
      Add unavailable dates
    </button>

  </div>

  {/* EXISTING UNAVAILABLE RANGES */}
  {unavailableDates.length > 0 && (
    <div className="mt-6">

      <h3 className="text-sm font-semibold text-[#173C37]">
        Blocked periods
      </h3>

      <div className="mt-3 space-y-3">

        {unavailableDates.map(
          (range) => (
            <div
              key={range.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-[#E2E6E3] bg-[#FAFBF9] px-4 py-3"
            >

              <div>
                <p className="text-sm font-semibold text-[#173C37]">
                  {new Date(
                    `${range.start}T00:00:00`
                  ).toLocaleDateString(
                    "en-NG",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}

                  {" – "}

                  {new Date(
                    `${range.end}T00:00:00`
                  ).toLocaleDateString(
                    "en-NG",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>

                <p className="mt-1 text-xs text-[#8A9390]">
                  Property unavailable during this period
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  removeUnavailableDateRange(
                    range.id
                  )
                }
                className="text-xs font-semibold text-[#9A6666] transition hover:text-red-600"
              >
                Remove
              </button>

            </div>
          )
        )}

      </div>

    </div>
  )}

  {unavailableDates.length === 0 && (
    <p className="mt-5 text-xs text-[#9AA29F]">
      No unavailable dates have been added yet.
    </p>
  )}

</section>

        {/* TRIPGUARD NOTICE */}
        <section className="mt-8 rounded-[28px] bg-[#173C37] p-7 text-white sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#63E6BE]/15">
              <ShieldCheck className="h-7 w-7 text-[#63E6BE]" />
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
                TripGuard protection
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Help travellers stay connected.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
                When a guest books your property through TripGuard, they can choose someone they trust to receive notifications when they check in and check out.
              </p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75">

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#63E6BE]" />
                  Trusted contact notifications
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#63E6BE]" />
                  Check-in confirmation
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#63E6BE]" />
                  Check-out notification
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* SUBMIT */}
        <div className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E1F5ED]">
              <Upload className="h-5 w-5 text-[#277765]" />
            </div>

            <div>

              <h3 className="font-semibold">
                {isEditMode
                  ? "Ready to save your changes?"
                  : "Ready to list your property?"}
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#7A8581]">
                {isEditMode
                  ? "Your updated property information will be saved to your TripGuard property."
                  : "Your property will be reviewed by the TripGuard team before it becomes visible to travellers."}
              </p>

            </div>

          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-[#8A9390]">
              Fields marked with{" "}
              <span className="text-red-500">
                *
              </span>{" "}
              are required.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173C37] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#23584E] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  {isEditMode
                    ? "Saving changes..."
                    : "Submitting..."}
                </>
              ) : (
                <>
                  {isEditMode
                    ? "Save changes"
                    : "Submit property"}

                  <ArrowRight className="h-4 w-4" />
                </>
              )}

            </button>

          </div>

        </div>

      </form>
    </main>
  );
};

export default ListPropertyPage;