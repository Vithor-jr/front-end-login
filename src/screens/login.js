import React, {useState, useEffect} from "react";
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import { 
	StyleSheet,
  View,
	Text,
	TouchableOpacity,
	TextInput,
} from "react-native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Login(){
	const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	const [erroEmail, setErroEmail] = useState("");
  const [erroPassword, setErroPassword] = useState("");
	const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

	const validar = () => {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let isValid = true;

    if (!password.trim()) {
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

  const entrar = async () => {
    try {
      if (validar()) {
        console.log('Enviando dados para o servidor...');
        const response = await axios.post('http://192.168.1.3:3000/login', {
          email: email,
          password: password,
        });
        await AsyncStorage.setItem('access_token', response.data.access_token);
        console.log('Resposta do servidor:', response.data);
        // Navegar para a tela Home e passar o ID do usuário como parâmetro
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home',
              params: { userId: response.data.id, userName: response.data.name },
            },
          ],
        });
      }
    } catch (error) {
      console.log('Erro ao enviar dados:', error);
  
      // Adicionando tratamento de erro para exibir mensagem ao usuário
      if (error.response && error.response.status === 401) {
        // Código 401 indica que as credenciais (e-mail/senha) estão incorretas
        setErroEmail('E-mail ou senha incorretos');
        setErroPassword('E-mail ou senha incorretos');
      } else {
        // Outros erros, você pode ajustar conforme necessário
        setErroEmail('Erro ao fazer login');
        setErroPassword('Erro ao fazer login');
      }
    }
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

	useFocusEffect(
    React.useCallback(() => {
      // Limpar os campos quando a tela ganhar foco
      setEmail("");
      setPassword("");
      setErroEmail("");
      setErroPassword("");
    }, [])
  );

	return(
		<View style={styles.container}>
			<Text style={styles.texto}>Login</Text>

			<TextInput
				keyboardType="email-address"
				autoCompleteType="email"
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
          placeholderTextColor="rgba(255, 0, 0, 0.3)"
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
          <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#333" />
        </TouchableOpacity>
      </View>
			{erroPassword && <Text style={styles.erro}>{erroPassword}</Text>}

      <View style={{width:'100%', alignItems:'flex-end'}}>
        <TouchableOpacity style={{marginTop:10}} onPress={() => navigation.navigate('Email')}>
            <Text>Redefinir Senha</Text>
        </TouchableOpacity>
      </View>

			<View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
				<TouchableOpacity style={styles.button} onPress={entrar}>
					<Text style={{color:'white', fontSize:15}}>Salvar</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Create')}>
					<Text style={{color:'white', fontSize:15}}>Cadastrar Usuário</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	texto: {
		fontSize:24,
		color: '#FF3355'
	},
	container:{
		flex:1,
		paddingHorizontal:30,
		alignItems: 'center',
		justifyContent:'center'
	},
	button: {
		marginTop:30,
		paddingVertical:10,
		paddingHorizontal:30,
		backgroundColor:"blue",
		borderRadius:100
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
	erro: {
    color: 'red',
    marginTop: 5,
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