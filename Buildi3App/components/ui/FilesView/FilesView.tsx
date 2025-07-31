import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  Text,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Icon from "../Icon";
import { FilesViewProps, FileItem } from "./types";
import { styles } from "./styles";
import { colors } from "../../../theme";

/**
 * FilesView Component - Document Browser with WhatsApp Design
 *
 * A file browser component that follows WhatsApp's file sharing interface.
 * Allows users to browse and select documents from their device.
 *
 * Features:
 * - Document picker integration using expo-document-picker
 * - WhatsApp-like file list design with icons and metadata
 * - Support for various file types (PDF, DOC, images, etc.)
 * - File size display and formatting
 * - Loading and error states
 * - Accessibility support
 * - Browse files button for easy access
 *
 * @param files - External files array (optional, will use document picker if not provided)
 * @param onFileSelect - Callback when file is selected
 * @param loading - External loading state
 * @param style - Custom container styles
 * @param fileItemStyle - Custom file item styles
 * @param accessibilityLabel - Label for screen readers
 * @param showFileSize - Whether to show file sizes (default: true)
 * @param maxFiles - Maximum number of files to display
 * @param supportedTypes - Supported file types filter
 *
 * @example
 * <FilesView
 *   onFileSelect={(file) => handleFileSelect(file)}
 *   showFileSize={true}
 *   supportedTypes={['pdf', 'doc', 'docx', 'image/*']}
 * />
 */
const FilesView: React.FC<FilesViewProps> = ({
  files: externalFiles,
  onFileSelect,
  loading: externalLoading = false,
  style,
  fileItemStyle,
  accessibilityLabel = "Files View",
  showFileSize = true,
  maxFiles = 50,
  supportedTypes,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get file icon based on file type
  const getFileIcon = useCallback((file: FileItem): string => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    // Image files
    if (
      fileType.startsWith("image/") ||
      /\.(jpg|jpeg|png|gif|bmp|webp)$/.test(fileName)
    ) {
      return "camera";
    }

    // PDF files
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return "file-text";
    }

    // Document files
    if (
      fileType.includes("document") ||
      fileType.includes("word") ||
      /\.(doc|docx|txt|rtf)$/.test(fileName)
    ) {
      return "file-text";
    }

    // Spreadsheet files
    if (
      fileType.includes("sheet") ||
      fileType.includes("excel") ||
      /\.(xls|xlsx|csv)$/.test(fileName)
    ) {
      return "grid";
    }

    // Audio files
    if (
      fileType.startsWith("audio/") ||
      /\.(mp3|wav|m4a|aac|ogg)$/.test(fileName)
    ) {
      return "headphones";
    }

    // Video files
    if (
      fileType.startsWith("video/") ||
      /\.(mp4|mov|avi|mkv|webm)$/.test(fileName)
    ) {
      return "video";
    }

    // Archive files
    if (/\.(zip|rar|7z|tar|gz)$/.test(fileName)) {
      return "archive";
    }

    // Default file icon
    return "copy";
  }, []);

  // Format file size
  const formatFileSize = useCallback((size?: number): string => {
    if (!size) return "";

    const units = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;
    let formattedSize = size;

    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024;
      unitIndex++;
    }

    return `${formattedSize.toFixed(unitIndex === 0 ? 0 : 1)} ${
      units[unitIndex]
    }`;
  }, []);

  // Get file type badge text
  const getFileTypeText = useCallback((file: FileItem): string => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (fileName.includes(".")) {
      const extension = fileName.split(".").pop()?.toUpperCase();
      return extension || "FILE";
    }

    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("image")) return "IMG";
    if (fileType.includes("document") || fileType.includes("word"))
      return "DOC";
    if (fileType.includes("sheet") || fileType.includes("excel")) return "XLS";
    if (fileType.includes("audio")) return "AUDIO";
    if (fileType.includes("video")) return "VIDEO";

    return "FILE";
  }, []);

  // Browse files using document picker
  const browseFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await DocumentPicker.getDocumentAsync({
        type: supportedTypes || "*/*",
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        // Convert DocumentPicker result to our FileItem type
        const convertedFiles: FileItem[] = result.assets.map(
          (asset, index) => ({
            id: `${asset.name}-${Date.now()}-${index}`,
            name: asset.name,
            uri: asset.uri,
            type: asset.mimeType || "application/octet-stream",
            size: asset.size,
            mimeType: asset.mimeType,
          })
        );

        setFiles((prevFiles) => {
          const newFiles = [...prevFiles, ...convertedFiles];
          return newFiles.slice(0, maxFiles); // Limit to maxFiles
        });
      }
    } catch (err) {
      console.error("Error browsing files:", err);
      setError("Failed to browse files");
      Alert.alert("Error", "Failed to open file browser. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [supportedTypes, maxFiles]);

  // Use external files if provided, otherwise use selected files
  const displayFiles = externalFiles || files;
  const isLoading = externalLoading || loading;

  // Render individual file item
  const renderFileItem = useCallback(
    ({ item, index }: { item: FileItem; index: number }) => {
      const fileIcon = getFileIcon(item);
      const fileTypeText = getFileTypeText(item);
      const fileSizeText = formatFileSize(item.size);

      return (
        <Pressable
          style={[styles.fileItem, fileItemStyle]}
          onPress={() => onFileSelect(item)}
          accessibilityRole="button"
          accessibilityLabel={`File ${item.name}, ${fileSizeText}, ${fileTypeText}`}
          android_ripple={{ color: "rgba(0, 0, 0, 0.05)" }}
        >
          {/* File Icon */}
          <View style={styles.fileIconContainer}>
            <Icon name={fileIcon as any} size="md" color="primary" />
          </View>

          {/* File Info */}
          <View style={styles.fileInfoContainer}>
            <Text style={styles.fileName} numberOfLines={1}>
              {item.name}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              {showFileSize && item.size && (
                <Text style={styles.fileSize}>{fileSizeText}</Text>
              )}
              <View style={styles.fileTypeBadge}>
                <Text style={styles.fileTypeBadgeText}>{fileTypeText}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      );
    },
    [
      onFileSelect,
      fileItemStyle,
      getFileIcon,
      getFileTypeText,
      formatFileSize,
      showFileSize,
    ]
  );

  // Render loading state
  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading files...</Text>
        </View>
      </View>
    );
  }

  // Render main content
  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel}
    >
      {/* Browse Files Button */}
      <Pressable
        style={styles.browseButton}
        onPress={browseFiles}
        accessibilityRole="button"
        accessibilityLabel="Browse files"
        android_ripple={{ color: "rgba(0, 0, 0, 0.05)" }}
      >
        <Icon name="download" size="md" color="primary" />
        <Text style={styles.browseButtonText}>Browse Files</Text>
      </Pressable>

      {/* Files List */}
      {displayFiles.length > 0 ? (
        <FlatList
          data={displayFiles}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="copy" size="lg" color="textSecondary" />
          <Text style={styles.emptyText}>
            No files selected. Tap "Browse Files" to choose documents.
          </Text>
        </View>
      )}

      {/* Error state */}
      {error && (
        <View style={styles.emptyContainer}>
          <Icon name="alert-circle" size="lg" color="error" />
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

export default FilesView;
