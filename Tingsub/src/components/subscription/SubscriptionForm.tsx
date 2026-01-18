import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useTheme, TextInput, Button, Checkbox, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { SubscriptionFormData, SubscriptionFormErrors } from '../../types/subscription';
import type { CategoryOption } from '../../types/category';
import type { TagOption } from '../../types/tag';

interface SubscriptionFormProps {
  initialValues?: Partial<SubscriptionFormData>;
  categories: CategoryOption[];
  tags: TagOption[];
  loading?: boolean;
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel?: () => void;
  submitText?: string;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  initialValues,
  categories,
  tags,
  loading = false,
  onSubmit,
  onCancel,
  submitText = '保存',
}) => {
  const theme = useTheme() as any;

  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    description: '',
    categoryId: '',
    tags: [],
    type: 'monthly',
    price: 0,
    currency: 'CNY',
    billingDate: new Date(),
    startDate: new Date(),
    autoRenew: true,
    platform: '',
    paymentMethod: '',
    notes: '',
  });

  const [errors, setErrors] = useState<SubscriptionFormErrors>({});

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const validateForm = (): boolean => {
    const newErrors: SubscriptionFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入订阅名称';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = '请选择分类';
    }

    if (formData.price <= 0) {
      newErrors.price = '请输入有效的价格';
    }

    if (!formData.billingDate) {
      newErrors.billingDate = '请选择计费日期';
    }

    if (!formData.startDate) {
      newErrors.startDate = '请选择开始日期';
    }

    if (!formData.platform.trim()) {
      newErrors.platform = '请输入订阅平台';
    }

    if (!formData.paymentMethod.trim()) {
      newErrors.paymentMethod = '请选择支付方式';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  const typeOptions = [
    { label: '月付', value: 'monthly' },
    { label: '年付', value: 'yearly' },
    { label: '季付', value: 'quarterly' },
    { label: '周付', value: 'weekly' },
    { label: '一次性', value: 'one-time' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <TextInput
            label="订阅名称 *"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            error={!!errors.name}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="tag" />}
          />
          {errors.name && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.name}</Text>
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
            onPress={() => {}}
            icon={() => (
              <MaterialCommunityIcons
                name={selectedCategory?.icon as any}
                size={20}
                color={selectedCategory?.color}
              />
            )}
            style={[
              styles.pickerButton,
              { borderColor: errors.categoryId ? theme.colors.error : undefined },
            ]}
          >
            {selectedCategory ? selectedCategory.name : '选择分类 *'}
          </Button>
          {errors.categoryId && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.categoryId}
            </Text>
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <TextInput
              label="价格 *"
              value={formData.price > 0 ? formData.price.toString() : ''}
              onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
              error={!!errors.price}
              mode="outlined"
              keyboardType="decimal-pad"
              style={styles.input}
              left={<TextInput.Icon icon="currency-cny" />}
            />
          </View>
          <View style={styles.halfWidth}>
            <Button mode="outlined" onPress={() => {}} style={styles.pickerButton}>
              {formData.currency}
            </Button>
          </View>
        </View>
        {errors.price && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.price}</Text>
        )}

        <View style={styles.section}>
          <Button mode="outlined" onPress={() => {}} style={styles.pickerButton}>
            {typeOptions.find((t) => t.value === formData.type)?.label || '选择周期 *'}
          </Button>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Button mode="outlined" onPress={() => {}} style={styles.pickerButton}>
              计费日期 *
            </Button>
          </View>
          <View style={styles.halfWidth}>
            <Button mode="outlined" onPress={() => {}} style={styles.pickerButton}>
              开始日期 *
            </Button>
          </View>
        </View>

        <View style={styles.section}>
          <TextInput
            label="订阅平台 *"
            value={formData.platform}
            onChangeText={(text) => setFormData({ ...formData, platform: text })}
            error={!!errors.platform}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="web" />}
          />
          {errors.platform && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.platform}</Text>
          )}
        </View>

        <View style={styles.section}>
          <TextInput
            label="支付方式 *"
            value={formData.paymentMethod}
            onChangeText={(text) => setFormData({ ...formData, paymentMethod: text })}
            error={!!errors.paymentMethod}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="credit-card" />}
          />
          {errors.paymentMethod && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.paymentMethod}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={formData.autoRenew ? 'checked' : 'unchecked'}
              onPress={() => setFormData({ ...formData, autoRenew: !formData.autoRenew })}
            />
            <Text style={[styles.checkboxLabel, { color: theme.colors.text }]}>自动续费</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>标签</Text>
          <View style={styles.chipContainer}>
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                selected={formData.tags.includes(tag.id)}
                onPress={() => handleTagToggle(tag.id)}
                style={[
                  styles.chip,
                  formData.tags.includes(tag.id) && { backgroundColor: tag.color + '20' },
                ]}
                textStyle={[
                  styles.chipText,
                  formData.tags.includes(tag.id) && { color: tag.color },
                ]}
              >
                {tag.name}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TextInput
            label="备注"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            left={<TextInput.Icon icon="note" />}
          />
        </View>

        <View style={styles.buttonContainer}>
          {onCancel && (
            <Button mode="outlined" onPress={onCancel} style={styles.button} disabled={loading}>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  checkboxRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  chip: {
    marginBottom: 8,
    marginRight: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipText: {
    fontSize: 14,
  },
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 12,
    marginTop: 4,
  },
  halfWidth: {
    width: '48%',
  },
  input: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerButton: {
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scrollContent: {
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
});

export default SubscriptionForm;
