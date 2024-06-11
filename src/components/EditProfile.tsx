import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {update_User} from '../service/api.ts';

interface Errors {
  name: string;
  email: string;
}

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const {user} = route.params;
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [aboutMe, setAboutMe] = useState(user?.aboutMe || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [errors, setErrors] = useState<Errors>({
    name: '',
    email: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [name, email, aboutMe, bio]);

  if (!user) {
    return <Text>Failed to fetch data</Text>;
  }

  const validateForm = () => {
    let errorProps: Errors = {
      name: '',
      email: '',
    };

    // Validate name field
    if (!name) {
      errorProps.name = 'Name is required.';
    }

    // Validate email field
    if (!email) {
      errorProps.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorProps.email = 'Email is invalid.';
    }

    setErrors(errorProps);
    setIsFormValid(!errorProps.name && !errorProps.email);
  };

  const handleSubmit = async () => {
    if (isFormValid) {
      await update_User(user.email, {
        ...user,
        name: name,
        email: email,
        aboutMe: aboutMe,
        bio: bio,
      });

      ToastAndroid.show('Changes saved', ToastAndroid.SHORT);
      console.log('Form submitted successfully!');
      navigation.goBack();
    } else {
      console.log('Form has errors. Please correct them.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="About Me"
          value={aboutMe}
          onChangeText={setAboutMe}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
        />
        <TouchableOpacity
          style={[styles.button, {opacity: isFormValid ? 1 : 0.5}]}
          disabled={!isFormValid}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        {/* Display error messages */}
        {Object.values(errors).map((error, index) => (
          <Text key={index} style={styles.error}>
            {error}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    fontSize: 25,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 15,
    marginBottom: 12,
  },
});

export default EditProfile;
