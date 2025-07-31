import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  Text,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import Icon from "../Icon";
import { PhotosGridProps, Photo } from "./types";
import { styles, gridConstants } from "./styles";
import { colors } from "../../../theme";

/**
 * PhotosGrid Component - Photo Library Access with Grid Layout
 *
 * A grid component that displays the user's photos from their device library.
 * Follows WhatsApp-like media picker design patterns with exact Figma spacing.
 *
 * Features:
 * - Access to device photo library using expo-media-library
 * - 3-column grid layout with 2px spacing (matching Figma)
 * - Permission handling and user-friendly error states
 * - Lazy loading and performance optimization
 * - Responsive layout that adapts to screen size
 * - Accessibility support for screen readers
 * - Loading and empty states
 *
 * Based on Figma: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=100-1388
 *
 * @param photos - External photos array (optional, will fetch from library if not provided)
 * @param numColumns - Number of grid columns (default: 3)
 * @param itemSpacing - Spacing between items in pixels (default: 2)
 * @param onPhotoSelect - Callback when photo is selected
 * @param loading - External loading state
 * @param style - Custom container styles
 * @param photoStyle - Custom photo item styles
 * @param accessibilityLabel - Label for screen readers
 * @param showLoadingIndicator - Whether to show loading spinner
 *
 * @example
 * <PhotosGrid
 *   onPhotoSelect={(photo) => handlePhotoSelect(photo)}
 *   numColumns={3}
 *   itemSpacing={2}
 * />
 */
const PhotosGrid: React.FC<PhotosGridProps> = ({
  photos: externalPhotos,
  numColumns = gridConstants.numColumns,
  itemSpacing = gridConstants.itemSpacing,
  onPhotoSelect,
  loading: externalLoading = false,
  style,
  photoStyle,
  accessibilityLabel = "Photos Grid",
  showLoadingIndicator = true,
}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request media library permissions
  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");

      if (status !== "granted") {
        setError("Permission to access photo library is required");
        Alert.alert(
          "Permission Required",
          "This app needs access to your photo library to display photos. Please enable photo library access in Settings.",
          [{ text: "OK" }]
        );
      }

      return status === "granted";
    } catch (err) {
      console.error("Error requesting media library permissions:", err);
      setError("Failed to request permissions");
      return false;
    }
  }, []);

  // Fetch photos from media library
  const fetchPhotos = useCallback(async () => {
    if (!hasPermission) return;

    try {
      setLoading(true);
      setError(null);

      // Get recent photos (limit to 100 for performance)
      const result = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo,
        sortBy: MediaLibrary.SortBy.creationTime,
        first: 100,
      });

      // Convert MediaLibrary.Asset to our Photo type with proper URI handling
      const convertedPhotos: Photo[] = await Promise.all(
        result.assets.map(async (asset) => {
          try {
            // Get asset info to ensure we have the proper local URI
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
            console.log(
              `Photo ${asset.id} - Original URI: ${asset.uri}, Local URI: ${assetInfo.localUri}`
            );

            return {
              id: asset.id,
              uri: assetInfo.localUri || asset.uri, // Use localUri if available, fallback to asset.uri
              width: asset.width,
              height: asset.height,
              filename: asset.filename,
              creationTime: asset.creationTime,
              modificationTime: asset.modificationTime,
            };
          } catch (err) {
            console.log(
              `Failed to get asset info for ${asset.id}, using original URI`
            );
            return {
              id: asset.id,
              uri: asset.uri,
              width: asset.width,
              height: asset.height,
              filename: asset.filename,
              creationTime: asset.creationTime,
              modificationTime: asset.modificationTime,
            };
          }
        })
      );

      setPhotos(convertedPhotos);
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("Failed to load photos");
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  // Initialize permissions and fetch photos
  useEffect(() => {
    const initialize = async () => {
      const granted = await requestPermissions();
      if (granted) {
        await fetchPhotos();
      }
    };

    // Only fetch if no external photos provided
    if (!externalPhotos) {
      initialize();
    }
  }, [externalPhotos, requestPermissions, fetchPhotos]);

  // Use external photos if provided, otherwise use fetched photos
  const displayPhotos = externalPhotos || photos;
  const isLoading = externalLoading || loading;

  // Render individual photo item
  const renderPhotoItem = useCallback(
    ({ item, index }: { item: Photo; index: number }) => {
      const isLastInRow = (index + 1) % numColumns === 0;

      return (
        <Pressable
          style={[
            styles.photoItem,
            { marginRight: isLastInRow ? 0 : itemSpacing },
            photoStyle,
          ]}
          onPress={() => onPhotoSelect(item)}
          accessibilityRole="button"
          accessibilityLabel={`Photo ${index + 1}, ${
            item.filename || "untitled"
          }`}
          android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
        >
          <Image
            source={{ uri: item.uri }}
            style={styles.photoImage}
            contentFit="cover"
            transition={200}
            placeholder={undefined}
          />
        </Pressable>
      );
    },
    [numColumns, itemSpacing, onPhotoSelect, photoStyle]
  );

  // Render loading state
  if (isLoading && showLoadingIndicator) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading photos...</Text>
        </View>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.emptyContainer}>
          <Icon name="alert-circle" size="lg" color="error" />
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      </View>
    );
  }

  // Render empty state
  if (!hasPermission || displayPhotos.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.emptyContainer}>
          <Icon name="camera" size="lg" color="textSecondary" />
          <Text style={styles.emptyText}>
            {!hasPermission
              ? "Photo library access is required"
              : "No photos found"}
          </Text>
        </View>
      </View>
    );
  }

  // Render photo grid
  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel}
    >
      <FlatList
        data={displayPhotos}
        renderItem={renderPhotoItem}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15} // Render first 5 rows (15 items) initially
        maxToRenderPerBatch={15}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: styles.photoItem.height + itemSpacing,
          offset:
            (styles.photoItem.height + itemSpacing) *
            Math.floor(index / numColumns),
          index,
        })}
      />
    </View>
  );
};

export default PhotosGrid;
