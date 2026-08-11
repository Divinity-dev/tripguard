"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Mail,
  LockKeyhole,
  Database,
  UserCheck,
} from "lucide-react";

const PrivacyPolicyPage = () => {
  const sections = [
    {
      number: "01",
      title: "Information We Collect",
      content: (
        <>
          <p>
            We may collect information that you provide directly when you
            create an account, search for accommodation, make a booking,
            communicate with us, or use other features of TripGuard.
          </p>

          <h3>Account information</h3>
          <p>
            This may include your name, email address, phone number, password,
            and other information required to create and manage your account.
          </p>

          <h3>Booking information</h3>
          <p>
            When you make a booking, we may collect information such as your
            accommodation, booking dates, guest information, and other details
            necessary to process and manage the booking.
          </p>

          <h3>Trusted contact information</h3>
          <p>
            If you use TripGuard's safety notification feature, we may collect
            the name and email address of the loved one or trusted contact you
            provide. This information is used to send relevant booking,
            check-in, and check-out notifications.
          </p>

          <h3>Accommodation information</h3>
          <p>
            Accommodation providers may provide information about their
            properties, including property names, descriptions, locations,
            images, amenities, contact information, and booking-related
            information.
          </p>
        </>
      ),
    },
    {
      number: "02",
      title: "Payment Information",
      content: (
        <>
          <p>
            Payments made through TripGuard may be processed by third-party
            payment providers. Where applicable, payment information is
            handled by the relevant payment processor in accordance with its
            own privacy and security policies.
          </p>

          <p>
            TripGuard does not need to store your full card details to provide
            booking services. We may receive limited transaction information,
            such as payment status, transaction reference, amount, and date,
            for purposes including confirming bookings, refunds, accounting,
            and customer support.
          </p>
        </>
      ),
    },
    {
      number: "03",
      title: "How We Use Your Information",
      content: (
        <>
          <p>We may use information we collect to:</p>

          <ul>
            <li>Create and manage user accounts.</li>
            <li>Process and manage accommodation bookings.</li>
            <li>Process payments and related transactions.</li>
            <li>Send booking confirmations and important booking updates.</li>
            <li>
              Send safety-related notifications to the trusted contact
              provided by a traveller.
            </li>
            <li>Provide customer support.</li>
            <li>Improve the TripGuard platform and user experience.</li>
            <li>
              Detect, prevent, and investigate fraudulent or abusive activity.
            </li>
            <li>Maintain the security and integrity of our services.</li>
            <li>Comply with applicable legal obligations.</li>
          </ul>
        </>
      ),
    },
    {
      number: "04",
      title: "Safety Notifications",
      content: (
        <>
          <p>
            One of TripGuard's features allows travellers to provide the email
            address of a trusted person who can receive selected information
            about their accommodation booking.
          </p>

          <p>
            Depending on the feature available at the time, this may include
            information relating to the traveller's accommodation, check-in,
            and check-out.
          </p>

          <p>
            Travellers should only provide contact information belonging to a
            person they are comfortable receiving these notifications.
          </p>
        </>
      ),
    },
    {
      number: "05",
      title: "Information Sharing",
      content: (
        <>
          <p>
            We do not sell your personal information. We may share information
            when necessary to operate TripGuard, provide requested services,
            process transactions, or comply with legal obligations.
          </p>

          <p>
            This may include sharing relevant information with accommodation
            providers, payment processors, email service providers, hosting
            providers, analytics providers, customer support services, and
            other trusted service providers that help us operate the platform.
          </p>
        </>
      ),
    },
    {
      number: "06",
      title: "Data Security",
      content: (
        <>
          <p>
            We take reasonable technical and organisational measures to
            protect personal information against unauthorised access,
            alteration, disclosure, or destruction.
          </p>

          <p>
            However, no method of transmitting or storing information over the
            internet can be guaranteed to be completely secure.
          </p>
        </>
      ),
    },
    {
      number: "07",
      title: "Data Retention",
      content: (
        <>
          <p>
            We retain personal information for as long as reasonably necessary
            to provide our services, maintain business and transaction
            records, resolve disputes, enforce agreements, and comply with
            applicable legal requirements.
          </p>

          <p>
            When information is no longer required, we may delete it or
            anonymise it where appropriate.
          </p>
        </>
      ),
    },
    {
      number: "08",
      title: "Cookies and Similar Technologies",
      content: (
        <>
          <p>
            TripGuard may use cookies and similar technologies to keep users
            signed in, remember preferences, improve functionality, understand
            how the platform is used, and enhance security.
          </p>

          <p>
            You may be able to control cookies through your browser settings.
            Disabling certain cookies may affect some features of the
            platform.
          </p>
        </>
      ),
    },
    {
      number: "09",
      title: "Your Privacy Rights",
      content: (
        <>
          <p>
            Depending on applicable law, you may have rights relating to your
            personal information, including the right to request access to,
            correction of, or deletion of certain information.
          </p>

          <p>
            You may also have the right to object to or restrict certain
            processing activities. Requests can be made using the contact
            information provided below.
          </p>
        </>
      ),
    },
    {
      number: "10",
      title: "Children's Privacy",
      content: (
        <>
          <p>
            TripGuard is not intended to knowingly collect personal information
            from children who are unable to use the service under applicable
            law.
          </p>

          <p>
            If you believe that a child has provided personal information to
            us, please contact us so that we can take appropriate action.
          </p>
        </>
      ),
    },
    {
      number: "11",
      title: "Third-Party Services",
      content: (
        <>
          <p>
            TripGuard may use third-party services for functions such as
            payment processing, email delivery, analytics, hosting,
            authentication, and other infrastructure services.
          </p>

          <p>
            These providers may process information in accordance with their
            own privacy policies and terms.
          </p>
        </>
      ),
    },
    {
      number: "12",
      title: "Changes to This Privacy Policy",
      content: (
        <>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes to our services, technology, legal requirements, or
            business practices.
          </p>

          <p>
            When we make changes, we will update the "Last updated" date
            displayed at the top of this page. We encourage you to review this
            page periodically.
          </p>
        </>
      ),
    },
  ];

  const highlights = [
    {
      icon: LockKeyhole,
      title: "Protected",
      text: "We take reasonable measures to protect your information.",
    },
    {
      icon: Database,
      title: "Purposeful",
      text: "We use information for legitimate service-related purposes.",
    },
    {
      icon: UserCheck,
      title: "Your rights",
      text: "You may have rights regarding how your personal information is used.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#172322]">
      {/* HERO - DARK GREEN */}
      <section className="bg-[#173C37] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-[#63E6BE]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to TripGuard
          </Link>

          <div className="mt-12 max-w-4xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#63E6BE]/15">
              <ShieldCheck className="h-7 w-7 text-[#63E6BE]" />
            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
              Your privacy matters
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-5 text-sm text-white/50">
              Last updated: August 11, 2026
            </p>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              At TripGuard, we respect your privacy and are committed to
              protecting the information you share with us.
            </p>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS - WHITE */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-10 sm:grid-cols-3 lg:px-8">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-[#E5E4DD] bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E1F5ED] text-[#277765]">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-[#173C37]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#7A8581]">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INFORMATION INTRO - DARK GREEN */}
      <section className="bg-[#173C37] text-white">
        <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
              Your information
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              How we handle your privacy.
            </h2>

            <p className="mt-5 text-base leading-8 text-white/65">
              This Privacy Policy explains what information TripGuard may
              collect, how we use it, when it may be shared, and the choices
              available to you when using our platform.
            </p>
          </div>
        </div>
      </section>

      {/* POLICY CONTENT - WHITE */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="space-y-5">
            {sections.map((section) => (
              <article
                key={section.number}
                className="rounded-[24px] border border-[#E4E3DC] bg-white p-7 shadow-sm sm:p-9"
              >
                <div className="flex gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#173C37] text-xs font-bold text-[#63E6BE]">
                    {section.number}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold text-[#172322] sm:text-2xl">
                      {section.title}
                    </h2>

                    <div className="mt-5 space-y-4 text-[15px] leading-7 text-[#75817D]">
                      {section.content}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT - DARK GREEN */}
      <section className="bg-[#173C37] text-white">
        <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#63E6BE]/15">
              <Mail className="h-6 w-6 text-[#63E6BE]" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
              Questions?
            </p>

            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              We&apos;re here to help.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-white/60">
              If you have questions about this Privacy Policy, your personal
              information, or how TripGuard handles your data, please contact
              us through the contact details provided on the TripGuard
              platform.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER - WHITE */}
      <section className="border-t border-[#E2E1DA] bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-[#173C37]">
              Your privacy. Your journey. Your choice.
            </p>

            <p className="mt-1 text-sm text-[#7A8581]">
              Thank you for trusting TripGuard.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#173C37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#23584E]"
          >
            Back to TripGuard
            <span className="text-[#63E6BE]">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage