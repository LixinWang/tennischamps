import React, { Component } from "react";
import { Font } from 'expo';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { Container, Content, Left, Right, Text, ListItem, Radio } from 'native-base';

import Button from '../Components/Button';
import Navbar from '../Components/Navbar';
import Hidden from '../Components/Hidden';

export default class TrainingTutorial3 extends Component {
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

        <View>
          <Image style={styles.court}
            source={require('../assets/images/TrainingTut3.png')}/>

          <Button style={styles.button}
           label='Next'
           onPress={() => this.props.navigation.navigate("Training")}/>

        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A5D38',
  },
  button: {
    backgroundColor: '#ffffff',
    position: 'absolute',
    zIndex: 3,
    bottom: 40,
    left: 60
  },
  court: {
    height: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
    zIndex: 0,
  },
});
