import { ImageSourcePropType } from "react-native";

export interface Photo {
  id: string;
  uri: string;
  width?: number;
  height?: number;
  filename?: string;
  creationTime?: number;
  modificationTime?: number;
}

export interface PhotosGridProps {
  /**
   * Array of photos to display in the grid (optional, will fetch from library if not provided)
   */
  photos?: Photo[];

  /**
   * Number of columns in the grid (default: 3)
   */
  numColumns?: number;

  /**
   * Spacing between grid items in pixels (default: 2)
   */
  itemSpacing?: number;

  /**
   * Callback when a photo is selected
   */
  onPhotoSelect: (photo: Photo) => void;

  /**
   * Loading state while fetching photos
   */
  loading?: boolean;

  /**
   * Custom style for the grid container
   */
  style?: any;

  /**
   * Custom style for individual photo items
   */
  photoStyle?: any;

  /**
   * Accessibility label for the grid
   */
  accessibilityLabel?: string;

  /**
   * Whether to show a loading indicator
   */
  showLoadingIndicator?: boolean;
}
