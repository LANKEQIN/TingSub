import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, Alert, Linking } from 'react-native';
import { useTheme, Appbar, Dialog, Portal, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SettingGroup from '../components/settings/SettingGroup';
import SettingItem from '../components/settings/SettingItem';
import ThemeSwitch from '../components/settings/ThemeSwitch';
import FontScaleSwitch from '../components/settings/FontScaleSwitch';
import { useUserStore } from '../store/userStore';
import { useTheme as useCustomTheme } from '../hooks/useTheme';
import { useFontScale } from '../hooks/useFontScale';
import { StorageUtils } from '../utils/storageUtils';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const theme = useTheme() as any;
  const { currentTheme, toggleTheme } = useCustomTheme();
  const { fontScale } = useFontScale();
  const { currentUser, updateTheme, updateReminderSettings } = useUserStore();

  const [clearDataDialogVisible, setClearDataDialogVisible] = useState(false);
  const [aboutDialogVisible, setAboutDialogVisible] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [advanceDays, setAdvanceDays] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  useEffect(() => {
    if (currentUser?.reminderSettings) {
      setNotificationEnabled(currentUser.reminderSettings.enabled);
      setAdvanceDays(currentUser.reminderSettings.advanceDays);
      if (currentUser.reminderSettings.notificationChannels.length > 0) {
        setSoundEnabled(currentUser.reminderSettings.notificationChannels[0].sound);
        setVibrationEnabled(currentUser.reminderSettings.notificationChannels[0].vibration);
      }
    }
  }, [currentUser]);

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    try {
      await updateTheme(null as any, newTheme);
      await toggleTheme(newTheme);
    } catch (error) {
      Alert.alert('错误', '主题切换失败');
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    setNotificationEnabled(enabled);
    try {
      await updateReminderSettings(null as any, {
        enabled,
        advanceDays,
        notificationChannels: [
          {
            type: 'local',
            enabled,
            sound: soundEnabled,
            vibration: vibrationEnabled,
          },
        ],
      });
    } catch (error) {
      Alert.alert('错误', '通知设置失败');
    }
  };

  const handleAdvanceDaysChange = async (days: number) => {
    setAdvanceDays(days);
    try {
      await updateReminderSettings(null as any, {
        enabled: notificationEnabled,
        advanceDays: days,
        notificationChannels: [
          {
            type: 'local',
            enabled: notificationEnabled,
            sound: soundEnabled,
            vibration: vibrationEnabled,
          },
        ],
      });
    } catch (error) {
      Alert.alert('错误', '提醒设置失败');
    }
  };

  const handleSoundToggle = async (enabled: boolean) => {
    setSoundEnabled(enabled);
    try {
      await updateReminderSettings(null as any, {
        enabled: notificationEnabled,
        advanceDays,
        notificationChannels: [
          {
            type: 'local',
            enabled: notificationEnabled,
            sound: enabled,
            vibration: vibrationEnabled,
          },
        ],
      });
    } catch (error) {
      Alert.alert('错误', '声音设置失败');
    }
  };

  const handleVibrationToggle = async (enabled: boolean) => {
    setVibrationEnabled(enabled);
    try {
      await updateReminderSettings(null as any, {
        enabled: notificationEnabled,
        advanceDays,
        notificationChannels: [
          {
            type: 'local',
            enabled: notificationEnabled,
            sound: soundEnabled,
            vibration: enabled,
          },
        ],
      });
    } catch (error) {
      Alert.alert('错误', '震动设置失败');
    }
  };

  const handleClearData = async () => {
    setClearDataDialogVisible(false);
    try {
      await StorageUtils.clear();
      Alert.alert('成功', '数据已清除', [
        {
          text: '确定',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '清除数据失败');
    }
  };

  const handleAbout = () => {
    setAboutDialogVisible(true);
  };

  const handleHelp = () => {
    Linking.openURL('https://github.com/your-repo/tingsub/wiki');
  };

  const handleFeedback = () => {
    Linking.openURL('mailto:support@tingsub.com');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://tingsub.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://tingsub.com/terms');
  };

  const handleRateApp = () => {
    Alert.alert('感谢支持', '感谢您使用汀阅!');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="设置" />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        {/* 外观设置 */}
        <SettingGroup title="外观" description="自定义应用外观">
          <SettingItem
            title="主题模式"
            description="选择应用主题"
            icon="theme-light-dark"
            type="chevron"
            onPress={() => {}}
          />
          <View style={styles.themeSwitchContainer}>
            <ThemeSwitch
              value={currentTheme.mode as 'light' | 'dark' | 'system'}
              onThemeChange={handleThemeChange}
            />
          </View>
          <SettingItem
            title="字体大小"
            description="调整应用字体大小"
            icon="format-size"
            type="chevron"
            onPress={() => {}}
          />
          <View style={styles.fontScaleSwitchContainer}>
            <FontScaleSwitch value={fontScale} />
          </View>
        </SettingGroup>

        {/* 通知设置 */}
        <SettingGroup title="通知" description="管理订阅提醒通知">
          <SettingItem
            title="启用通知"
            description="接收订阅到期提醒"
            icon="bell"
            type="switch"
            value={notificationEnabled}
            onValueChange={handleNotificationToggle}
          />
          {notificationEnabled && (
            <>
              <SettingItem
                title="提前提醒天数"
                description={`到期前${advanceDays}天提醒`}
                icon="calendar-clock"
                type="chevron"
                onPress={() => {
                  Alert.alert('选择提前天数', '请选择提前提醒的天数', [
                    { text: '1天', onPress: () => handleAdvanceDaysChange(1) },
                    { text: '3天', onPress: () => handleAdvanceDaysChange(3) },
                    { text: '7天', onPress: () => handleAdvanceDaysChange(7) },
                    { text: '取消', style: 'cancel' },
                  ]);
                }}
              />
              <SettingItem
                title="通知声音"
                description="播放提示音"
                icon="volume-high"
                type="switch"
                value={soundEnabled}
                onValueChange={handleSoundToggle}
              />
              <SettingItem
                title="震动提醒"
                description="震动提示"
                icon="vibrate"
                type="switch"
                value={vibrationEnabled}
                onValueChange={handleVibrationToggle}
              />
            </>
          )}
        </SettingGroup>

        {/* 数据管理 */}
        <SettingGroup title="数据管理" description="管理应用数据">
          <SettingItem
            title="导出数据"
            description="导出订阅数据为CSV或JSON"
            icon="export"
            type="chevron"
            onPress={() => navigation.navigate('Export')}
          />
          <SettingItem
            title="清除数据"
            description="清除所有本地数据"
            icon="delete-forever"
            type="chevron"
            onPress={() => setClearDataDialogVisible(true)}
          />
        </SettingGroup>

        {/* 关于 */}
        <SettingGroup title="关于" description="应用信息">
          <SettingItem
            title="关于汀阅"
            description="版本信息"
            icon="information"
            type="chevron"
            onPress={handleAbout}
          />
          <SettingItem
            title="帮助中心"
            description="使用帮助"
            icon="help-circle"
            type="chevron"
            onPress={handleHelp}
          />
          <SettingItem
            title="意见反馈"
            description="向我们反馈问题"
            icon="comment-text"
            type="chevron"
            onPress={handleFeedback}
          />
          <SettingItem
            title="给我们评分"
            description="在应用商店评分"
            icon="star"
            type="chevron"
            onPress={handleRateApp}
          />
        </SettingGroup>

        {/* 法律信息 */}
        <SettingGroup title="法律信息" description="法律条款">
          <SettingItem
            title="隐私政策"
            description="查看隐私政策"
            icon="shield-account"
            type="chevron"
            onPress={handlePrivacyPolicy}
          />
          <SettingItem
            title="服务条款"
            description="查看服务条款"
            icon="file-document"
            type="chevron"
            onPress={handleTermsOfService}
          />
        </SettingGroup>

        {/* 版本信息 */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.placeholder }]}>汀阅 v1.0.0</Text>
        </View>
      </ScrollView>

      {/* 清除数据确认对话框 */}
      <Portal>
        <Dialog visible={clearDataDialogVisible} onDismiss={() => setClearDataDialogVisible(false)}>
          <Dialog.Title>确认清除数据</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              此操作将清除所有本地数据,包括订阅、分类、标签等信息。此操作不可恢复,确定要继续吗?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearDataDialogVisible(false)}>取消</Button>
            <Button onPress={handleClearData} mode="contained">
              确认清除
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* 关于对话框 */}
      <Portal>
        <Dialog visible={aboutDialogVisible} onDismiss={() => setAboutDialogVisible(false)}>
          <Dialog.Title>关于汀阅</Dialog.Title>
          <Dialog.Content>
            <View style={styles.aboutContent}>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={64}
                color={theme.colors.primary}
                style={styles.aboutIcon}
              />
              <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>汀阅 TingSub</Text>
              <Text style={[styles.aboutVersion, { color: theme.colors.placeholder }]}>
                版本 1.0.0
              </Text>
              <Text style={[styles.aboutDescription, { color: theme.colors.textSecondary }]}>
                一款简洁高效的订阅管理应用,帮助您轻松管理所有订阅服务,掌控您的支出。
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAboutDialogVisible(false)}>关闭</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  aboutContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  aboutDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  aboutIcon: {
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  aboutVersion: {
    fontSize: 14,
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  dialogText: {
    fontSize: 16,
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  themeSwitchContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  fontScaleSwitchContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
  },
});

export default SettingsScreen;
