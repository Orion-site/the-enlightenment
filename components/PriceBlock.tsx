import styles from '@/styles/PriceBlock.module.css'

interface PriceBlockProps {
  price: string
  period: string
  scarcityNote?: string
}

export default function PriceBlock({ price, period, scarcityNote }: PriceBlockProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.price}>{price}</p>
      <p className={styles.period}>{period}</p>
      {scarcityNote && <p className={styles.scarcity}>{scarcityNote}</p>}
    </div>
  )
}
