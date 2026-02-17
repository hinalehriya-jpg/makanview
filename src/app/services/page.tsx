import { Container } from "@/components/Container";
import { SITE, whatsappLink } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Building2,
  TrendingUp,
  Banknote,
  Landmark,
  HandCoins,
} from "lucide-react";

export const metadata: Metadata = {
  title: `Services | ${SITE.name}`,
  description:
    "Explore our real estate services — property buying, off-plan investments, free mortgage consultancy, property consultancy, and property selling in Dubai.",
};

const SERVICES = [
  {
    icon: Building2,
    title: "Property Buying",
    subtitle: "Ready & Near-Handover Apartments",
    points: [
      "Curated listings in premium Dubai locations",
      "Business Bay, Downtown, Marina, JVC, Palm Jumeirah & more",
      "Property viewings, negotiation & closing support",
      "Ready-to-move and near-handover options",
      "End-to-end buying assistance",
    ],
  },
  {
    icon: TrendingUp,
    title: "Off-plan Investments",
    subtitle: "High-Growth Projects & Flexible Payment Plans",
    points: [
      "Access to top developer projects (Emaar, DAMAC, Sobha & more)",
      "High-potential investment opportunities",
      "Flexible payment plans (as low as 1% monthly)",
      "Early-stage pricing for maximum capital appreciation",
      "Investment portfolio diversification guidance",
    ],
  },
  {
    icon: Banknote,
    title: "Free Mortgage Consultancy",
    subtitle: "Cost-Free Home Loan Guidance",
    points: [
      "Personalized mortgage advice at no cost",
      "Bank coordination and application support",
      "Comparison of best available mortgage rates",
      "Eligibility assessment and documentation help",
      "Support for residents and non-residents",
    ],
  },
  {
    icon: Landmark,
    title: "Property Consultancy",
    subtitle: "Investment Advisory & Market Insights",
    points: [
      "Strategic investment advisory services",
      "Market insights and trend analysis",
      "Portfolio planning and optimization",
      "Risk assessment and ROI projections",
      "Community and area-specific guidance",
    ],
  },
  {
    icon: HandCoins,
    title: "Property Selling",
    subtitle: "Marketing, Leads & Closing Support",
    points: [
      "Professional property marketing and listing",
      "High-quality photography and virtual tours",
      "Qualified lead generation and management",
      "Price negotiation and deal structuring",
      "Complete closing and transfer support",
    ],
  },
];

export default function ServicesPage() {
  const wa = whatsappLink(
    "Hello Makanview Properties — I'd like to learn about your services."
  );

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-black/5 bg-zinc-50 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
              What We Offer
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Our Services
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-600">
              A focused, professional set of services designed for Dubai&apos;s
              premium real estate market. From buying your dream home to building
              an investment portfolio — we&apos;ve got you covered.
            </p>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-16">
        <Container>
          <div className="space-y-8">
            {SERVICES.map((service, idx) => (
              <div
                key={service.title}
                className="overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:shadow-md"
              >
                <div className="md:flex">
                  <div className="flex flex-shrink-0 items-start bg-zinc-50 p-8 md:w-80">
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                        <service.icon className="h-5 w-5" />
                      </div>
                      <div className="mt-4 text-xs font-semibold text-zinc-400">
                        0{idx + 1}
                      </div>
                      <h2 className="mt-1 text-xl font-bold text-zinc-900">
                        {service.title}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-amber-700">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 p-8">
                    <ul className="space-y-3">
                      {service.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm text-zinc-700"
                        >
                          <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-black/5 bg-zinc-50 py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Need Help? Let&apos;s Talk
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Our team is ready to assist you with any real estate requirements.
              Reach out today for a free consultation.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition"
                >
                  Chat on WhatsApp
                </a>
              ) : null}
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
