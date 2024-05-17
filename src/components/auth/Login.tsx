import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {login} from '../../service/api.ts';

const LoginView: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{email: string; password: string}>({
    email: '',
    password: '',
  });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const validateForm = () => {
    let errorProps = {email: '', password: ''};

    // Validate email field
    if (!email) {
      errorProps.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorProps.email = 'Email is invalid.';
    }

    // Validate password field
    if (!password) {
      errorProps.password = 'Password is required.';
    }

    setErrors(errorProps);
    setIsFormValid(!errorProps.email && !errorProps.password);
  };

  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        const token = await login(email, password);
        await Keychain.setGenericPassword('token', token);
        console.log('Login successful!');
        navigation.navigate('Home');
      } catch (error) {
        console.error('Login failed', error);
        alert('Login failed');
      }
    } else {
      console.log('Form has errors. Please correct them.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        borderRadius={10}
        source={require('../../assets/images/signIn.png')}
        style={{width: 330, height: 250, bottom: 60, borderRadius: 10}}
      />
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, {opacity: isFormValid ? 1 : 0.5}]}
        disabled={!isFormValid}
        onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>

      {/* Display error messages */}
      {Object.values(errors).map((error, index) => (
        <Text key={index} style={styles.error}>
          {error}
        </Text>
      ))}
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
    position: 'absolute',
    color: '#007bff',
    fontSize: 16,
    marginTop: 100,
  },
  error: {
    color: 'red',
    fontSize: 15,
    marginBottom: 12,
  },
});

export default LoginView;
