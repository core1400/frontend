import styles from './course-info.module.css';
import CourseTable from './components/CourseTable';

export default function CourseInfo() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>
        <span className={styles.titleGrey}>חניכי</span>{" "}
        <span className={styles.titleWhite}>הקורס</span>
      </h1>
      <div className={styles.pageBodyWrapper}>
        <CourseTable />
      </div>
    </section>
    
  );
}
