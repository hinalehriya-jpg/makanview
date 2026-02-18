import { Container } from "@/components/Container";
import { whatsappLink } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import {
  TrendingUp,
  Banknote,
  ShieldCheck,
  Building2,
  Globe,
  Home,
  CreditCard,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Why Invest in Dubai | Makanview Properties",
  description:
    "Discover why Dubai is one of the best real estate investment destinations — high rental yields, zero property tax, transparent regulations, and more.",
};

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "High Rental Yields",
    description:
      "Dubai consistently delivers 7-10% average rental yields — among the highest globally. Prime areas like Downtown, Marina, and Business Bay offer exceptional returns for investors.",
  },
  {
    icon: Banknote,
    title: "Zero Property Tax",
    description:
      "Dubai charges no annual property tax, no capital gains tax, and no income tax on rental income. Your investment returns remain maximized with minimal government deductions.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent RERA Regulations",
    description:
      "The Real Estate Regulatory Agency (RERA) ensures complete transparency in all transactions. Escrow accounts, title deed registration, and developer regulations protect every investor.",
  },
  {
    icon: Building2,
    title: "Strong Capital Appreciation",
    description:
      "Dubai's real estate market has shown consistent capital appreciation, especially in prime locations. Strategic government initiatives continue to drive long-term value growth.",
  },
  {
    icon: Globe,
    title: "Investor-Friendly Ecosystem",
    description:
      "100% foreign ownership, no currency restrictions, world-class infrastructure, and a business-friendly environment make Dubai the preferred destination for international investors.",
  },
  {
    icon: CreditCard,
    title: "Easy & Flexible Buying Process",
    description:
      "Straightforward property purchase process, competitive mortgage options, and developer payment plans (as low as 1% monthly) make investing in Dubai accessible to all.",
  },
  {
    icon: Home,
    title: "Residency Opportunities",
    description:
      "Property investments of AED 750,000+ qualify for a 2-year residency visa. Investments of AED 2 million+ qualify for a 10-year Golden Visa — live, work, and invest in the UAE.",
  },
];

export default function WhyInvestPage() {
  const wa = whatsappLink(
    "Hello Makanview Properties — I'd like to learn about investing in Dubai."
  );

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-black/5 bg-zinc-900 py-16 text-white sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Investment Guide
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Why Invest in Dubai Real Estate?
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-400">
              Dubai is one of the world&apos;s most attractive destinations for
              property investment. Discover the key reasons global investors
              choose Dubai.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "7-10%", label: "Avg. Rental Yield" },
              { value: "0%", label: "Property Tax" },
              { value: "100%", label: "Foreign Ownership" },
              { value: "10yr", label: "Golden Visa" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur"
              >
                <div className="text-2xl font-bold text-amber-400">
                  {s.value}
                </div>
                <div className="mt-1 text-xs font-medium text-zinc-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-black/5 bg-white p-6 transition hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-zinc-900">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {b.description}
                </p>
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
              Ready to Start Your Investment Journey?
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Our team will help you find the perfect investment opportunity in
              Dubai — from ready properties with immediate rental income to
              off-plan projects with high growth potential.
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
                href="/properties"
                className="inline-flex items-center rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition"
              >
                Browse Properties
              </Link>
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







