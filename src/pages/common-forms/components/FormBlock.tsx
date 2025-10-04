import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaPrint, FaDownload, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileAlt } from 'react-icons/fa';
import styles from './form-block.module.css';
import type { FormBlockProps } from '../types/common-forms.types';


const FormBlock: React.FC<FormBlockProps> = ({ 
  fileName, 
  fileType, 
  previewImage,
  fileURL,
  onDownload, 
  onOpenInNewTab,
  onPrint
}) => {
  const [fileSize, setFileSize] = useState<string>('');
  const [pageCount, setPageCount] = useState<number | null>(null);

  useEffect(() => {
    fetchFileSize();
    if (fileType.toLowerCase() === 'pdf') {
      fetchPdfPageCount();
    }
    else {
      fetchPageCount();
    }
  }, [fileURL, fileType]);

  const fetchFileSize = async () => {
    try {
      const response = await fetch(fileURL, { method: 'HEAD' });
      const size = response.headers.get('content-length');
      if (size) {
        setFileSize(formatFileSize(parseInt(size)));
      }
    } catch (error) {
      console.error('Error fetching file size:', error);
    }
  };

  const fetchPdfPageCount = async () => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      const loadingTask = pdfjsLib.getDocument(fileURL);
      const pdf = await loadingTask.promise;
      setPageCount(pdf.numPages);
    } catch (error) {
      console.error('Error fetching PDF page count:', error);
    }
  };

    const fetchPageCount = async () => {
        //calculate page count for docx, xlsx, etc.
        try {
        
        }
        catch (error) {
            console.error("Error getting page count:", error);
            throw error;
        }
    };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    const iconProps = { size: 16, style: { marginLeft: '4px' } };
    
    switch (fileType.toLowerCase()) {
      case 'pdf': return <FaFilePdf {...iconProps} color="#d32f2f" />;
      case 'doc':
      case 'docx': return <FaFileWord {...iconProps} color="#2196F3" />;
      case 'xls':
      case 'xlsx':
      case 'csv': return <FaFileExcel {...iconProps} color="#4CAF50" />;
      case 'ppt':
      case 'pptx': return <FaFilePowerpoint {...iconProps} color="#FF9800" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
      case 'svg': return <FaFileImage {...iconProps} color="#9C27B0" />;
      default: return <FaFileAlt {...iconProps} />;
    }
  };

  const renderPreview = () => {
    if (previewImage.startsWith('icon:')) {
      const iconType = previewImage.split(':')[1];
      const iconProps = { size: 60, color: '#666' };
      
      switch (iconType) {
        case 'pdf': return <FaFilePdf {...iconProps} color="#d32f2f" />;
        case 'word': return <FaFileWord {...iconProps} color="#2196F3" />;
        case 'excel': return <FaFileExcel {...iconProps} color="#4CAF50" />;
        case 'powerpoint': return <FaFilePowerpoint {...iconProps} color="#FF9800" />;
        case 'image': return <FaFileImage {...iconProps} color="#9C27B0" />;
        default: return <FaFileAlt {...iconProps} />;
      }
    }
    
    return <img src={previewImage} alt={fileName} className={styles.previewImage} />;
  };

  return (
    <div className={styles.formBlock}>
        <div className={styles.iconBar}>
        {/* if pdf */ }
        {fileType.toLowerCase() === 'pdf' && (
          <><button
                      className={styles.iconButton}
                      onClick={onOpenInNewTab}
                      title="open in new tab"
                  >
                      <FaExternalLinkAlt />
                  </button><button
                      className={styles.iconButton}
                      onClick={onPrint}
                      title="print file"
                  >
                          <FaPrint />
                      </button></>
        )}

        {/*always available */}
        <button 
          className={styles.iconButton} 
          onClick={onDownload}
          title="download file"
        >
          <FaDownload />
        </button>
      </div>
      <div className={styles.preview}>
        {renderPreview()}
      </div>
      <div className={styles.info}>
        <h3 className={styles.fileName}>{fileName}</h3>
        <div className={styles.fileDetails}>
          {pageCount !== null && <span>{pageCount} עמודים</span>}
          {pageCount !== null && fileSize && <span> • </span>}
          {fileSize && <span>{fileSize}</span>}
          {(pageCount !== null || fileSize) && <span> • </span>}
          <span className={styles.fileTypeContainer}>
            {fileType.toUpperCase()}
            {getFileIcon()}
          </span>
        </div>
      </div>
      
    </div>
  );
};

export default FormBlock;