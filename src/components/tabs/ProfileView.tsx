import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {Avatar, Text, Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {get_User, logout, remove_User} from '../../service/api';
import User from '../User';

const ProfileView = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const fetchedUser = await get_User('me');
          setUser(fetchedUser);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const token = credentials.password;
        await logout(token);
        await Keychain.resetGenericPassword();
        //@ts-ignore
        navigation.navigate('Auth', {screen: 'Login'});
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleRemoveUser = async (id: string) => {
    await remove_User(id);
    //@ts-ignore
    navigation.navigate('Auth', {screen: 'Login'});
  };

  const confirmDeleteAccount = () => {
    setShowModal(true);
  };

  const cancelDeleteAccount = () => {
    setShowModal(false);
  };

  const proceedDeleteAccount = (id: string) => {
    handleRemoveUser(id);
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
        <Text h4 style={styles.name}>
          {user.name}
        </Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <Button
          title="Edit Profile"
          //@ts-ignore
          onPress={() => navigation.navigate('Edit')}
        />
      </View>
      <View style={styles.body}>
        <Text h4 style={styles.sectionTitle}>
          About Me
        </Text>
        <Text style={styles.sectionContent}>{user.aboutMe}</Text>
      </View>
      <View style={{gap: 20}}>
        <Button title="Logout" onPress={handleLogout} />
        <Button title="Delete Account" onPress={confirmDeleteAccount} />
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
                onPress={() => proceedDeleteAccount(user?._id)}
                buttonStyle={{backgroundColor: 'red'}}
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
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  bio: {
    color: 'gray',
    marginBottom: 10,
  },
  body: {
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: 'gray',
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
    elevation: 5,
    gap: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ProfileView;
