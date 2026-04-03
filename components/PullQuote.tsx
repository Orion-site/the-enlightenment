import styles from '@/styles/PullQuote.module.css'

interface PullQuoteProps {
  quote: string
  attribution: string
}

export default function PullQuote({ quote, attribution }: PullQuoteProps) {
  return (
    <div className={styles.wrapper}>
      <hr className={`gold-rule ${styles.rule}`} aria-hidden="true" />
      <blockquote>
        <p className={styles.quote}>&ldquo;{quote}&rdquo;</p>
        <footer>
          <cite className={styles.attribution}>{attribution}</cite>
        </footer>
      </blockquote>
      <hr className={`gold-rule ${styles.ruleBottom}`} aria-hidden="true" />
    </div>
  )
}
