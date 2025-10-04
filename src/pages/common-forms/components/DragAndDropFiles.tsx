import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import styles from './drag-and-drop-files.module.css';
import type { FileWithPreview } from '../types/common-forms.types';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileAlt } from 'react-icons/fa';

const DragAndDropFiles: React.FC = () => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    const removeFile = (fileToRemove: FileWithPreview) => {
        setFiles((prev) => prev.filter((file) => file !== fileToRemove));
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        
        switch (ext) {
            case 'pdf':
                return <FaFilePdf className={`${styles.fileIcon}`} size={24} />;
            case 'doc':
            case 'docx':
                return <FaFileWord className={`${styles.fileIcon}`} size={24} />;
            case 'xls':
            case 'xlsx':
                return <FaFileExcel className={`${styles.fileIcon}`} size={24} />;
            case 'ppt':
            case 'pptx':
                return <FaFilePowerpoint className={`${styles.fileIcon}`} size={24} />;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'svg':
            case 'webp':
                return <FaFileImage className={`${styles.fileIcon} ${styles.image}`} size={24} />;
            default:
                return <FaFileAlt className={styles.fileIcon} size={24} />;
        }
    };

    return (
        <div className={styles.dragAndDropContainer}>
            <h2 className={styles.title}>Drag & Drop files</h2>
            
            <div
                {...getRootProps()}
                className={`${styles.dropZone} ${isDragActive ? styles.dragActive : ''}`}
            >
                <input {...getInputProps()} />
                <FiUploadCloud className={styles.uploadIcon} />
                <p className={styles.dropText}>Drag & Drop your files here</p>
            </div>


            <div className={styles.fileList}>
                {files.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                        {getFileIcon(file.name)}
                        <div className={styles.fileInfo}>
                            <p className={styles.fileName}>{file.name}</p>
                            <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
                        </div>
                        <button
                            onClick={() => removeFile(file)}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                color: '#94a3b8',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {files.length > 0 && (
                <button 
                    className={styles.submitBtn}
                    onClick={() => {
                        // push files to the forms gallery (you need to save the files in assets folder)
                        
                        setFiles([]);
                    }}
                >
                    Submit Files
                </button>
            )}
        </div>
    );
};

export default DragAndDropFiles;