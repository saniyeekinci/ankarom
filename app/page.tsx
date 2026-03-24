import ProductsShowcase from "@/components/ProductsShowcase";
import HeroStatsCard from "@/components/HeroStatsCard";
import LogoMarquee from "@/components/LogoMarquee";
import PopularProductsSlider from "@/components/PopularProductsSlider";
import GuestOnly from "@/components/auth/GuestOnly";

export default function Home() {
  return (
    <GuestOnly>
      <div>
        <HeroStatsCard />
        <LogoMarquee />
        <PopularProductsSlider />
        <ProductsShowcase />
      </div>
    </GuestOnly>
  );
}
