import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {Avatar, Text, Button, Icon} from 'react-native-elements';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {remove_User} from '../../service/api';
import {useUserContext} from '../../context/UserContext.tsx';

const ProfileView = () => {
  const {user, fetchUser, logoutUser} = useUserContext();
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    getUser().then(() => console.log('successfully fetched user'));
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUser().then(() => console.log('successfully fetched user'));
    }, []),
  );

  const getUser = async () => {
    try {
      const credentials = await Keychain.getInternetCredentials('user');
      if (credentials) {
        await fetchUser();
      }
    } catch (error) {
      console.log('Failed to fetch user. Possibly invalid token', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      //@ts-ignore
      navigation.navigate('Auth', {screen: 'Login'});
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleRemoveUser = async (email: string) => {
    await remove_User(email);
    //@ts-ignore
    navigation.navigate('Auth', {screen: 'Login'});
  };

  const confirmDeleteAccount = () => {
    setShowModal(true);
  };

  const cancelDeleteAccount = () => {
    setShowModal(false);
  };

  const proceedDeleteAccount = async (email: string) => {
    await handleRemoveUser(email);
    setShowModal(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Failed to load user data</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {user.profilePic ? (
          <Avatar
            rounded
            size="xlarge"
            source={{
              uri: user.profilePic,
            }}
          />
        ) : null}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>
      <View style={styles.body}>
        <Text h4 style={styles.sectionTitle}>
          About Me
        </Text>
        <Text style={styles.sectionContent}>{user.aboutMe}</Text>
        <Button
          icon={<Icon name="pencil" type="ionicon" color="#fff" />}
          title=" Edit Profile"
          //@ts-ignore
          onPress={() => navigation.navigate('Edit', {user: user})}
        />
      </View>
      <View style={styles.actions}>
        <Button
          icon={<Icon name="log-out-outline" type="ionicon" color="#fff" />}
          title=" Logout"
          onPress={handleLogout}
        />
        <Button
          icon={<Icon name="trash-outline" type="ionicon" color="#fff" />}
          title=" Delete Account"
          onPress={confirmDeleteAccount}
          buttonStyle={styles.deleteButton}
        />
      </View>
      <Modal visible={showModal} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={cancelDeleteAccount} />
              <Button
                title="Delete"
                onPress={() => proceedDeleteAccount(user?.email)}
                buttonStyle={styles.deleteButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 35,
    color: '#343a40',
    paddingBottom: 8,
  },
  bio: {
    color: '#6c757d',
  },
  body: {
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#343a40',
    paddingBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#6c757d',
    paddingBottom: 60,
  },
  actions: {
    marginTop: 20,
    gap: 20,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    gap: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#343a40',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ProfileView;
