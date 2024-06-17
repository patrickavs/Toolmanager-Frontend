import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native';
import {get_Users, register} from '../../service/api.ts';
import {useNavigation} from '@react-navigation/native';
import User from '../User.ts';

const RegisterView: React.FC = () => {
  const navigation = useNavigation();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: '',
    email: '',
    password: '',
  });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const validateForm = async () => {
      let errorProps = {name: '', email: '', password: ''};

      // Validate name field
      if (!name) {
        errorProps.name = 'Name wird benötigt.';
      }

      // Validate email field
      if (!email) {
        errorProps.email = 'E-mail wird benötigt.';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errorProps.email = 'Ungültige E-mail.';
      }

      // Validate password field
      if (!password) {
        errorProps.password = 'Passwort wird benötigt.';
      } else if (password.length < 8) {
        errorProps.password = 'Passwort muss mindestens 8 Zeichen lang sein.';
      }

      setErrors(errorProps);
      setIsFormValid(
        !errorProps.name && !errorProps.email && !errorProps.password,
      );
    };
    validateForm();
  }, [name, email, password]);

  const emailExisting = async () => {
    const users: User[] = await get_Users();
    for (const user of users) {
      if (user.email === email) {
        return true;
      }
    }
    return false;
  };

  const handleRegister = async () => {
    if (await emailExisting()) {
      ToastAndroid.show('E-mail wird bereits genutzt', ToastAndroid.SHORT);
      return;
    }
    if (isFormValid) {
      setLoading(true);
      try {
        await register(name, email, password);
        Alert.alert(
          'Registrierung erfolgreich',
          'Du kannst dich nun einloggen.',
        );
        navigation.goBack();
      } catch (error) {
        Alert.alert(
          'Registrierung fehlgeschlagen',
          'Ein Fehler ist während der registrierung aufgetreten.',
        );
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Das Formular beinhaltet Fehler', 'Bitte korrigiere diese.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        borderRadius={10}
        source={require('../../assets/images/signUp.png')}
        style={styles.image}
      />
      <Text style={styles.header}>Registrierung</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.button, {opacity: isFormValid ? 1 : 0.5}]}
        disabled={!isFormValid}
        onPress={handleRegister}>
        <Text style={styles.buttonText}>
          {!loading ? 'Registrierung' : 'registrieren..'}
        </Text>
      </TouchableOpacity>

      {/* Display error messages */}
      <View style={styles.errorContainer}>
        {Object.values(errors).map((error, index) => (
          <Text key={index} style={styles.error}>
            {error}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    marginBottom: 40,
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
  image: {
    width: 300,
    height: 250,
    bottom: 30,
    marginTop: 20,
    borderRadius: 10,
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
  errorContainer: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    fontSize: 15,
    marginBottom: 12,
  },
});

export default RegisterView;
