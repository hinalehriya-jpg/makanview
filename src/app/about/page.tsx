import { Container } from "@/components/Container";
import { SITE, whatsappLink } from "@/lib/site";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Target,
  Eye,
  ShieldCheck,
  Building2,
  Globe,
  Handshake,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  
  description:
    "Learn about Makanview Properties — a trusted Dubai real estate company offering premium buying, selling, and investment services.",
};

export default function AboutPage() {
  const wa = whatsappLink("Hello Makanview Properties — I'd like to know more about your company.");

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-black/5 bg-zinc-50 py-16 sm:py-20">
      <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
              About Us
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Your Trusted Partner in Dubai Real Estate
        </h1>
            <p className="mt-5 text-base leading-7 text-zinc-600">
              {SITE.name} is a Dubai-based real estate company focused on
              delivering a premium, professional experience for property buyers,
              sellers, and investors. Our approach is transparent, results-driven,
              and tailored to your goals.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="border-b border-black/5 py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-white p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-zinc-900">
                Our Mission
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                To deliver a premium, reliable real estate experience in Dubai —
                from first enquiry to final handover. We are committed to helping
                every client make confident, informed property decisions backed by
                deep market knowledge and honest guidance.
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-zinc-900">
                Our Vision
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                To become a trusted name for luxury property discovery and
                investment guidance in Dubai. We envision a real estate experience
                that is transparent, professional, and accessible to investors
                worldwide — setting a new standard in the industry.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Founder */}
      <section className="border-b border-black/5 bg-zinc-50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-black/5 bg-white p-8 md:flex md:gap-8">
              <div className="flex flex-shrink-0 items-start justify-center md:w-40">
                <div className="relative h-32 w-32 overflow-hidden rounded-2xl">
                  <Image
                    src="/images/founder.jpeg"
                    alt="Ankit Sharma - Founder & CEO"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                  Founder
                </p>
                <h2 className="mt-2 text-xl font-bold text-zinc-900">
                  Ankit Sharma
                </h2>
                <p className="mt-1 text-sm font-medium text-zinc-500">
                  Founder &amp; CEO, {SITE.name}
                </p>
                <p className="mt-4 text-sm leading-7 text-zinc-600">
                  With years of experience in Dubai&apos;s real estate market, our
                  founder brings a deep understanding of the local property
                  landscape, investor needs, and market dynamics. Their vision is
                  to create a company that clients trust for honesty, expertise,
                  and premium service — every single time.
                </p>
               
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Dubai Real Estate Expertise */}
      <section className="border-b border-black/5 py-16">
        <Container>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
              Our Expertise
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
              Dubai Real Estate Expertise
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Building2,
                title: "Market Knowledge",
                desc: "Deep understanding of Dubai's prime communities, developments, and price trends.",
              },
              {
                icon: Globe,
                title: "International Clients",
                desc: "Experience serving global investors and expats relocating to Dubai.",
              },
              {
                icon: Handshake,
                title: "End-to-End Support",
                desc: "From property search to documentation and handover — we handle it all.",
              },
              {
                icon: ShieldCheck,
                title: "Regulatory Compliance",
                desc: "Full compliance with RERA and DLD regulations for every transaction.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-black/5 bg-zinc-50 p-6 text-center"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-semibold text-zinc-900">
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Client-Centric Approach */}
      <section className="border-b border-black/5 bg-zinc-50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Client-Centric Approach
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              At {SITE.name}, every client relationship is built on trust,
              transparency, and personalized attention. We don&apos;t just sell
              properties — we listen to your goals, understand your investment
              appetite, and deliver solutions that align with your vision. Our
              success is measured by your satisfaction.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Let&apos;s Work Together
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Whether you&apos;re buying, selling, or investing — our team is
              here to help.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition"
                >
                  WhatsApp Us
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
