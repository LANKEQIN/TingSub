import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme, TextInput, Button, Portal, Dialog } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CategoryFormData, CategoryFormErrors } from '../../types/category';

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormData>;
  loading?: boolean;
  onSubmit: (data: CategoryFormData) => void;
  onCancel?: () => void;
  submitText?: string;
}

const PREDEFINED_COLORS = [
  '#FF0000',
  '#FF9500',
  '#FFCC00',
  '#4CAF50',
  '#00C7BE',
  '#007AFF',
  '#5856D6',
  '#AF52DE',
  '#FF2D55',
  '#8E8E93',
];

const PREDEFINED_ICONS = [
  'movie',
  'music-note',
  'book',
  'wrench',
  'heart',
  'cloud',
  'newspaper',
  'school',
  'gamepad-variant',
  'shopping',
  'food',
  'car',
  'home',
  'briefcase',
  'airplane',
  'phone',
  'laptop',
  'camera',
  'headphones',
  'television',
];

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues,
  loading = false,
  onSubmit,
  onCancel,
  submitText = '保存',
}) => {
  const theme = useTheme() as any;

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: PREDEFINED_COLORS[0],
    icon: PREDEFINED_ICONS[0],
  });

  const [errors, setErrors] = useState<CategoryFormErrors>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const validateForm = (): boolean => {
    const newErrors: CategoryFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入分类名称';
    }

    if (!formData.color) {
      newErrors.color = '请选择分类颜色';
    }

    if (!formData.icon) {
      newErrors.icon = '请选择分类图标';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color });
    setShowColorPicker(false);
  };

  const handleIconSelect = (icon: string) => {
    setFormData({ ...formData, icon });
    setShowIconPicker(false);
  };

  const renderColorPicker = () => (
    <Portal>
      <Dialog visible={showColorPicker} onDismiss={() => setShowColorPicker(false)}>
        <Dialog.Title>选择颜色</Dialog.Title>
        <Dialog.Content>
          <View style={styles.colorGrid}>
            {PREDEFINED_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  formData.color === color && styles.selectedColor,
                ]}
                onPress={() => handleColorSelect(color)}
              >
                {formData.color === color && (
                  <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );

  const renderIconPicker = () => (
    <Portal>
      <Dialog visible={showIconPicker} onDismiss={() => setShowIconPicker(false)}>
        <Dialog.Title>选择图标</Dialog.Title>
        <Dialog.Content>
          <ScrollView style={styles.iconScroll}>
            <View style={styles.iconGrid}>
              {PREDEFINED_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    formData.icon === icon && styles.selectedIcon,
                    { borderColor: formData.icon === icon ? formData.color : '#E0E0E0' },
                  ]}
                  onPress={() => handleIconSelect(icon)}
                >
                  <MaterialCommunityIcons
                    name={icon as any}
                    size={24}
                    color={formData.icon === icon ? formData.color : theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <TextInput
            label="分类名称 *"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            error={!!errors.name}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="tag" />}
          />
          {errors.name && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.name}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <TextInput
            label="描述"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
            left={<TextInput.Icon icon="text" />}
          />
        </View>

        <View style={styles.section}>
          <Button
            mode="outlined"
            onPress={() => setShowColorPicker(true)}
            icon={() => (
              <View style={[styles.colorPreview, { backgroundColor: formData.color }]} />
            )}
            style={[
              styles.pickerButton,
              { borderColor: errors.color ? theme.colors.error : undefined },
            ]}
          >
            {errors.color ? errors.color : '选择颜色'}
          </Button>
        </View>

        <View style={styles.section}>
          <Button
            mode="outlined"
            onPress={() => setShowIconPicker(true)}
            icon={() => (
              <MaterialCommunityIcons
                name={formData.icon as any}
                size={20}
                color={formData.color}
              />
            )}
            style={[
              styles.pickerButton,
              { borderColor: errors.icon ? theme.colors.error : undefined },
            ]}
          >
            {errors.icon ? errors.icon : '选择图标'}
          </Button>
        </View>

        <View style={styles.buttonContainer}>
          {onCancel && (
            <Button
              mode="outlined"
              onPress={onCancel}
              style={styles.button}
              disabled={loading}
            >
              取消
            </Button>
          )}
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {submitText}
          </Button>
        </View>
      </ScrollView>

      {renderColorPicker()}
      {renderIconPicker()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  pickerButton: {
    justifyContent: 'flex-start',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  iconScroll: {
    maxHeight: 300,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    backgroundColor: 'rgba(154, 207, 255, 0.1)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default CategoryForm;
