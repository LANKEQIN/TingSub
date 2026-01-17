import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
} from 'react-native';
import { useTheme, Appbar, Divider, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const theme = useTheme() as any;

  const handleCategoriesPress = () => {
    navigation.navigate('Categories');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleAboutPress = () => {
    console.log('关于');
  };

  const handleHelpPress = () => {
    console.log('帮助');
  };

  const handleFeedbackPress = () => {
    console.log('意见反馈');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="个人中心" />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            数据管理
          </Text>
          <List.Item
            title="分类管理"
            description="管理订阅分类"
            left={(props) => (
              <List.Icon
                {...props}
                icon={() => (
                  <MaterialCommunityIcons name="folder-multiple" size={24} color={theme.colors.primary} />
                )}
              />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleCategoriesPress}
          />
          <Divider />
          <List.Item
            title="标签管理"
            description="管理订阅标签"
            left={(props) => (
              <List.Icon
                {...props}
                icon={() => (
                  <MaterialCommunityIcons name="tag-multiple" size={24} color={theme.colors.primary} />
                )}
              />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('标签管理')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            应用设置
          </Text>
          <List.Item
            title="设置"
            description="应用偏好设置"
            left={(props) => (
              <List.Icon
                {...props}
                icon={() => (
                  <MaterialCommunityIcons name="cog" size={24} color={theme.colors.primary} />
                )}
              />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleSettingsPress}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            关于
          </Text>
          <List.Item
            title="关于汀阅"
            description="版本信息"
            left={(props) => (
              <List.Icon
                {...props}
                icon={() => (
                  <MaterialCommunityIcons name="information" size={24} color={theme.colors.primary} />
                )}
              />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleAboutPress}
          />
          <Divider />
          <List.Item
            title="帮助中心"
            description="使用帮助"
            left={(props) => (
              <List.Icon
                {...props}
                icon={() => (
                  <MaterialCommunityIcons name="help-circle" size={24} color={theme.colors.primary} />
                )}
              />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleHelpPress}
          />
          <Divider />
          <List.Item
            title="意见反馈"
            description="向我们反馈问题"
            left={(props) => (
              <List.Icon
                {...props}
                icon={() => (
                  <MaterialCommunityIcons name="comment-text" size={24} color={theme.colors.primary} />
                )}
              />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleFeedbackPress}
          />
        </View>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.text.tertiary }]}>
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
  section: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
