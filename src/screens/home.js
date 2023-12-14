import React, { useEffect, useState } from "react";
import {useNavigation} from '@react-navigation/native'
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const route = useRoute();
  const userId = route.params?.userId ?? '';
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [loading, setLoading] = useState(true);
  const userNameFromParams = route.params?.userName ?? '';
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Buscando dados do usuário...');

        // Se userName já estiver disponível nos parâmetros, use-o
        if (userNameFromParams) {
          setNomeUsuario(userNameFromParams);
					console.log('Cadastro feito com sucesso...');
        } else {
          // Senão, busque os dados do usuário na API
          const token = await AsyncStorage.getItem('access_token');

          if (token) {
            const response = await axios.get('http://192.168.1.3:3000/me', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            // Atualiza o estado com o nome do usuário
            setNomeUsuario(response.data.name);
						console.log('Login feito com sucesso...');
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error.message);
        setNomeUsuario('');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userNameFromParams]); // Adicionado userNameFromParams como dependência para reexecutar o efeito se houver mudança nele

  return (
    <View style={style.container}>
      {loading ? (
        <Text style={style.texto}>Carregando...</Text>
      ) : (
        <Text style={style.texto}>Usuário: {nomeUsuario}</Text>
      )}
      	<TouchableOpacity style={style.button} onPress={() => navigation.replace('Login')}>
					<Text style={{color:'white', fontSize:15}}>Sair</Text>
				</TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  texto: {
    fontSize: 24,
    color: '#FF3355'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
		marginTop:50,
		paddingVertical:10,
		paddingHorizontal:30,
		backgroundColor:"blue",
		borderRadius:100
	},
});
