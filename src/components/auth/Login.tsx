import React, {useCallback, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useUserContext} from '../../context/UserContext.tsx';

const LoginView: React.FC = () => {
  const {loginUser} = useUserContext();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        'Error',
        'Bitte gebe sowohl E-mail als auch das Passwort ein.',
      );
      return;
    }

    setLoading(true);

    try {
      await loginUser(email, password);
      //@ts-ignore
      navigation.navigate('Home');
      resetForm();
    } catch (error) {
      Alert.alert(
        'Login fehlgeschlagen',
        'Ungültige E-mail oder ungültiges Passwort.',
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Image
        borderRadius={10}
        source={require('../../assets/images/signIn.png')}
        style={styles.image}
      />
      <Text style={styles.header}>Login</Text>
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
        style={[
          styles.button,
          {opacity: loading || email === '' || password === '' ? 0.5 : 1},
        ]}
        disabled={loading || email === '' || password === ''}
        onPress={handleLogin}>
        <Text style={styles.buttonText}>Einloggen</Text>
      </TouchableOpacity>
      {/*@ts-ignore*/}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>
          Noch keinen Account? Registriere dich hier.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    marginBottom: 50,
  },
  header: {
    fontSize: 25,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: 330,
    height: 250,
    bottom: 60,
    borderRadius: 10,
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
  linkText: {
    color: '#007bff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    color: 'red',
    fontSize: 15,
    marginBottom: 12,
  },
});

export default LoginView;
