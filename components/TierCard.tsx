import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/TierCard.module.css'

interface TierCardProps {
  image: string
  title: string
  price: string
  description: string
  href: string
}

export default function TierCard({ image, title, price, description, href }: TierCardProps) {
  return (
    <article className={styles.card}>
      {/* Image */}
      <div className={styles.imageWrap}>
        <Image
          src={image}
          alt={title}
          fill
          className={styles.image}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>

      {/* Dark info panel */}
      <div className={styles.panel}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.price}>{price}</div>
        <p className={styles.description}>{description}</p>
        <Link href={href} className={styles.cta} aria-label={`Learn more about ${title}`}>
          <span className={styles.ctaText}>LEARN MORE →</span>
        </Link>
      </div>
    </article>
  )
}
