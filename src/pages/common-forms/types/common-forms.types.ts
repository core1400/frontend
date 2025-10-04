//drag-and-drop
export interface FileWithPreview extends File {
    preview?: string;
}

//form-gallery
export interface Form {
    fileName: string;
    fileType: string;
    fileURL: string;
}
//form-gallery
export interface FormGalleryProps {
  forms: Form[];
}

//form-block
export interface FormBlockProps {
  fileName: string;
  fileType: string;
  previewImage: string;
  fileURL: string;
  onDownload: () => void;
  onOpenInNewTab: () => void;
  onPrint: () => void;
}