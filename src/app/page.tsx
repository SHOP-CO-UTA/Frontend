import DressStyle from "@/components/DressStyle/dressStyle";
import Footer from "@/components/Footer/footer";
import Hero from "@/components/Hero/hero";
import Navigation from "@/components/Navigation/navigation";
import ProductSection from "@/components/ProductSection/productSection";
import TestimonialSection from "@/components/Testimonials/TestimonialSection";

import type { CatalogProduct } from "@/types/catalog";

export default function Home() {
  const newArrivals: CatalogProduct[] = [
    {
      id: 1,
      name: "T-shirt with Tape Details",
      slug: "t-shirt-with-tape-details",
      image_url: "/images/products/black-tshirt.png",
      rating: 4.5,
      price: 120,
    },
    {
      id: 2,
      name: "Skinny Fit Jeans",
      slug: "skinny-fit-jeans",
      image_url: "/images/products/blue-jeans.png",
      rating: 3.5,
      price: 240,
      original_price: 260,
      discount_label: "-20%",
    },
    {
      id: 3,
      name: "Checkered Shirt",
      slug: "checkered-shirt",
      image_url: "/images/products/purple-shirt.png",
      rating: 4.5,
      price: 180,
    },
    {
      id: 4,
      name: "Sleeve Striped T-shirt",
      slug: "sleeve-striped-t-shirt",
      image_url: "/images/products/black-orange-tshirt.png",
      rating: 4.5,
      price: 130,
      original_price: 160,
      discount_label: "-30%",
    },
  ];

  const topSelling: CatalogProduct[] = [
    {
      id: 5,
      name: "Vertical Striped Shirt",
      slug: "vertical-striped-shirt",
      image_url: "/images/products/green-shirt.png",
      rating: 5.0,
      price: 212,
      original_price: 232,
      discount_label: "-20%",
    },
    {
      id: 6,
      name: "Courage Graphic T-shirt",
      slug: "courage-graphic-t-shirt",
      image_url: "/images/products/orange-tshirt.png",
      rating: 4.0,
      price: 145,
    },
    {
      id: 7,
      name: "Loose Fit Bermuda Shorts",
      slug: "loose-fit-bermuda-shorts",
      image_url: "/images/products/blue-short.png",
      rating: 3.0,
      price: 80,
    },
    {
      id: 8,
      name: "Faded Skinny Jeans",
      slug: "faded-skinny-jeans",
      image_url: "/images/products/black-jeans.png",
      rating: 4.5,
      price: 210,
    },
  ];

  return (
    <main>
      <Navigation />
      <Hero />
      <ProductSection title="NEW ARRIVALS" products={newArrivals} />
      <ProductSection title="TOP SELLING" products={topSelling} hideBorder />
      <DressStyle />
      <TestimonialSection />
      <Footer />
    </main>
  );
}
