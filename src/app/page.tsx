"use client";
import NavbarLanding from "@/components/NavbarLanding";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Promotions from "@/components/Promotions";
import Locations from "@/components/Locations";
import FooterV2 from "@/components/FooterV2";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-black via-bramotors-black to-bramotors-red">
      <NavbarLanding />
      <Hero />
      <Services />
      <Promotions />
      <Locations />
      <FooterV2 />
    </div>
  );
}
