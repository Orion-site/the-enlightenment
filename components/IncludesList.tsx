import styles from '@/styles/IncludesList.module.css'

interface IncludesListProps {
  items: string[]
}

export default function IncludesList({ items }: IncludesListProps) {
  return (
    <div className={styles.wrapper}>
      <ol className={styles.list} role="list">
        {items.map((item, i) => (
          <li key={item} className={styles.item}>
            <span className={styles.number} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={styles.text}>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
