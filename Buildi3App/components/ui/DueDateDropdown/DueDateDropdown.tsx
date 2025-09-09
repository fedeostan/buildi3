import React, { useMemo, useRef, useState, useCallback } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { colors, spacing } from "../../../theme";
import Icon from "../Icon";
import { IconTag } from "../Tag";
import { styles, getContainerStyle } from "./styles";
import type { DueDateDropdownProps } from "./types";
import { getTagVariant, getTagText } from "../Tag/utils";

// Lightweight month calendar (no external dep). Shows current month, supports navigation.
const getMonthMatrix = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const startWeekDay = firstDay.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<Date | null> = [];
  // Leading empty cells
  for (let i = 0; i < startWeekDay; i++) cells.push(null);
  // Month days
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  // Pad to complete rows of 7
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

const formatMonthYear = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

const weekDaysShort = ["S", "M", "T", "W", "T", "F", "S"]; // Top row labels

export const DueDateDropdown: React.FC<DueDateDropdownProps> = ({
  label = "Due date",
  value,
  onSelect,
  disabled = false,
  errorMessage,
  bottomSheetTitle = "Choose due date",
  containerStyle,
  fieldStyle,
  labelStyle,
  selectedTextStyle,
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get("window");

  // Calendar view date (month navigation)
  const [viewDate, setViewDate] = useState<Date>(value || new Date());
  const monthMatrix = useMemo(
    () => getMonthMatrix(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  );

  const variant = useMemo(() => {
    if (!value) return "neutral" as const;
    return getTagVariant(value as Date, new Date());
  }, [value]);

  const text = useMemo(() => {
    if (!value) return label;
    return getTagText(value as Date, new Date());
  }, [value, label]);

  const showTopLabel = useMemo(() => !!value, [value]);

  const snapPoints = useMemo(() => {
    // Header + weekday + 6 rows * 44 + paddings ≈ 520; clamp at 80%/600
    const est = Math.min(screenHeight * 0.8, 600);
    const pct = Math.max((est / screenHeight) * 100, 40);
    return [`${pct}%`];
  }, [screenHeight]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsBottomSheetOpen(true);
      bottomSheetRef.current?.present();
    }
  }, [disabled]);

  const handleDismiss = useCallback(() => setIsBottomSheetOpen(false), []);

  const handlePrevMonth = () => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() - 1);
    setViewDate(d);
  };
  const handleNextMonth = () => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + 1);
    setViewDate(d);
  };

  const isSameDay = (a: Date | null, b: Date | null) =>
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const handlePick = (d: Date | null) => {
    onSelect?.(d);
    bottomSheetRef.current?.dismiss();
  };

  // Field visuals
  return (
    <View>
      <Pressable
        style={[
          getContainerStyle(disabled, !!errorMessage),
          !value && styles.containerTall,
          containerStyle,
          fieldStyle,
        ]}
        onPress={handleOpen}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${label} dropdown`}
        accessibilityState={{ expanded: isBottomSheetOpen, disabled }}
      >
        <View style={styles.leftContainer}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            {showTopLabel && (
              <Text style={[styles.topLabel, labelStyle]}>{label}</Text>
            )}
            <View style={styles.valueRow}>
              {/* Icon inside the value row so it centers with the main text */}
              <IconTag variant={variant as any} iconName="calendar" />
              <Text
                style={[
                  value ? styles.mainText : styles.placeholderText,
                  selectedTextStyle,
                ]}
                numberOfLines={1}
              >
                {text}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rightContainer}>
          <Icon
            name="chevron-down"
            size="sm"
            color={
              disabled ? ("disabledText" as any) : ("textSecondary" as any)
            }
          />
        </View>
      </Pressable>

      {errorMessage && (
        <Text
          style={{ color: colors.error, marginTop: 4 }}
          accessibilityRole="alert"
        >
          {errorMessage}
        </Text>
      )}

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing
        onDismiss={handleDismiss}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.textTertiary }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            maxHeight: Math.min(screenHeight * 0.8, 600),
            paddingBottom: Math.max(insets.bottom + 20, 40),
          }}
        >
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>{bottomSheetTitle}</Text>
          </View>

          <BottomSheetScrollView
            contentContainerStyle={[
              styles.bottomSheetContent,
              { paddingBottom: Math.max(insets.bottom + 40, 70) },
            ]}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {/* Calendar header */}
            <View style={styles.calendarHeader}>
              <Pressable
                onPress={handlePrevMonth}
                accessibilityLabel="Previous month"
              >
                <Icon name="chevron-left" size="md" color={"text" as any} />
              </Pressable>
              <Text style={styles.calendarHeaderText}>
                {formatMonthYear(viewDate)}
              </Text>
              <Pressable
                onPress={handleNextMonth}
                accessibilityLabel="Next month"
              >
                <Icon name="chevron-right" size="md" color={"text" as any} />
              </Pressable>
            </View>

            {/* Weekday labels */}
            <View style={styles.weekRow}>
              {weekDaysShort.map((w, i) => (
                <Text key={`${w}-${i}`} style={styles.weekDayText}>
                  {w}
                </Text>
              ))}
            </View>

            {/* Days grid */}
            <View style={styles.daysGrid}>
              {monthMatrix.map((cell, idx) => {
                const selected = isSameDay(cell, value);
                return (
                  <Pressable
                    key={idx}
                    style={[
                      styles.dayCell,
                      selected && styles.dayCellSelected,
                      !cell && styles.dayCellDisabled,
                    ]}
                    onPress={() => handlePick(cell)}
                    disabled={!cell}
                    accessibilityLabel={cell ? cell.toDateString() : "Empty"}
                    accessibilityState={{ selected, disabled: !cell }}
                  >
                    <Text style={styles.dayCellText}>
                      {cell ? cell.getDate() : ""}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Footer quick actions */}
            <View style={styles.footerRow}>
              <Pressable
                onPress={() => handlePick(new Date())}
                accessibilityLabel="Set Today"
              >
                <Text style={{ color: colors.text }}>Today</Text>
              </Pressable>
              <Pressable
                onPress={() => handlePick(null)}
                accessibilityLabel="Clear due date"
              >
                <Text style={{ color: colors.error }}>Clear</Text>
              </Pressable>
            </View>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default DueDateDropdown;
