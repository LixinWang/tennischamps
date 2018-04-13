import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Container, Content } from 'native-base';
import { Font } from 'expo';

import Button from '../Components/Button';
import Navbar from '../Components/Navbar';
import Hidden from '../Components/Hidden';


export default class Instructions extends React.Component {
  static navigationOptions = {
    drawerLabel: <Hidden />,
  };

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
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
    const { navigation } = this.props;
    if (!this.state.fontLoaded) { return null;}
    return (
      <Container style={styles.container}>
        <Content contentContainerStyle={styles.content}>
          <Text style={styles.firsttext}>Training</Text>
          <Text style={styles.firsttext}>Session</Text>
          <Text style={styles.firsttext}>Complete</Text>

          <Text style={styles.text}>NICE WORK, TENNIS CHAMP!</Text>

          <Text style={styles.texta}>TARGETS HIT:</Text>

          <Text style={styles.textb}> 8 out of 10</Text>

          <Text style={styles.textc}> Your ACCURACY:</Text>

          <Text style={styles.textd}> 84%</Text>

          <Button style={styles.button}
           label='Train Again'
           onPress={() => this.props.navigation.navigate("Training")}
          />
          <Button style={styles.button}
           label='End Training'
           onPress={() => this.props.navigation.navigate("Mode")}
          />
        </Content>
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
    marginTop: 20,
    fontSize: 28

  }
});
