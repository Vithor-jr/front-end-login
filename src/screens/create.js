import React, { useState } from "react";
import { 
  StyleSheet, 
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Create() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [erroPassword, setErroPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const navigation = useNavigation();

  const evaluatePasswordStrength = (password) => {
    // Lógica de avaliação da força da senha
    const minusculas = (password.match(/[a-z]/g) || []).length;
    const maiusculas = (password.match(/[A-Z]/g) || []).length;
    const numeros = (password.match(/\d/g) || []).length;
    const simbolos = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;

    const isStrong =
    password.length >= 8 &&
    minusculas >= 4 &&
    maiusculas >= 2 &&
    numeros >= 1 &&
    simbolos >= 1;

    return isStrong ? "Senha Forte" : "Senha Fraca";
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    const strength = evaluatePasswordStrength(text);
    setPasswordStrength(strength);
  };

  const validar = () => {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let isValid = true;

    if (!nome.trim()) {
      setErroNome('Por favor, insira um nome válido');
      isValid = false;
    } else {
      setErroNome('');
    }

    if(!password.trim()){
      setErroPassword('Por favor, insira uma senha válida');
      isValid = false;
    } else {
      setErroPassword('');
    }

    if (!regexEmail.test(email)) {
      setErroEmail('Por favor, insira um email válido');
      isValid = false;
    } else {
      setErroEmail('');
    }

    return isValid;
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const salvar = async () => {
    if (validar()) {
      try {
        console.log('Enviando dados para o servidor...');
        const response = await axios.post('http://192.168.1.3:3000/user', {
          name: nome,
          email: email,
          password: password,
        });

        console.log('Resposta do servidor:', response.data);

        // Agora, faça uma chamada para buscar o nome do usuário
        const userId = response.data.id;
        const userResponse = await axios.get(`http://192.168.1.3:3000/user/${userId}`);

        // Navegar para a tela Home e passar o ID e o nome do usuário como parâmetros
        navigation.navigate('Home', { userId, userName: userResponse.data.name });
       
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // Trate o erro de conflito (usuário já cadastrado)
          setErroEmail('E-mail já cadastrado. Por favor, escolha outro.');
        } else {
          // Trate outros erros
          console.error('Erro ao enviar dados:', error);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Cadastro</Text>
      <TextInput 
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor='rgba(255, 0, 0, 0.3)'
        onChangeText={text => setNome(text)}
        value={nome}
      />
      {erroNome && <Text style={styles.erro}>{erroNome}</Text>}
      
      
      <TextInput
        keyboardType="email-address"
        style={styles.input}
        placeholder="Email"
        placeholderTextColor='rgba(255, 0, 0, 0.3)'
        onChangeText={text => setEmail(text)}
        value={email}
      />
      {erroEmail && <Text style={styles.erro}>{erroEmail}</Text>}


      <View style={styles.passwordContainer}>
        <TextInput
          secureTextEntry={!isPasswordVisible}
          textContentType="password"
          style={styles.passwordInput}
          placeholder="Senha"
          placeholderTextColor='rgba(255, 0, 0, 0.3)'
          onChangeText={handlePasswordChange}
          value={password}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
          <Icon name={isPasswordVisible ? "eye" : "eye-slash"} size={20} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={{ width: '100%', alignItems: 'flex-end' }}>
         <Text style={[styles.strengthText, { color: passwordStrength === 'Senha Forte' ? 'green' : 'red' }]}>
            {passwordStrength}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={{ color: 'white', fontSize: 20 }}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  texto: {
    marginBottom: 20,
    fontSize: 24,
    color: '#FF3355',
  },
  container: {
    padding: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: 'blue',
    marginTop: 20,
    paddingStart: 20,
    width: '100%',
    height: 35,
    borderRadius: 100,
    borderColor: '#ff0022',
    borderWidth: 2,
  },
  button: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: 'blue',
    borderRadius: 100,
  },
  erro: {
    color: 'red',
    marginTop: 5,
  },
  strengthText: {
    marginTop: 10,
    color: "green", // Você pode ajustar as cores conforme necessário
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  passwordInput: {
    color: 'blue',
    flex: 1,
    height: 35,
    borderRadius: 100,
    borderColor: '#ff0022',
    borderWidth: 2,
    paddingHorizontal: 20,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 15,
  },
});
