import ProductsShowcase from "@/components/ProductsShowcase";
import HeroStatsCard from "@/components/HeroStatsCard";
import LogoMarquee from "@/components/LogoMarquee";
import PopularProductsSlider from "@/components/PopularProductsSlider";
import { getFeaturedProducts } from "@/lib/products";

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div>
      <div id="stats-section">
        <HeroStatsCard />
      </div>
      <LogoMarquee />
      <PopularProductsSlider products={featuredProducts} />
      <ProductsShowcase />
    </div>
  );
}
