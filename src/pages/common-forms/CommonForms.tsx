import React, { useState, useEffect } from "react";
import styles from './common-forms.module.css';
import FormGallery from "./components/FormGallery";
import { FaSearch } from "react-icons/fa";
import myPDF from '../../assets/test.pdf';
import myPDF2 from '../../assets/jokes.pdf';
import myWord from '../../assets/standup.docx?url'

const CommonForms: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredForms, setFilteredForms] = useState<typeof forms>([]);

    const formsList = [myPDF, myPDF2, myWord];
    // dummy forms data
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
            <h1>טפסים נפוצים</h1>
            
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

        {/* Gallery of forms */}
        <FormGallery forms={filteredForms} />
    </div>

  );
};

export default CommonForms;
