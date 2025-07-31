import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { View, ActivityIndicator, Text, Alert } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import BottomSheetTopBar from "../BottomSheetTopBar";
import PhotosGrid from "../PhotosGrid";
import FilesView from "../FilesView";
import Icon from "../Icon";
import { MediaUploadBottomSheetProps, SelectedMedia } from "./types";
import { Photo } from "../PhotosGrid/types";
import { FileItem } from "../FilesView/types";
import { SegmentedControlOption } from "../SegmentedControl/types";
import { styles } from "./styles";
import { colors } from "../../../theme";

/**
 * MediaUploadBottomSheet Component - WhatsApp-like Media Upload Interface
 *
 * A comprehensive media upload bottom sheet that combines photo library access,
 * file browser, camera functionality, and image preview in a WhatsApp-like interface.
 *
 * Features:
 * - Bottom sheet with dynamic sizing using gorhom/bottom-sheet
 * - Top bar with cancel, segmented control (Photos/Files), and camera
 * - Photos tab with grid view and photo library access
 * - Files tab with document browser functionality
 * - Camera integration for taking photos
 * - Image preview with continue/choose another options
 * - Full accessibility support and error handling
 * - Follows exact Figma design specifications
 *
 * @param isVisible - Whether the bottom sheet is visible
 * @param onMediaSelect - Callback when media is selected and confirmed
 * @param onDismiss - Callback when bottom sheet is dismissed
 * @param onCameraPress - Custom camera handling callback
 * @param snapPoints - Custom snap points for bottom sheet
 * @param enableDynamicSizing - Enable dynamic sizing (default: true)
 * @param style - Custom container styles
 * @param initialTab - Initial tab to show ('photos' or 'files')
 * @param accessibilityLabel - Label for screen readers
 * @param maxPhotos - Maximum photos to display
 * @param maxFiles - Maximum files to display
 * @param supportedFileTypes - Supported file types
 *
 * @example
 * <MediaUploadBottomSheet
 *   isVisible={showBottomSheet}
 *   onMediaSelect={(media) => handleMediaSelect(media)}
 *   onDismiss={() => setShowBottomSheet(false)}
 *   initialTab="photos"
 * />
 */
const MediaUploadBottomSheet: React.FC<MediaUploadBottomSheetProps> = ({
  isVisible,
  onMediaSelect,
  onDismiss,
  onCameraPress,
  snapPoints: customSnapPoints,
  enableDynamicSizing = true,
  style,
  initialTab = "photos",
  accessibilityLabel = "Media Upload Bottom Sheet",
  maxPhotos = 100,
  maxFiles = 50,
  supportedFileTypes,
}) => {
  // Refs
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // State management
  const [activeTab, setActiveTab] = useState<"photos" | "files">(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Segmented control options
  const segmentedOptions: SegmentedControlOption[] = useMemo(
    () => [
      { id: "photos", label: "Photos" },
      { id: "files", label: "Files" },
    ],
    []
  );

  // Bottom sheet configuration
  const snapPoints = useMemo(
    () => customSnapPoints || ["50%", "90%"],
    [customSnapPoints]
  );

  // Present/dismiss bottom sheet based on isVisible prop
  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Handle bottom sheet dismiss
  const handleDismiss = useCallback(() => {
    setError(null);
    onDismiss();
  }, [onDismiss]);

  // Handle tab selection
  const handleTabSelect = useCallback((option: SegmentedControlOption) => {
    setActiveTab(option.id as "photos" | "files");
    setError(null);
  }, []);

  // Handle camera press
  const handleCameraPress = useCallback(async () => {
    try {
      if (onCameraPress) {
        onCameraPress();
        return;
      }

      // Default camera implementation
      setLoading(true);
      setError(null);

      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        setError("Camera permission is required to take photos");
        Alert.alert(
          "Permission Required",
          "This app needs camera access to take photos. Please enable camera access in Settings.",
          [{ text: "OK" }]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const photo: Photo = {
          id: `camera-${Date.now()}`,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          filename: `camera-photo-${Date.now()}.jpg`,
        };

        // Directly handle photo selection - no more preview state
        const selectedMedia: SelectedMedia = { type: "photo", data: photo };
        onMediaSelect(selectedMedia);
        handleDismiss();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Failed to open camera");
      Alert.alert("Camera Error", "Failed to open camera. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [onCameraPress, onMediaSelect, handleDismiss]);

  // Handle photo selection from grid - navigate to preview screen
  const handlePhotoSelect = useCallback(
    (photo: Photo) => {
      console.log("Photo selected for preview:", photo);
      console.log("Photo URI:", photo.uri);

      const selectedMedia: SelectedMedia = { type: "photo", data: photo };
      onMediaSelect(selectedMedia);
      handleDismiss();
    },
    [onMediaSelect, handleDismiss]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (file: FileItem) => {
      const selectedMedia: SelectedMedia = {
        type: "file",
        data: file,
      };
      onMediaSelect(selectedMedia);
      handleDismiss();
    },
    [onMediaSelect, handleDismiss]
  );

  // Handle image preview continue - removed since preview is handled elsewhere
  // const handleImageContinue = useCallback(() => {
  //   // This function is no longer needed
  // }, []);

  // Handle choose another image - removed since preview is handled elsewhere
  // const handleChooseAnother = useCallback(() => {
  //   // This function is no longer needed
  // }, []);

  // Render content based on current state
  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size="lg" color="error" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    // Render media selection content
    return (
      <>
        {/* Top Bar */}
        <View style={styles.topBarContainer}>
          <BottomSheetTopBar
            segmentedOptions={segmentedOptions}
            selectedTabId={activeTab}
            onTabSelect={handleTabSelect}
            onCancel={handleDismiss}
            onCameraPress={handleCameraPress}
          />
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>
          {activeTab === "photos" ? (
            <PhotosGrid onPhotoSelect={handlePhotoSelect} />
          ) : (
            <FilesView
              onFileSelect={handleFileSelect}
              supportedTypes={supportedFileTypes}
            />
          )}
        </View>
      </>
    );
  }, [
    loading,
    error,
    activeTab,
    segmentedOptions,
    handleTabSelect,
    handleDismiss,
    handleCameraPress,
    handlePhotoSelect,
    handleFileSelect,
    maxPhotos,
    maxFiles,
    supportedFileTypes,
  ]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      backdropComponent={renderBackdrop}
      onDismiss={handleDismiss}
      handleIndicatorStyle={{ backgroundColor: colors.textSecondary }}
      backgroundStyle={{ backgroundColor: colors.bottomSheetBackground }}
      accessibilityLabel={accessibilityLabel}
    >
      <BottomSheetView style={[styles.container, style]}>
        {renderContent()}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default MediaUploadBottomSheet;
