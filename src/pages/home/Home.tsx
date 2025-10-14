import React from 'react';
import styles from './home.module.css';
import { useMemo } from 'react';
import { shuffleCreditNames, creditNames } from '../../utils/helpers-functions/homeHelpers';

const Home: React.FC = () => {

  const shuffled: string[] = useMemo(() => shuffleCreditNames(creditNames), []);
  const line1: string = shuffled.slice(0, 3).join(", ");
  const line2: string = shuffled.slice(3).join(", ");

  return (
    <main className={styles.hero}>
      <section className={styles.content}>
        <h1 className={styles.title}>
          ברוכים הבאים ל-<span className={styles.accent}>CORE</span>
        </h1>

        <p className={styles.lead}>
          CORE היא מערכת המסייעת למפקד קורס לנהל לוגיסטיקה, לעקוב אחר חניכי הקורס , וקביעת לו"ז" במקום אחד נקי ופשוט - 
          כך שתוכלו להתמקד בלימוד והובלה ולא בבירוקרטיה!
        </p>

        <button type="button" className={styles.cta}>
          ירוק בעיניים
        </button>
      </section>
      <section className={styles.typewrap}>
        <div className={styles.text}>כאן הופכים קורס לצוות.</div>
      </section>

      <footer className={styles.credit} aria-label="קרדיט">
        <span className={styles.creditTitle}>פותח ע"י:</span><br />
        <span className={styles.creditLine}>{line1}</span><br />
        <span className={styles.creditLine}>{line2}</span><br />
        <span className={styles.creditTag}>קורס 1400 &lt;/&gt;</span>
      </footer>
    </main>
  );
};

export default Home;
