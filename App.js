import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RecoverScreen from "./screens/RecoverScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";

import * as firebase from 'firebase';


var firebaseConfig = {
  apiKey: "AIzaSyB9W8ZTLtOnGcXkVEPLWlpwxr6ZcHBpn5Y",
  authDomain: "useitweb-4ac23.firebaseapp.com",
  databaseURL: "https://useitweb-4ac23.firebaseio.com",
  projectId: "useitweb-4ac23",
  storageBucket: "",
  messagingSenderId: "500966015618",
  appId: ""
};

firebase.initializeApp(firebaseConfig);

const AppStack = createStackNavigator({
  Home: HomeScreen
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
  Recover: RecoverScreen
});

export default createAppContainer(
    createSwitchNavigator(
        {
          Loading: LoadingScreen,
          App: AppStack,
          Auth: AuthStack
        },
        {
          initialRouteName: "Loading"
        }
    )
);
