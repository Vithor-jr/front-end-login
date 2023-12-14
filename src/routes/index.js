import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Create from '../screens/create';
import Login from '../screens/login';
import Home from '../screens/home'
import Email from '../screens/reset-password/email';
import ResetPassword from '../screens/reset-password/reset-password';

const Stack = createNativeStackNavigator();

export default function Routes(){
	return(
		<Stack.Navigator>
			<Stack.Screen
				name="Login"
				component={Login}
				options={{headerShown: false}}
			/>
			
			<Stack.Screen
				name="Create"
				component={Create}
				options={{headerShown: false}}
			/>
			
			<Stack.Screen
				name="Home"
				component={Home}
				options={{headerShown: false}}
			/>

			<Stack.Screen
				name="Email"
				component={Email}
				options={{headerShown: false}}
			/>

			<Stack.Screen
				name="ResetPassword"
				component={ResetPassword}
				options={{headerShown: false}}
			/>
		</Stack.Navigator>
	);
}