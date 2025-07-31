import { Photo } from "../PhotosGrid/types";
import { FileItem } from "../FilesView/types";

export type MediaType = "photo" | "file";

export interface SelectedMedia {
  type: MediaType;
  data: Photo | FileItem;
}

export interface MediaUploadBottomSheetProps {
  /**
   * Whether the bottom sheet is visible
   */
  isVisible: boolean;

  /**
   * Callback when media is selected and confirmed
   */
  onMediaSelect: (media: SelectedMedia) => void;

  /**
   * Callback when bottom sheet is dismissed/cancelled
   */
  onDismiss: () => void;

  /**
   * Callback when camera is opened
   */
  onCameraPress?: () => void;

  /**
   * Custom snap points for the bottom sheet
   */
  snapPoints?: (string | number)[];

  /**
   * Whether to enable dynamic sizing
   */
  enableDynamicSizing?: boolean;

  /**
   * Custom style for the bottom sheet container
   */
  style?: any;

  /**
   * Initial tab to show ('photos' or 'files')
   */
  initialTab?: "photos" | "files";

  /**
   * Accessibility label for the bottom sheet
   */
  accessibilityLabel?: string;

  /**
   * Maximum number of photos to display
   */
  maxPhotos?: number;

  /**
   * Maximum number of files to display
   */
  maxFiles?: number;

  /**
   * Supported file types for files tab
   */
  supportedFileTypes?: string[];
}
