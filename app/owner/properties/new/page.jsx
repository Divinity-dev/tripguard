"use client";

import Link from "next/link";
import { useState } from "react";
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
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const propertyTypes = [
  "Luxury Hotel",
  "Boutique Hotel",
  "Serviced Apartment",
  "Apartment",
  "Short-let Apartment",
  "Guest House",
  "Resort",
  "Villa",
  "Lodge",
  "Other",
];

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

const defaultRules = [
  "Check-in from 2:00 PM",
  "Check-out before 12:00 PM",
  "No smoking indoors",
  "Pets are not allowed",
  "Valid identification required",
];

export default function ListPropertyPage() {
  const [formData, setFormData] = useState({
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
    beds: "1",
    bathrooms: "1",
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 PM",
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [rules, setRules] = useState(defaultRules);

  const [newRule, setNewRule] = useState("");

  const [images, setImages] = useState([]);

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

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

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities((current) =>
      current.includes(amenityId)
        ? current.filter((item) => item !== amenityId)
        : [...current, amenityId]
    );

    if (errors.amenities) {
      setErrors((current) => ({
        ...current,
        amenities: "",
      }));
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const remainingSlots = 10 - images.length;

    const selectedFiles = files.slice(0, remainingSlots);

    const imageObjects = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...imageObjects]);

    if (errors.images) {
      setErrors((current) => ({
        ...current,
        images: "",
      }));
    }

    event.target.value = "";
  };

  const removeImage = (imageId) => {
    setImages((current) => {
      const imageToRemove = current.find(
        (image) => image.id === imageId
      );

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return current.filter((image) => image.id !== imageId);
    });
  };

  const addRule = () => {
    const trimmedRule = newRule.trim();

    if (!trimmedRule) return;

    setRules((current) => [...current, trimmedRule]);
    setNewRule("");
  };

  const removeRule = (ruleToRemove) => {
    setRules((current) =>
      current.filter((rule) => rule !== ruleToRemove)
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.propertyName.trim()) {
      newErrors.propertyName = "Property name is required.";
    }

    if (!formData.propertyType) {
      newErrors.propertyType = "Please select a property type.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.lga.trim()) {
      newErrors.lga = "LGA is required.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Property address is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please describe your property.";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Enter a valid price per night.";
    }

    if (!images.length) {
      newErrors.images = "Please upload at least one property photo.";
    }

    if (!selectedAmenities.length) {
      newErrors.amenities = "Select at least one amenity.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const uploadImagesToCloudinary = async () => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary configuration is missing. Please check your frontend environment variables."
      );
    }

    const uploadedImages = [];

    for (const image of images) {
      const uploadData = new FormData();

      uploadData.append("file", image.file);
      uploadData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.secure_url) {
        throw new Error(
          data.error?.message ||
            "Unable to upload property image."
        );
      }

      uploadedImages.push(data.secure_url);
    }

    return uploadedImages;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * STEP 1
       * Upload all selected images to Cloudinary.
       */
      const imageUrls = await uploadImagesToCloudinary();

      /*
       * STEP 2
       * Build the accommodation payload.
       *
       * Notice that there is NO owner field here.
       *
       * The backend gets the owner from:
       * req.user.id
       *
       * This means one property owner account can own
       * multiple accommodations.
       */
      const accommodationData = {
        name: formData.propertyName.trim(),

        description: formData.description.trim(),

        type: formData.propertyType,

        images: imageUrls,

        pricePerNight: Number(formData.price),

        location: {
          state: formData.state.trim(),
          city: formData.city.trim(),
          lga: formData.lga.trim(),
          address: formData.address.trim(),
        },

        amenities: selectedAmenities,

        bedrooms: Number(formData.bedrooms),

        bathrooms: Number(formData.bathrooms),

        maxGuests: Number(formData.guests),

        checkInTime: formData.checkInTime.trim(),

        checkOutTime: formData.checkOutTime.trim(),

        propertyWebsite: formData.website.trim(),

        /*
         * These are retained from the form for future
         * accommodation model support.
         */
        beds: Number(formData.beds),

        rules,
      };

      /*
       * STEP 3
       * Send the property to the authenticated backend.
       */
      const response = await fetch(
        `${API_URL}/accommodations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(accommodationData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to submit your property."
        );
      }

      /*
       * STEP 4
       * Clean up local image preview URLs.
       */
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });

      /*
       * STEP 5
       * Reset the form after successful submission.
       */
      setFormData({
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
        beds: "1",
        bathrooms: "1",
        checkInTime: "2:00 PM",
        checkOutTime: "12:00 PM",
      });

      setSelectedAmenities([]);
      setRules(defaultRules);
      setNewRule("");
      setImages([]);
      setErrors({});

      alert(
        data.message ||
          "Your property has been submitted successfully for review."
      );
    } catch (error) {
      console.error("Submit property error:", error);

      setErrors({
        submit:
          error.message ||
          "Unable to submit your property. Please try again.",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const TRIPGUARD_FEE_PERCENTAGE = 10;

  const basePrice = Number(formData.price) || 0;

const tripGuardFee =
  basePrice * (TRIPGUARD_FEE_PERCENTAGE / 100);

const customerPrice = basePrice + tripGuardFee;

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
              List your property
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Give travellers a place worth staying.
            </h1>

            <p className="mt-5 text-[15px] leading-8 text-[#697570]">
              Tell travellers about your property, the experience you
              offer and everything they need to know before booking.
            </p>
          </div>

          {/* PROGRESS */}
          <div className="mt-10 flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-[#173C37]" />
            <div className="h-2 flex-1 rounded-full bg-[#DDE5E1]" />
            <div className="h-2 flex-1 rounded-full bg-[#DDE5E1]" />
          </div>

          <p className="mt-3 text-xs text-[#7A8581]">
            Complete all required information before submitting your
            property.
          </p>

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

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
              01
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Tell us about your property
            </h2>

            <p className="mt-2 text-sm text-[#7A8581]">
              Start with the basic information travellers will see
              first.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            {/* PROPERTY NAME */}
            <div className="sm:col-span-2">
              <label
                htmlFor="propertyName"
                className="mb-2 block text-sm font-semibold"
              >
                Property name <span className="text-red-500">*</span>
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
                Property type <span className="text-red-500">*</span>
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
                  <option value="">Select property type</option>

                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
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
                Price per night <span className="text-red-500">*</span>
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
                This helps travellers find your property using
                TripGuard&apos;s location search.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">

            <div>
              <label
                htmlFor="state"
                className="mb-2 block text-sm font-semibold"
              >
                State <span className="text-red-500">*</span>
              </label>

              <input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Lagos"
                className={`h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 ${
                  errors.state
                    ? "border-red-400"
                    : "border-[#DCE2DF]"
                }`}
              />

              {errors.state && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.state}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-semibold"
              >
                City <span className="text-red-500">*</span>
              </label>

              <input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Lagos"
                className={`h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 ${
                  errors.city
                    ? "border-red-400"
                    : "border-[#DCE2DF]"
                }`}
              />

              {errors.city && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lga"
                className="mb-2 block text-sm font-semibold"
              >
                LGA <span className="text-red-500">*</span>
              </label>

              <input
                id="lga"
                name="lga"
                value={formData.lga}
                onChange={handleChange}
                placeholder="e.g. Eti-Osa"
                className={`h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 ${
                  errors.lga
                    ? "border-red-400"
                    : "border-[#DCE2DF]"
                }`}
              />

              {errors.lga && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.lga}
                </p>
              )}
            </div>

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

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
              03
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Property details
            </h2>

            <p className="mt-2 text-sm text-[#7A8581]">
              Tell guests how many people your property can
              comfortably accommodate.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

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

            <div>
              <label
                htmlFor="beds"
                className="mb-2 block text-sm font-semibold"
              >
                Beds
              </label>

              <input
                id="beds"
                name="beds"
                type="number"
                min="0"
                value={formData.beds}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[#DCE2DF] px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
              />
            </div>

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

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
              04
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Describe your property
            </h2>

            <p className="mt-2 text-sm text-[#7A8581]">
              Give travellers a clear idea of what makes your
              property special.
            </p>
          </div>

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

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
              05
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Add property photos
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#7A8581]">
              Upload clear photos of your property. Your first photo
              will be used as the main image.
            </p>
          </div>

          <div className="mt-8">

            {images.length < 10 && (
              <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#CBD8D3] bg-[#F8FBF9] px-6 text-center transition hover:border-[#397A69] hover:bg-[#F2F8F5]">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1F5ED]">
                  <ImagePlus className="h-7 w-7 text-[#277765]" />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#173C37]">
                  Upload property photos
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
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-[#DDE4E1]"
                  >
                    <img
                      src={image.preview}
                      alt={`Property ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#173C37] px-2.5 py-1 text-[10px] font-bold text-white">
                        Main photo
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 opacity-0 shadow transition group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-4 text-xs text-[#8A9390]">
              {images.length}/10 photos selected
            </p>
          </div>
        </section>

        {/* AMENITIES */}
        <section className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
              06
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              What does your property offer?
            </h2>

            <p className="mt-2 text-sm text-[#7A8581]">
              Select all amenities available to your guests.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {amenities.map((amenity) => {
              const Icon = amenity.icon;

              const isSelected = selectedAmenities.includes(
                amenity.id
              );

              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
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
                    {amenity.label}
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
            })}
          </div>

          {errors.amenities && (
            <p className="mt-4 text-xs text-red-500">
              {errors.amenities}
            </p>
          )}
        </section>

        {/* HOUSE RULES */}
        <section className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
              07
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              House rules & policies
            </h2>

            <p className="mt-2 text-sm text-[#7A8581]">
              Let guests know what is expected during their stay.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {rules.map((rule) => (
              <div
                key={rule}
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
                  onClick={() => removeRule(rule)}
                  className="text-xs font-semibold text-[#9A6666] transition hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newRule}
              onChange={(event) => setNewRule(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
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
        </section>

        {/* CHECK-IN / CHECK-OUT */}
        <section className="mt-8 rounded-[28px] border border-[#E2E3DC] bg-white p-6 shadow-sm sm:p-8">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
              08
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Check-in & check-out
            </h2>

            <p className="mt-2 text-sm text-[#7A8581]">
              Tell guests when they can arrive and when they should
              leave.
            </p>
          </div>

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
                placeholder="2:00 PM"
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
                placeholder="12:00 PM"
                className="h-12 w-full rounded-xl border border-[#DCE2DF] px-4 text-sm outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
              />
            </div>
          </div>
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
                When a guest books your property through TripGuard,
                they can choose someone they trust to receive
                notifications when they check in and check out.
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
                Ready to list your property?
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#7A8581]">
                Your property will be reviewed by the TripGuard team
                before it becomes visible to travellers.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-[#8A9390]">
              Fields marked with{" "}
              <span className="text-red-500">*</span>{" "}
              are required.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173C37] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#23584E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit property"}

              {!isSubmitting && (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}