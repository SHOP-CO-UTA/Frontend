import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./testimonialSection.module.scss";
import { Testimonial } from "@/types/testimonial";
import TestimonialCard from "../TestimonialCard/testimonialCard";

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 1,
    name: "Sarah M.",
    verified: true,
    rating: 5,
    content: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."
  },
  {
    id: 2,
    name: "Alex K.",
    verified: true,
    rating: 5,
    content: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."
  },
  {
    id: 3,
    name: "James L.",
    verified: true,
    rating: 5,
    content: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."
  },
  {
    id: 4,
    name: "James L.",
    verified: true,
    rating: 5,
    content: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."
  },
  {
    id: 5,
    name: "James L.",
    verified: true,
    rating: 5,
    content: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."
  },
  {
    id: 6,
    name: "James L.",
    verified: true,
    rating: 5,
    content: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."
  },
];

export default function TestimonialSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>OUR HAPPY CUSTOMERS</h2>
          <div className={styles.navigation}>
            <button className={styles.navBtn} aria-label="Previous card">
              <ArrowLeft size={24} />
            </button>
            <button className={styles.navBtn} aria-label="Next card">
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
        
        <div className={styles.grid}>
          {TESTIMONIALS_DATA.map((item) => (
            <div key={item.id} className={styles.gridItem}>
              <TestimonialCard data={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}