import { Star, CircleCheck } from "lucide-react";
import styles from "./testimonialCard.module.scss";
import { Testimonial } from "@/types/testimonial";

export default function TestimonialCard({ data }: { data: Testimonial }) {
  return (
    <div className={styles.card}>
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={22} 
            fill={i < data.rating ? "#FFC633" : "none"} 
            color="#FFC633" 
          />
        ))}
      </div>
      <div className={styles.user}>
        <span className={styles.name}>{data.name}</span>
        {data.verified && (
          <CircleCheck size={19} color="#01AB31" fill="#01AB31" stroke="#fff" />
        )}
      </div>
      <p className={styles.content}>"{data.content}"</p>
    </div>
  );
}