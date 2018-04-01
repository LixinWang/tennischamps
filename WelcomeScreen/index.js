import React, { Component } from "react";
import { DrawerNavigator } from "react-navigation";

<<<<<<< HEAD
import Welcome from "./WelcomeScreen.js";
import LogIn from "../LogInScreen/LogIn.js";
import Registration from "../RegistrationScreen/Registration.js"

import homepage from "../Home/homepage.js"
=======
import { View, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import Welcome from "./Welcome.js";
import LogIn from "../LogInScreen/LogIn.js";
import Registration from "../RegistrationScreen/Registration.js";
import Home from "../HomeScreen/Home.js";
import Instructions from "../InstructionsScreen/Instructions.js";
import Preferences from "../PreferenceScreen/Preferences.js";
import Mode from "../ModeScreen/Mode.js";
import Training from "../TrainingMode/TrainingMode.js";
import Game from "../GameMode/GameMode.js";
import Stats from "../StatsScreen/Stats.js";
import EndGameScreen from "../EndGameScreen/EndGameScreen.js";
>>>>>>> master

const RootStack = DrawerNavigator(
  {
    Welcome: { screen: Welcome },
    LogIn: { screen: LogIn },

    Registration: { screen: Registration },
    Home: { screen: Home },
    Instructions: { screen: Instructions },
    Preferences: { screen: Preferences },
    Mode: { screen: Mode },
    Training: { screen: Training },
    Game: { screen: Game },
    Stats: {screen: Stats},
    EndGameScreen: {screen: EndGameScreen}
  },
  {
    drawerPosition: "right",
    drawerWidth: 200,
    /*contentOptions:
    {

      items: ["Home", "Preferences"],
    },*/
    
  }
);

export default RootStack;
