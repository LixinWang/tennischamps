import React, { Component } from "react";
import { Font } from 'expo';
import { Alert, StyleSheet, View, Image, TouchableOpacity, Easing, PanResponder, Animated } from 'react-native';
import { Container, Content, Left, Right, Text, ListItem, Radio } from 'native-base';

import Button from '../Components/Button';
import NavBarWithBurger from '../Components/NavBarWithBurger';
import Hidden from '../Components/Hidden';

export default class GameMode extends Component {
  translateX = new Animated.Value(-173);
  translateY = new Animated.Value(100);

  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gs) => true,
     onPanResponderMove: (evt, gs) => {
      this.translateX.setValue(gs.dx-173);
      this.translateY.setValue(gs.dy+100);
      console.log(gs.dx);
      console.log("--");
      console.log(gs.dy);

     },
     onPanResponderRelease: (evt, gs) => {
         // The user has released all touches while this view is the
         // responder. This typically means a gesture has succeeded
        console.log("released");
     }
   });

  static navigationOptions = {
    drawerLabel: <Hidden />,
  };

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  _onPressButton() {
    Alert.alert('You win!')
  }

  getAccuracy(shotCoordinate, shotTarget) {
    let [xCoord, yCoord] = shotCoordinate
    let [xCoordTar, yCoordTar] = shotTarget
    distance = (((xCoord - xCoordTar)**2) + ((yCoord - yCoordTar)**2))**0.5
    if (distance < 5) {
      return "veryclose"
    }
    if (distance > 5 && distance <= 15) {
      return "close"
    }
    if (distance > 15 && distance <= 25) {
      return "average"
    }
    if (distance > 25) {
      return "far"
    }

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

    const onPress = () => {
      Animated.timing(translateY, {
        toValue:300,
        duration:2000,
        easing: Easing.bezier(0.4, 0,0.2,1),
      }).start();

    };

    return (
      <Container style={styles.container}>
        <NavBarWithBurger
          title='GAME'
          onPressBack={() => navigation.goBack("Home")}/>

        <View contentContainerStyle={styles.content}>
        <Text style={styles.text}>SCORE: 0-0</Text>
          <Image style={styles.court}
            source={require('../assets/images/tenniscourt.png')}
          />

          <Animated.Image
            {...this.imagePanResponder.panHandlers}
            style = {[{left: this.translateX, top: this.translateY}, styles.ball]}
            source={require('../assets/images/tennisball.png')}
          />

          <Image style={styles.person}
            source={require('../assets/images/person.png')}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A5D38',
  },
  content: {
    height: '100%',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    zIndex: 3,
    left: 60,
    bottom: 20
  },
  text: {
    fontFamily: 'bungee-inline',
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center'
  },
  court: {
    height: 525,
    width: 400,
    alignSelf: 'center',
    resizeMode: 'contain',
    zIndex: 0,
  },
  ball: {
    resizeMode: 'contain',
    zIndex: 2,
    position: 'absolute',
    alignSelf: 'center',
    height: 16
  },
  person: {
    resizeMode: 'contain',
    zIndex: 1,
    position: 'absolute',
    alignSelf: 'center',
    height: 50,
    top: 52,
    right: -50
  }
});
