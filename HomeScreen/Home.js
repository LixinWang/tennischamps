import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Picker } from 'react-native';
import { Container } from 'native-base';
import { Font } from 'expo';
import firebase from 'firebase';

import Button from '../Components/Button';
import NavBarNoBurger from '../Components/NavBarNoBurger';

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    const {state} = this.props.navigation;
    window.currUser = state.params.key;
    this.state = {
      fontLoaded: false,
      sound: state.params.sound,
      difficulty: state.params.difficulty,
      handedness: state.params.handedness,
      key: state.params.key
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'bungee-inline': require('../assets/fonts/BungeeInline-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      'bungee-inline': require('../assets/fonts/BungeeInline-Regular.ttf'),
      'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
      'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    if (!this.state.fontLoaded) { return null;}

    return (
      <Container>
        <NavBarNoBurger
          title='HOME'
          onPressBack={() => this.props.navigation.goBack(null, {key: this.state.key})}
        />

        <Container style={styles.content}>
          <Button style={styles.button}
           label='PLAY'
           onPress={() => this.props.navigation.navigate("Mode", {key: this.state.key})}/>

         <Button style={styles.button}
          label='HOW TO PLAY'
          onPress={() => this.props.navigation.navigate("Instructions")}/>

          <Button style={styles.button}
          label='PREFERENCES'
          onPress={() => this.props.navigation.navigate("Preferences", {sound: this.state.sound, difficultyTypes: this.state.difficulty, handedness: this.state.handedness})}/>

          <Button style={styles.button}
          label='MY STATS'
          onPress={() => this.props.navigation.navigate("Stats", {sound: this.state.sound, difficulty: this.state.difficulty, handedness: this.state.handedness})}/>

          <Button style={styles.button}
          label='LOG OUT'
          onPress={() => {
            firebase.auth().signOut().then(() => this.props.navigation.navigate("Welcome"))
          }}/>
        </Container>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A5D38'
  },
  content: {
    flex: 1,
    backgroundColor: '#2A5D38',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#ffffff',
    margin: 18,
  }
});
