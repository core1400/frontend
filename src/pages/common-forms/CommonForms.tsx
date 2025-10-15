import React, { useState, useEffect } from "react";
import styles from './common-forms.module.css';
import FormGallery from "./components/FormGallery";
import { FaSearch } from "react-icons/fa";

//dummy data
import myPDF from '../../assets/test.pdf';
import myPDF2 from '../../assets/jokes.pdf';
import myPDF3 from '../../assets/testtttt.pdf';
import myWord from '../../assets/standup.docx?url'
import myxl from '../../assets/test3.xlsx?url';


import DragAndDropFiles from "./components/DragAndDropFiles";

export default function CommonForms() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredForms, setFilteredForms] = useState<typeof forms>([]);

    //import from backend (dummy data for now)
    const formsList = [myPDF, myPDF3, myWord, myxl, myPDF2];

    const forms = formsList.map(file => ({
        fileName: file.split('/').pop()?.split('.')[0] || '',
        fileType: file.split('.').pop()?.toLowerCase() || '',
        fileURL: file
    }));

  useEffect(() => {
    const filtered = forms.filter(form => 
      form.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForms(filtered);
  }, [searchTerm]);

  useEffect(() => {
    setFilteredForms(forms);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
        <div className={styles.header}>
            <h1 className={styles.title}>
          טפסים<span className={styles.accent}> נפוצים</span>
        </h1>
            
            {/* Search bar */}
            <div className={styles.headerSearch}>
                <input
                    type="text"
                    placeholder="חיפוש"
                    className={styles.headerSearchInput}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <span className={styles.headerSearchIcon}>
                    <FaSearch />
                </span>
            </div>
        </div>

        {/* Content container with both components */}
        <div className={styles.contentContainer}>
            {/* DragAndDropFiles */}
            <DragAndDropFiles />
            
            {/* Gallery of forms */}
            <FormGallery forms={filteredForms} />

            
        </div>
    </div>

  );
};