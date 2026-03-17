import ProductsShowcase from "@/components/ProductsShowcase";
import HeroStatsCard from "@/components/HeroStatsCard";
import LogoMarquee from "@/components/LogoMarquee";

export default function Home() {
  return (
    <div>
      <HeroStatsCard />
      <LogoMarquee />
      <ProductsShowcase />
    </div>
  );
}
