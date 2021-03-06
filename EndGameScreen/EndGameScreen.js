import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Container } from 'native-base';
import { Font } from 'expo';

import Button from '../Components/Button';
import NavBarWithBurger from '../Components/NavBarWithBurger';
import Hidden from '../Components/Hidden';


export default class Instructions extends React.Component {
  static navigationOptions = {
    drawerLabel: <Hidden />,
  };

  constructor(props) {
    super(props);
    const {state} = this.props.navigation;
    this.state = {
      fontLoaded: false,
      key: state.params.key,
      targetsHit: state.params.targetsHit,
      totalBalls: state.params.totalBalls
    };
  }
  getMath = () => {
    return ((this.state.targetsHit/this.state.totalBalls) * 100).toFixed(2) + "%"
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
    const { navigation } = this.props;
    if (!this.state.fontLoaded) { return null;}
    return (
      <Container style={styles.container}>
        <NavBarWithBurger
          title='TRAINING'
          onPressBack={() => navigation.navigate("Home", {selected: this.state.selected})}
          handleHamburger={() => navigation.navigate('DrawerOpen')}/>
        <Container style={styles.content}>
          <Text style={styles.firsttext}>Training</Text>
          <Text style={styles.firsttext}>Session</Text>
          <Text style={styles.firsttext}>Complete</Text>

          <Text style={styles.text}>NICE WORK, TENNIS CHAMP!</Text>

          <Text style={styles.texta}>TARGETS HIT:</Text>

          <Text style={styles.textb}> {this.state.targetsHit} out of {this.state.totalBalls} </Text>

          <Text style={styles.textc}> Your ACCURACY:</Text>

          <Text style={styles.textd}> {this.getMath()}</Text>

          <Button style={styles.button}
           label='Train Again'
           onPress={() => this.props.navigation.navigate("Mode", {key: this.state.key})}
          />
          <Button style={styles.button}
           label='End Training'
           onPress={() => this.props.navigation.navigate("Home", {key: this.state.key})}
          />
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: '#ffffff',
    fontFamily: 'bungee-inline',
    marginTop: 30,
    fontSize: 22
  },
  texta: {
    color: '#ffffff',
    fontFamily: 'bungee-inline',
    marginTop: 30,
    fontSize: 22
  },
  textb: {
    color: '#ffffff',
    fontFamily: 'bungee-inline',
    fontSize: 22
  },
  textc: {
    color: '#ffffff',
    fontFamily: 'bungee-inline',
    marginTop: 30,
    fontSize: 22
  },
  textd: {
    color: '#ffffff',
    fontFamily: 'bungee-inline',
    fontSize: 50
  },
  firsttext: {
    color: '#ffffff',
    margin: 3,
    fontFamily: 'bungee-inline',
    marginTop: 5,
    fontSize: 28
  },
    button: {
    backgroundColor: '#ffffff',
    marginTop: 20

  }
});
