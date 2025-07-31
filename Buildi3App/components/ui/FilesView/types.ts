export interface FileItem {
  id: string;
  name: string;
  uri: string;
  type: string;
  size?: number;
  mimeType?: string;
  lastModified?: number;
}

export interface FilesViewProps {
  /**
   * Array of files to display (optional, will use document picker if not provided)
   */
  files?: FileItem[];

  /**
   * Callback when a file is selected
   */
  onFileSelect: (file: FileItem) => void;

  /**
   * Loading state while fetching files
   */
  loading?: boolean;

  /**
   * Custom style for the container
   */
  style?: any;

  /**
   * Custom style for file items
   */
  fileItemStyle?: any;

  /**
   * Accessibility label for the files view
   */
  accessibilityLabel?: string;

  /**
   * Whether to show file sizes
   */
  showFileSize?: boolean;

  /**
   * Maximum number of files to display
   */
  maxFiles?: number;

  /**
   * Supported file types filter
   */
  supportedTypes?: string[];
}
