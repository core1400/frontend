import styles from "./course-create.module.css";
import CourseCreationForm from "./components/CourseCreationForm";

export default function CourseCreatePage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>יצירת קורסים</h1>
        <CourseCreationForm />
      </div>
    </div>
  );
}
