import ProductsShowcase from "@/components/ProductsShowcase";
import HeroStatsCard from "@/components/HeroStatsCard";
import LogoMarquee from "@/components/LogoMarquee";
import PopularProductsSlider from "@/components/PopularProductsSlider";

export default function Home() {
  return (
    <div>
      <HeroStatsCard />
      <LogoMarquee />
      <PopularProductsSlider />
      <ProductsShowcase />
    </div>
  );
}
