import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Email() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [erroEmail, setErroEmail] = useState("");

  const validarEmail = () => {
		const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let isValid = true; 

    if (!regexEmail.test(email)) {
      setErroEmail('Por favor, insira um email válido');
      isValid = false;
    } else {
      setErroEmail('');
    }

    return isValid;
  };

  const enviarEmail = async () => {
		if (validarEmail()) {
			try {
				console.log('Enviando requisição para redefinir senha...');
				const response = await axios.post('http://192.168.1.3:3000/request-password-reset', { email: email });
	
				console.log('Resposta:', response);
	
				if (response.status === 200) {
					navigation.navigate('ResetPassword', { email: email });
				} else {
					console.error('Erro ao enviar o email:', response.status);
				}
			} catch (error) {
				console.error('Erro ao enviar o email:', error.message);
			}
		}
	};
	
  return (
    <View style={style.container}>
      <Text style={style.title}>Redefinir Senha</Text>

      <View style={{ width: '100%', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center' }}>
          Digite seu e-mail no campo abaixo e lhe enviaremos uma nova senha.
        </Text>

        <TextInput
          keyboardType="email-address"
          autoCompleteType="email"
          style={style.input}
          placeholder="Email"
          placeholderTextColor='rgba(255, 0, 0, 0.3)'
          onChangeText={text => setEmail(text)}
          value={email}
        />
        {erroEmail && <Text style={style.erro}>{erroEmail}</Text>}
      </View>

      <TouchableOpacity style={style.button} onPress={enviarEmail}>
        <Text style={{ color: 'white', fontSize: 15 }}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
	title:{
		fontSize:20,
		color: '#ff0000',
		marginBottom: 30
	},
	container:{
		flex:1,
		alignItems:"center",
		justifyContent:'center',
		padding: 50
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
		marginTop:50,
		paddingVertical:10,
		paddingHorizontal:30,
		backgroundColor:"blue",
		borderRadius:100
	},
	erro: {
    color: 'red',
    marginTop: 5,
  }, 
})