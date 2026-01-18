import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useTheme, TextInput, Chip, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { SubscriptionFilter } from '../../types/subscription';
import type { CategoryOption } from '../../types/category';
import type { SubscriptionStatus, SubscriptionType } from '../../types/common';

interface SubscriptionFilterProps {
  categories: CategoryOption[];
  filter: SubscriptionFilter;
  onFilterChange: (filter: SubscriptionFilter) => void;
  onReset?: () => void;
}

const SubscriptionFilterComponent: React.FC<SubscriptionFilterProps> = ({
  categories,
  filter,
  onFilterChange,
  onReset,
}) => {
  const theme = useTheme() as any;

  const [keyword, setKeyword] = useState(filter.keyword || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(filter.categoryId || '');
  const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus | undefined>(
    filter.status
  );
  const [selectedType, setSelectedType] = useState<SubscriptionType | undefined>(filter.type);
  const [sortBy, setSortBy] = useState(filter.sortBy || 'renewalDate');
  const [sortOrder, setSortOrder] = useState(filter.sortOrder || 'asc');

  const handleKeywordChange = (text: string) => {
    setKeyword(text);
    onFilterChange({ ...filter, keyword: text || undefined });
  };

  const handleCategorySelect = (categoryId: string) => {
    const newCategoryId = selectedCategoryId === categoryId ? '' : categoryId;
    setSelectedCategoryId(newCategoryId);
    onFilterChange({ ...filter, categoryId: newCategoryId || undefined });
  };

  const handleStatusSelect = (status: SubscriptionStatus | undefined) => {
    setSelectedStatus(status);
    onFilterChange({ ...filter, status });
  };

  const handleTypeSelect = (type: SubscriptionType | undefined) => {
    setSelectedType(type);
    onFilterChange({ ...filter, type });
  };

  const handleSortByChange = (value: string) => {
    const newSortBy = value as 'renewalDate' | 'price' | 'createdAt' | 'name';
    setSortBy(newSortBy);
    onFilterChange({ ...filter, sortBy: newSortBy });
  };

  const handleSortOrderToggle = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    onFilterChange({ ...filter, sortOrder: newSortOrder });
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedCategoryId('');
    setSelectedStatus(undefined);
    setSelectedType(undefined);
    setSortBy('renewalDate');
    setSortOrder('asc');
    onReset?.();
  };

  const hasActiveFilters = keyword || selectedCategoryId || selectedStatus || selectedType;

  const statusOptions: { label: string; value: SubscriptionStatus }[] = [
    { label: '进行中', value: 'active' },
    { label: '已取消', value: 'cancelled' },
    { label: '已过期', value: 'expired' },
  ];

  const typeOptions: { label: string; value: SubscriptionType }[] = [
    { label: '月付', value: 'monthly' },
    { label: '年付', value: 'yearly' },
    { label: '季付', value: 'quarterly' },
    { label: '周付', value: 'weekly' },
    { label: '一次性', value: 'one-time' },
  ];

  const sortOptions = [
    { label: '续费日期', value: 'renewalDate' },
    { label: '价格', value: 'price' },
    { label: '创建时间', value: 'createdAt' },
    { label: '名称', value: 'name' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>搜索</Text>
          <TextInput
            mode="outlined"
            placeholder="搜索订阅名称..."
            value={keyword}
            onChangeText={handleKeywordChange}
            left={<TextInput.Icon icon="magnify" />}
            right={
              keyword ? (
                <TextInput.Icon icon="close" onPress={() => handleKeywordChange('')} />
              ) : undefined
            }
            style={styles.searchInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>分类</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScrollView}
          >
            <Chip
              selected={!selectedCategoryId}
              onPress={() => handleCategorySelect('')}
              style={styles.chip}
              textStyle={styles.chipText}
            >
              全部
            </Chip>
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
                    color={
                      selectedCategoryId === category.id
                        ? category.color
                        : theme.colors.text.secondary
                    }
                  />
                )}
              >
                {category.name}
              </Chip>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>状态</Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={!selectedStatus}
              onPress={() => handleStatusSelect(undefined)}
              style={styles.chip}
              textStyle={styles.chipText}
            >
              全部
            </Chip>
            {statusOptions.map((option) => (
              <Chip
                key={option.value}
                selected={selectedStatus === option.value}
                onPress={() => handleStatusSelect(option.value)}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {option.label}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>周期</Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={!selectedType}
              onPress={() => handleTypeSelect(undefined)}
              style={styles.chip}
              textStyle={styles.chipText}
            >
              全部
            </Chip>
            {typeOptions.map((option) => (
              <Chip
                key={option.value}
                selected={selectedType === option.value}
                onPress={() => handleTypeSelect(option.value)}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {option.label}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>排序</Text>
          <SegmentedButtons
            value={sortBy}
            onValueChange={handleSortByChange}
            buttons={sortOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            style={styles.segmentedButtons}
          />
          <TouchableOpacity style={styles.sortOrderButton} onPress={handleSortOrderToggle}>
            <MaterialCommunityIcons
              name={sortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'}
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.sortOrderText, { color: theme.colors.text }]}>
              {sortOrder === 'asc' ? '升序' : '降序'}
            </Text>
          </TouchableOpacity>
        </View>

        {hasActiveFilters && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <MaterialCommunityIcons name="filter-remove" size={16} color={theme.colors.error} />
            <Text style={[styles.resetButtonText, { color: theme.colors.error }]}>清除筛选</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    marginBottom: 8,
    marginRight: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipScrollView: {
    flexDirection: 'row',
  },
  chipText: {
    fontSize: 14,
  },
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  resetButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 34, 45, 0.1)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 12,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  scrollContent: {
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: 'transparent',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 12,
  },
  sortOrderButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(154, 207, 255, 0.1)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sortOrderText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default SubscriptionFilterComponent;
