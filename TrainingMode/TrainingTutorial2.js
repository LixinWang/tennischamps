import React, { Component } from "react";
import { Font } from 'expo';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { Container, Content, Left, Right, Text, ListItem, Radio } from 'native-base';

import Button from '../Components/Button';
import Navbar from '../Components/Navbar';
import Hidden from '../Components/Hidden';

export default class TrainingTutorial2 extends Component {
  static navigationOptions = {
    drawerLabel: <Hidden />,
  };

  constructor(props) {
    super(props);
    const {state} = this.props.navigation;
    this.state = {
      fontLoaded: false,
      key: state.params.key,
      selected: state.params.selected
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
        <Image style={styles.court}
          source={require('../assets/images/Tutorial2.png')}/>
        <Button style={styles.button}
         label='Next'
         onPress={() => this.props.navigation.navigate("TrainingTutorial3", {selected: this.state.selected})}/>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A5D38',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    zIndex: 3,
    bottom: '10%'
  },
  court: {
    width: '100%',
    alignSelf: 'center',
    zIndex: 0,
    top: 18
  },
});
