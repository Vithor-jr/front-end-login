import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';

export default function ResetPassword() {
	const route = useRoute();
  const navigation = useNavigation();
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const validarRedefinicao = () => {
    if (!codigo.trim()) {
      console.error('Por favor, insira o código recebido por email.');
      return false;
    }

    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      console.error('Por favor, preencha todos os campos de senha.');
      return false;
    }

    if (novaSenha !== confirmarSenha) {
      console.error('As senhas não coincidem.');
      return false;
    }

    return true;
  };

  const redefinirSenha = async () => {
		// Alteração aqui: Obtendo o email dos parâmetros da navegação
		const emailFromParams = route.params?.email || ''; // Defina um valor padrão apropriado
	
		if (validarRedefinicao()) {
			try {
				const response = await axios.post('http://192.168.1.3:3000/reset-password', {
					email: emailFromParams,
					code: codigo,
					newPassword: novaSenha,
				});
	
				if (response.status === 200) {
					navigation.navigate('Login');
				} else {
					console.error('Erro ao redefinir a senha:', response.status);
				}
			} catch (error) {
				console.error('Erro ao redefinir a senha:', error.message);
			}
		}
	};

  return (
    <View style={style.container}>
      <Text style={style.title}>Redefinir Senha</Text>

      <View style={{ width: '100%', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center' }}>
          Por favor, insira no campo abaixo o código de ativação que você recebeu por e-mail e redefina sua senha.
        </Text>

        <TextInput
          style={style.input}
          placeholder="Código"
          placeholderTextColor='rgba(255, 0, 0, 0.3)'
          onChangeText={text => setCodigo(text)}
        />

        <TextInput
          style={style.input}
          placeholder="Nova Senha"
          placeholderTextColor='rgba(255, 0, 0, 0.3)'
          onChangeText={text => setNovaSenha(text)}
        />

        <TextInput
          style={style.input}
          placeholder="Repita a Nova Senha"
          placeholderTextColor='rgba(255, 0, 0, 0.3)'
          onChangeText={text => setConfirmarSenha(text)}
        />
      </View>

      <TouchableOpacity style={style.button} onPress={redefinirSenha}>
        <Text style={{ color: 'white', fontSize: 15 }}>Redefinir Senha</Text>
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
})