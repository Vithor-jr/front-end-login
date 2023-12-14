import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';

export default function App() {
  return (
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#ff0000" // Cor de fundo da StatusBar
          translucent={false} // Define se a StatusBar é translúcida
       />
        <Routes/>
      </NavigationContainer>
    );
  }
