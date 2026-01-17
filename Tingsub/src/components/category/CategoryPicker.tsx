import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CategoryOption } from '../../types/category';

interface CategoryPickerProps {
  categories: CategoryOption[];
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string | undefined) => void;
  placeholder?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
  style?: any;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
  placeholder = '选择分类',
  showAllOption = true,
  allOptionLabel = '全部',
  style,
}) => {
  const theme = useTheme() as any;
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleCategorySelect = (categoryId: string) => {
    const newCategoryId = selectedCategoryId === categoryId ? undefined : categoryId;
    onCategorySelect(newCategoryId);
  };

  const getSelectedCategory = () => {
    if (!selectedCategoryId) {
      return null;
    }
    return categories.find((cat) => cat.id === selectedCategoryId);
  };

  const selectedCategory = getSelectedCategory();

  const renderCollapsedView = () => {
    return (
      <TouchableOpacity
        style={[styles.collapsedContainer, { borderColor: theme.colors.border }, style]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        {selectedCategory ? (
          <View style={styles.selectedCategory}>
            <View style={[styles.iconContainer, { backgroundColor: selectedCategory.color + '20' }]}>
              <MaterialCommunityIcons
                name={selectedCategory.icon as any}
                size={20}
                color={selectedCategory.color}
              />
            </View>
            <Text style={[styles.selectedText, { color: theme.colors.text }]}>
              {selectedCategory.name}
            </Text>
          </View>
        ) : (
          <Text style={[styles.placeholder, { color: theme.colors.placeholder }]}>
            {placeholder}
          </Text>
        )}
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.text.tertiary}
        />
      </TouchableOpacity>
    );
  };

  const renderExpandedView = () => {
    return (
      <View style={[styles.expandedContainer, style]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {placeholder}
          </Text>
          <TouchableOpacity onPress={handleToggle} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.chipContainer}>
            {showAllOption && (
              <Chip
                selected={!selectedCategoryId}
                onPress={() => handleCategorySelect('')}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {allOptionLabel}
              </Chip>
            )}
            {categories.map((category) => (
              <Chip
                key={category.id}
                selected={selectedCategoryId === category.id}
                onPress={() => handleCategorySelect(category.id)}
                style={[
                  styles.chip,
                  selectedCategoryId === category.id && {
                    backgroundColor: category.color + '20',
                    borderColor: category.color,
                  },
                ]}
                textStyle={[
                  styles.chipText,
                  selectedCategoryId === category.id && { color: category.color },
                ]}
                icon={() => (
                  <MaterialCommunityIcons
                    name={category.icon as any}
                    size={16}
                    color={selectedCategoryId === category.id ? category.color : theme.colors.text.secondary}
                  />
                )}
              >
                {category.name}
              </Chip>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return expanded ? renderExpandedView() : renderCollapsedView();
};

const styles = StyleSheet.create({
  collapsedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '500',
  },
  placeholder: {
    fontSize: 16,
    flex: 1,
  },
  expandedContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    maxHeight: 200,
    padding: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
  },
});

export default CategoryPicker;
