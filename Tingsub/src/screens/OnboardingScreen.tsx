import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
  TextInput,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useUserStore } from '../store/userStore';
import { StorageUtils } from '../utils/storageUtils';
import { APP_STORAGE_KEYS } from '../constants/storageKeys';
import { NEUTRAL_COLORS, PRIMARY_COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const theme = useTheme() as any;
  const { createUser } = useUserStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [username, setUsername] = useState('');
  const [showInput, setShowInput] = useState(false);

  const slideAnim = useSharedValue(0);
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);

  const onboardingData = [
    {
      title: '欢迎使用汀阅',
      subtitle: '管理您的订阅,掌控您的支出',
      description: '汀阅是一款简洁高效的订阅管理应用,帮助您轻松管理所有订阅服务,掌控您的支出。',
      icon: 'subscription',
      color: PRIMARY_COLORS.primary,
    },
    {
      title: '轻松管理订阅',
      subtitle: '添加、编辑、删除订阅',
      description: '支持多种订阅周期,自动计算续费日期,让您对订阅了如指掌。',
      icon: 'playlist-check',
      color: '#52C41A',
    },
    {
      title: '智能提醒',
      subtitle: '订阅到期及时提醒',
      description: '自定义提醒时间,支持声音和震动提醒,再也不用担心忘记续费。',
      icon: 'bell-ring',
      color: '#FAAD14',
    },
    {
      title: '数据统计',
      subtitle: '可视化分析支出',
      description: '按分类统计支出,查看趋势图表,帮助您优化订阅结构。',
      icon: 'chart-box',
      color: '#722ED1',
    },
  ];

  useEffect(() => {
    animateSlide();
  }, [currentIndex]);

  const animateSlide = () => {
    slideAnim.value = withSpring(0, { damping: 15 });
    fadeAnim.value = withTiming(1, { duration: 500 });
    scaleAnim.value = withSpring(1, { damping: 15 });
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      fadeAnim.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setCurrentIndex)(currentIndex + 1);
      });
    } else {
      setShowInput(true);
    }
  };

  const handleSkip = () => {
    setShowInput(true);
  };

  const handleStart = async () => {
    if (!username.trim()) {
      return;
    }

    try {
      await createUser(null as any, {
        username: username.trim(),
        theme: 'system',
        currency: 'CNY',
        reminderSettings: {
          enabled: true,
          advanceDays: 3,
          repeatInterval: 'none',
          notificationChannels: [
            {
              type: 'local',
              enabled: true,
              sound: true,
              vibration: true,
            },
          ],
        },
      });

      await StorageUtils.setItem(APP_STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error) {
      console.error('创建用户失败:', error);
    }
  };

  const handleDotPress = (index: number) => {
    if (index !== currentIndex && !showInput) {
      fadeAnim.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setCurrentIndex)(index);
      });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [
      { translateX: slideAnim.value },
      { scale: scaleAnim.value },
    ],
  }));

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
              { backgroundColor: index === currentIndex ? theme.colors.primary : NEUTRAL_COLORS.border.medium },
            ]}
            onPress={() => handleDotPress(index)}
            activeOpacity={0.7}
          />
        ))}
      </View>
    );
  };

  const renderOnboardingContent = () => {
    const data = onboardingData[currentIndex];

    return (
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <MaterialCommunityIcons
            name={data.icon as any}
            size={120}
            color={data.color}
          />
        </Animated.View>

        <Animated.View style={[styles.textContainer, animatedStyle]}>
          <Text style={[styles.title, { color: NEUTRAL_COLORS.text.primary }]}>
            {data.title}
          </Text>
          <Text style={[styles.subtitle, { color: data.color }]}>
            {data.subtitle}
          </Text>
          <Text style={[styles.description, { color: NEUTRAL_COLORS.text.secondary }]}>
            {data.description}
          </Text>
        </Animated.View>

        {renderDots()}

        <View style={styles.buttonContainer}>
          {currentIndex < onboardingData.length - 1 ? (
            <>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
                activeOpacity={0.7}
              >
                <Text style={[styles.skipButtonText, { color: NEUTRAL_COLORS.text.secondary }]}>
                  跳过
                </Text>
              </TouchableOpacity>
              <Button
                mode="contained"
                onPress={handleNext}
                style={styles.nextButton}
                contentStyle={styles.buttonContent}
              >
                下一步
              </Button>
            </>
          ) : (
            <Button
              mode="contained"
              onPress={() => setShowInput(true)}
              style={styles.startButton}
              contentStyle={styles.buttonContent}
            >
              开始使用
            </Button>
          )}
        </View>
      </View>
    );
  };

  const renderInputContent = () => {
    return (
      <View style={styles.inputContent}>
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <MaterialCommunityIcons
            name="account-circle"
            size={120}
            color={theme.colors.primary}
          />
        </Animated.View>

        <Animated.View style={[styles.textContainer, animatedStyle]}>
          <Text style={[styles.title, { color: NEUTRAL_COLORS.text.primary }]}>
            创建您的账户
          </Text>
          <Text style={[styles.description, { color: NEUTRAL_COLORS.text.secondary }]}>
            请输入您的用户名,开始使用汀阅
          </Text>
        </Animated.View>

        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: NEUTRAL_COLORS.text.secondary }]}>
            用户名
          </Text>
          <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={theme.colors.placeholder}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="请输入用户名"
              placeholderTextColor={theme.colors.placeholder}
              value={username}
              onChangeText={setUsername}
            />
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleStart}
          disabled={!username.trim()}
          style={styles.startButton}
          contentStyle={styles.buttonContent}
        >
          开始使用
        </Button>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowInput(false)}
          activeOpacity={0.7}
        >
          <Text style={[styles.backButtonText, { color: NEUTRAL_COLORS.text.secondary }]}>
            返回
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <ImageBackground
        source={require('../../assets/splash-icon.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      />

      <View style={styles.overlay} />

      {showInput ? renderInputContent() : renderOnboardingContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.05,
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  activeDot: {
    width: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  skipButton: {
    marginBottom: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    width: '100%',
  },
  startButton: {
    width: '100%',
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 12,
    height: 52,
  },
  inputContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  backButton: {
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OnboardingScreen;
