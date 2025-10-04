import React, { useState, useEffect } from "react";
import styles from './form-gallery.module.css';
import FormBlock from './FormBlock';
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { FormGalleryProps } from '../types/common-forms.types';
import { TbFileSad } from "react-icons/tb";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

const FormGallery: React.FC<FormGalleryProps> = ( { forms } ) => {
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

   useEffect(() => {
    let cancelled = false;

    const run = async () => {
      for (const form of forms) {
        const fileUrl = form.fileURL;

        // Skip if we already made a preview for this URL
        if (previews[fileUrl]) continue;

        const ext = getFileExtension(fileUrl);

        // Directly use the image for common image types
        if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext)) {
          if (!cancelled) {
            setPreviews((prev) => ({ ...prev, [fileUrl]: fileUrl }));
          }
          continue;
        }

        // PDF -> generate thumbnail
        if (ext === "pdf") {
          try {
            const imageUrl = await generatePdfPreview(fileUrl);
            if (!cancelled) {
              setPreviews((prev) => ({ ...prev, [fileUrl]: imageUrl }));
            }
          } catch (e) {
            console.error("Error generating PDF preview:", e);
            if (!cancelled) {
              setPreviews((prev) => ({ ...prev, [fileUrl]: "icon:pdf" }));
            }
          }
          continue;
        }

        const iconPreview = getIconForFileType(ext);
        if (!cancelled) {
          setPreviews((prev) => ({ ...prev, [fileUrl]: iconPreview }));
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [forms]);


  const getFileExtension = (url: string): string => {
    return url.split('.').pop()?.toLowerCase() || '';
  };

  const getIconForFileType = (ext: string): string => {
    if (['doc', 'docx'].includes(ext)) return 'icon:word';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'icon:excel';
    if (['ppt', 'pptx'].includes(ext)) return 'icon:powerpoint';
    if (ext === 'pdf') return 'icon:pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return 'icon:image';
    return 'icon:file';
  };

  const generatePdfPreview = async (fileUrl: string): Promise<string> => {
    const loadingTask = getDocument(fileUrl);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (!context) throw new Error("Could not get 2D context");

    await page.render({
        canvasContext: context,
        viewport,
        canvas
        }).promise;

    return canvas.toDataURL("image/png");
  };

  
  const handleDownload = (fileUrl: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (fileUrl: string) => {
    const ext = getFileExtension(fileUrl);
    
    // For images and PDFs, open in a new window and trigger print
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'pdf'].includes(ext)) {
        const printWindow = window.open(fileUrl, '_blank');
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    } else {
        // For other file types, open in new tab (user can manually print)
        window.open(fileUrl, '_blank');
    }
  };

  const getPreviewImage = (fileUrl: string): string => {
    return previews[fileUrl] || 'icon:file';
  };

  return (
    <div className={styles.galleryContainer}>


      <div className={styles.gallery}>
        {/* Empty state */}
        {forms.length === 0 && (
          <div className={styles.emptyState}>
            <TbFileSad className={styles.TbFileSad} />
            <p>No Files Found</p>
          </div>
        )}
        {forms.map((form, index) => (
          <FormBlock
            key={index}
            fileName={form.fileName}
            fileType={form.fileType}
            fileURL={form.fileURL}
            previewImage={getPreviewImage(form.fileURL)}
            onPrint={() => handlePrint(form.fileURL)}
            onDownload={() => handleDownload(form.fileURL)}
            onOpenInNewTab={() => window.open(form.fileURL, '_blank')}
          />
        ))}
        
      </div>
        
    </div>
  );
};

export default FormGallery;