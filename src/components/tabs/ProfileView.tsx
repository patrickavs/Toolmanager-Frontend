import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Avatar, Text, Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import User from '../User.ts';
import * as Keychain from 'react-native-keychain';
import {logout} from '../../service/api.ts';

const ProfileView = (user: User) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const token = credentials.password;
        await logout(token);
        await Keychain.resetGenericPassword();
        //@ts-ignore
        navigation.navigate('AuthStackScreen');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {user ? (
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
          buttonStyle={styles.button}
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
      <Button title="Logout" onPress={handleLogout} />
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
  button: {
    backgroundColor: '#007bff',
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
});

export default ProfileView;
