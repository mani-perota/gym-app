import { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  ActivityIndicator,
  FlatList,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Search, X, Check, Dumbbell, ChevronDown } from "lucide-react-native";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import type { Exercise } from "@/types";
import { useExercises } from "@/hooks/useExercises";
import { MUSCLE_GROUP_LABELS } from "@/services/exercises";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Dark premium colors
const COLORS = {
  bg: "#0A0F1A",
  bgModal: "#0F172A",
  surface: "#1E293B",
  elevated: "#283548",
  accent: "#22D3EE",
  accentLight: "rgba(34, 211, 238, 0.15)",
  violet: "#A78BFA",
  violetLight: "rgba(167, 139, 250, 0.15)",
  text: "#F8FAFC",
  textMuted: "#64748B",
  border: "#334155",
  borderActive: "#22D3EE",
  overlay: "rgba(0, 0, 0, 0.6)",
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ExerciseAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectExercise: (exercise: Exercise) => void;
  selectedExercise: Exercise | null;
  placeholder?: string;
  darkMode?: boolean;
}

export function ExerciseAutocomplete({
  value,
  onChangeText,
  onSelectExercise,
  selectedExercise,
  placeholder = "Buscar ejercicio...",
}: ExerciseAutocompleteProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Exercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { searchExercises } = useExercises();
  const debounceRef = useRef<any>(null);
  const inputRef = useRef<TextInput>(null);

  // Sincronizar searchText con value cuando se abre el modal
  useEffect(() => {
    if (isModalOpen) {
      setSearchText(selectedExercise ? "" : value);
    }
  }, [isModalOpen]);

  // Búsqueda con debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!searchText.trim()) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchExercises(searchText, 10);
      setSuggestions(results);
      setIsSearching(false);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText, searchExercises]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSearchText("");
    setSuggestions([]);
    Keyboard.dismiss();
  }, []);

  const handleSelect = useCallback(
    (exercise: Exercise) => {
      onSelectExercise(exercise);
      onChangeText(exercise.nombre);
      handleCloseModal();
    },
    [onSelectExercise, onChangeText, handleCloseModal]
  );

  const handleClear = useCallback(() => {
    onChangeText("");
    onSelectExercise(null as unknown as Exercise);
  }, [onChangeText, onSelectExercise]);

  const renderItem = ({ item }: { item: Exercise }) => (
    <Pressable
      onPress={() => handleSelect(item)}
      className="flex-row items-center py-3.5 px-4"
      style={{
        backgroundColor: COLORS.surface,
      }}
      android_ripple={{ color: COLORS.accentLight }}
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: COLORS.violetLight }}
      >
        <Dumbbell size={20} color={COLORS.violet} strokeWidth={2} />
      </View>
      <View className="flex-1">
        <Text
          className="text-base font-semibold"
          style={{ color: COLORS.text, fontFamily: "Quicksand-SemiBold" }}
          numberOfLines={1}
        >
          {item.nombre}
        </Text>
        <Text
          className="text-sm mt-0.5"
          style={{ color: COLORS.textMuted, fontFamily: "Quicksand-Medium" }}
        >
          {MUSCLE_GROUP_LABELS[item.grupoMuscular]}
        </Text>
      </View>
    </Pressable>
  );

  const renderEmptyState = () => {
    if (isSearching) {
      return (
        <View className="py-12 items-center">
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text
            className="text-sm mt-3"
            style={{ color: COLORS.textMuted, fontFamily: "Quicksand-Medium" }}
          >
            Buscando ejercicios...
          </Text>
        </View>
      );
    }

    if (searchText.trim() && suggestions.length === 0) {
      return (
        <View className="py-12 items-center px-6">
          <Dumbbell size={40} color={COLORS.textMuted} strokeWidth={1.5} />
          <Text
            className="text-base mt-3 text-center"
            style={{ color: COLORS.textMuted, fontFamily: "Quicksand-Medium" }}
          >
            No se encontraron ejercicios para "{searchText}"
          </Text>
        </View>
      );
    }

    return (
      <View className="py-12 items-center px-6">
        <Search size={40} color={COLORS.textMuted} strokeWidth={1.5} />
        <Text
          className="text-base mt-3 text-center"
          style={{ color: COLORS.textMuted, fontFamily: "Quicksand-Medium" }}
        >
          Escribe para buscar ejercicios
        </Text>
      </View>
    );
  };

  return (
    <View>
      {/* Input Trigger */}
      <Pressable onPress={handleOpenModal}>
        <View
          className="flex-row items-center px-4"
          style={{
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: selectedExercise ? COLORS.borderActive : "rgba(255,255,255,0.08)",
            borderRadius: 16,
            height: 52,
          }}
        >
          {selectedExercise ? (
            <Check size={18} color={COLORS.accent} strokeWidth={2.5} />
          ) : (
            <Search size={18} color={COLORS.textMuted} strokeWidth={2} />
          )}

          <Text
            className="flex-1 ml-3"
            style={{
              color: selectedExercise ? COLORS.accent : value ? COLORS.text : COLORS.textMuted,
              fontFamily: selectedExercise ? "Quicksand-Bold" : "Quicksand-SemiBold",
              fontSize: 15,
            }}
            numberOfLines={1}
          >
            {value || placeholder}
          </Text>

          {value.length > 0 ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              hitSlop={12}
              className="p-1.5 rounded-full"
              style={{ backgroundColor: COLORS.accentLight }}
            >
              <X size={14} color={COLORS.accent} strokeWidth={2.5} />
            </Pressable>
          ) : (
            <ChevronDown size={18} color={COLORS.textMuted} strokeWidth={2} />
          )}
        </View>
      </Pressable>

      {/* Modal de Búsqueda */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          style={{ backgroundColor: COLORS.bg }}
        >
          {/* Header */}
          <View
            className="pt-4 pb-3 px-4"
            style={{
              backgroundColor: COLORS.surface,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
            }}
          >
            {/* Handle bar */}
            <View className="items-center mb-4">
              <View
                className="w-10 h-1 rounded-full"
                style={{ backgroundColor: COLORS.textMuted }}
              />
            </View>

            {/* Search Input */}
            <View
              className="flex-row items-center rounded-xl px-4"
              style={{
                backgroundColor: COLORS.bg,
                height: 48,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Search size={18} color={COLORS.textMuted} strokeWidth={2} />
              <TextInput
                ref={inputRef}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Buscar ejercicio..."
                placeholderTextColor={COLORS.textMuted}
                className="flex-1 ml-3"
                style={{
                  color: COLORS.text,
                  fontFamily: "Quicksand-SemiBold",
                  fontSize: 16,
                }}
                autoFocus
                returnKeyType="search"
              />
              {searchText.length > 0 && (
                <Pressable
                  onPress={() => setSearchText("")}
                  hitSlop={12}
                  className="p-1.5 rounded-full"
                  style={{ backgroundColor: COLORS.accentLight }}
                >
                  <X size={14} color={COLORS.accent} strokeWidth={2.5} />
                </Pressable>
              )}
            </View>

            {/* Cancel Button */}
            <Pressable
              onPress={handleCloseModal}
              className="mt-3 py-2 items-center"
            >
              <Text
                className="text-base"
                style={{ color: COLORS.accent, fontFamily: "Quicksand-Bold" }}
              >
                Cancelar
              </Text>
            </Pressable>
          </View>

          {/* Results */}
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => item._id || item.id || String(index)}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            ItemSeparatorComponent={() => (
              <View className="h-px mx-4" style={{ backgroundColor: COLORS.border }} />
            )}
          />
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}