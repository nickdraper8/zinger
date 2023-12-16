import Image from 'next/image'
import styles from './page.module.css'
import { Fantasy } from './components/fantasy'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Zinger Fantasy Football&nbsp;
          <code className={styles.code}>2023</code>
        </p>
        <div>
          <a
            href="https://github.com/nickdraper8/zinger"
            target="_blank"
            rel="noopener noreferrer"
          >
            {'Created by Nick Draper --> Github'}
          </a>
        </div>
      </div>

      <Fantasy />

      <div className={styles.grid}>
        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image className="espn_logo" src="/shield-full-500.png" height={50} width={50} alt='espn-shield'/>
          <h2>
            ESPN Scoreboard <span>-&gt;</span>
          </h2>
          <p>
            Head to the ESPN app to see more in-depth scores and stats.
          </p>
        </a>
      </div>
    </main>
  )
}
