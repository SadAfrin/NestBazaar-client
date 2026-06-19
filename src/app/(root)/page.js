import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PopularCategories from "@/components/home/PopularCategories";
import SuccessStories from "@/components/home/SuccessStories";
import MarketplaceStats from "@/components/home/MarketplaceStats";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import TrustedSellers from "@/components/home/TrustedSellers";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <PopularCategories />
      <SuccessStories />
      <MarketplaceStats />
      <SustainabilitySection />
      <TrustedSellers />
    </main>
  );
}