'use client';
import React from 'react';
import CourseTable from './components/CourseTable';
import styles from './course-info.module.css';

export default function CourseInfo() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>מידע קורס</h1>

      {/* Natural width; roomy gaps from navbar and sides */}
      <div className={styles.content}>
        <CourseTable />
      </div>
    </div>
  );
}
