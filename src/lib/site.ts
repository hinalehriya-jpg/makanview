export const SITE = {
  name: "Makanview Properties",
  tagline: "Dubai Real Estate — Buying, Selling, Rentals & Off-plan Investments",
  email: "makanviewproperties@gmail.com",
  addressLine1: "EMPIRE HEIGHTS, A-16F-A-04",
  addressLine2: "Business Bay, Dubai, UAE",
  // Provide just digits with country code, e.g. 9715XXXXXXXX
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
};

export function whatsappLink(message: string) {
  const digits = (SITE.whatsappNumber || "").replace(/[^\d]/g, "");
  if (!digits) return null;
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}












