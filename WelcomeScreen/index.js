import React, { Component } from "react";
import { DrawerNavigator } from "react-navigation";

import { View, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import Welcome from "./Welcome.js";
import LogIn from "../LogInScreen/LogIn.js";
import Registration from "../RegistrationScreen/Registration.js";
import Home from "../HomeScreen/Home.js";
import Instructions from "../InstructionsScreen/Instructions.js";
import Instructions1 from "../InstructionsScreen/Instructions1.js";
import Instructions2 from "../InstructionsScreen/Instructions2.js";
import Instructions3 from "../InstructionsScreen/Instructions3.js";
import Instructions4 from "../InstructionsScreen/Instructions4.js";
import Preferences from "../PreferenceScreen/Preferences.js";
import Mode from "../ModeScreen/Mode.js";
import Training from "../TrainingMode/TrainingMode.js";
import TrainingTutorial1 from "../TrainingMode/TrainingTutorial1.js";
import TrainingTutorial2 from "../TrainingMode/TrainingTutorial2.js";
import TrainingTutorial3 from "../TrainingMode/TrainingTutorial3.js";
import TrainingTutorial4 from "../TrainingMode/TrainingTutorial4.js";
import Game from "../GameMode/GameMode.js";
import Stats from "../StatsScreen/Stats.js";
import EndGameScreen from "../EndGameScreen/EndGameScreen.js";

const RootStack = DrawerNavigator(
  {
    Welcome: { screen: Welcome },
    LogIn: { screen: LogIn },
    Registration: { screen: Registration },
    Home: { screen: Home },
    Instructions: { screen: Instructions },
    Instructions1: {screen: Instructions1 },
    Instructions2: {screen: Instructions2 },
    Instructions3: {screen: Instructions3 },
    Instructions4: {screen: Instructions4 },
    Preferences: { screen: Preferences },
    Mode: { screen: Mode },
    Training: { screen: Training },
    TrainingTutorial1: {screen: TrainingTutorial1 },
    TrainingTutorial2: {screen: TrainingTutorial2 },
    TrainingTutorial3: {screen: TrainingTutorial3 },
    TrainingTutorial4: {screen: TrainingTutorial4 },
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
