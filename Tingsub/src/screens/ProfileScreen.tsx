import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useTheme, Appbar, Avatar, Divider, Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SettingGroup from '../components/settings/SettingGroup';
import SettingItem from '../components/settings/SettingItem';
import { useUserStore } from '../store/userStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { formatDate } from '../utils/dateUtils';
import { NEUTRAL_COLORS } from '../constants/theme';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const theme = useTheme() as any;
  const { currentUser } = useUserStore();
  const { subscriptions } = useSubscriptionStore();

  const [menuVisible, setMenuVisible] = useState(false);

  const activeSubscriptions = subscriptions.filter((sub: any) => sub.status === 'active');
  const totalExpense = activeSubscriptions.reduce((sum: number, sub: any) => sum + sub.price, 0);

  const handleEditProfile = () => {
    console.log('编辑个人资料');
  };

  const handleCategoriesPress = () => {
    navigation.navigate('Categories');
  };

  const handleTagsPress = () => {
    console.log('标签管理');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleAboutPress = () => {
    navigation.navigate('Settings');
  };

  const handleHelpPress = () => {
    console.log('帮助中心');
  };

  const handleFeedbackPress = () => {
    console.log('意见反馈');
  };

  const handleShareApp = () => {
    Alert.alert('分享应用', '感谢您的分享!');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="个人中心" />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />
          }
        >
          <Menu.Item
            onPress={handleEditProfile}
            title="编辑资料"
            leadingIcon="account-edit"
          />
          <Menu.Item
            onPress={() => setMenuVisible(false)}
            title="取消"
            leadingIcon="close"
          />
        </Menu>
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        {/* 用户信息卡片 */}
        <View style={[styles.userInfoCard, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            {currentUser?.avatar ? (
              <Image
                source={{ uri: currentUser.avatar }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Text
                size={80}
                label={currentUser?.username?.substring(0, 2).toUpperCase() || 'U'}
                style={styles.avatar}
              />
            )}
            <View style={[styles.editBadge, { backgroundColor: theme.colors.primary }]}>
              <MaterialCommunityIcons name="pencil" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.username, { color: theme.colors.text }]}>
            {currentUser?.username || '用户'}
          </Text>
          {currentUser?.email && (
            <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
              {currentUser.email}
            </Text>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {activeSubscriptions.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                订阅数
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                ¥{totalExpense.toFixed(0)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                月支出
              </Text>
            </View>
          </View>
        </View>

        {/* 数据管理 */}
        <SettingGroup title="数据管理" description="管理您的订阅数据">
          <SettingItem
            title="分类管理"
            description="管理订阅分类"
            icon="folder-multiple"
            type="chevron"
            onPress={handleCategoriesPress}
          />
          <Divider />
          <SettingItem
            title="标签管理"
            description="管理订阅标签"
            icon="tag-multiple"
            type="chevron"
            onPress={handleTagsPress}
          />
        </SettingGroup>

        {/* 应用设置 */}
        <SettingGroup title="应用设置" description="个性化您的应用">
          <SettingItem
            title="设置"
            description="应用偏好设置"
            icon="cog"
            type="chevron"
            onPress={handleSettingsPress}
          />
        </SettingGroup>

        {/* 更多功能 */}
        <SettingGroup title="更多" description="探索更多功能">
          <SettingItem
            title="分享应用"
            description="推荐给朋友"
            icon="share-variant"
            type="chevron"
            onPress={handleShareApp}
          />
          <Divider />
          <SettingItem
            title="关于汀阅"
            description="版本信息"
            icon="information"
            type="chevron"
            onPress={handleAboutPress}
          />
          <Divider />
          <SettingItem
            title="帮助中心"
            description="使用帮助"
            icon="help-circle"
            type="chevron"
            onPress={handleHelpPress}
          />
          <Divider />
          <SettingItem
            title="意见反馈"
            description="向我们反馈问题"
            icon="comment-text"
            type="chevron"
            onPress={handleFeedbackPress}
          />
        </SettingGroup>

        {/* 账户信息 */}
        {currentUser && (
          <View style={styles.accountInfo}>
            <Text style={[styles.accountInfoText, { color: theme.colors.textSecondary }]}>
              账户创建于 {formatDate(currentUser.createdAt, 'yyyy年MM月dd日')}
            </Text>
          </View>
        )}

        {/* 版本信息 */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.placeholder }]}>
            汀阅 v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  userInfoCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: NEUTRAL_COLORS.border.light,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  accountInfo: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  accountInfoText: {
    fontSize: 12,
  },
  versionContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
  },
});

export default ProfileScreen;
