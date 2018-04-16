import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Picker } from 'react-native';
import { Container, Content } from 'native-base';
import { Font } from 'expo';

import Button from '../Components/Button';
import SpecialButton from '../Components/SpecialButton'
import Navbar from '../Components/Navbar';
import Hidden from '../Components/Hidden';

export default class Mode extends React.Component {
  static navigationOptions = {
    drawerLabel: <Hidden />,
  };

  constructor(props) {
    super(props);
    const {state} = this.props.navigation;
    this.state = {
      fontLoaded: false,
      key: state.params.key,
      selected: '1',
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

    var data = ['1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', 
        '11', '12', '13', '14', '15', '16',
        '17', '18', '19', '20'];

    if (!this.state.fontLoaded) { return null;}

    return (
      <Container style={styles.container}>
      
        <Navbar
          title='Mode'
          onPressBack={() => navigation.navigate("Home")}
          handleHamburger={() => navigation.navigate('DrawerOpen')}/>

        <Text style={styles.headertext}>Choose your mode:</Text>

        <Content contentContainerStyle={styles.content}>

          <Picker
            selectedValue={this.state.selected}
            mode = 'dropdown'
            style={{ height: 50, width: 100 }}
            onValueChange={(itemValue, itemIndex) => this.setState({selected: itemValue})}>
            {data.map((item, index) => {
                return (<Picker.Item label={item} value={index} key={index}/>) 
            })}
          </Picker>


          <SpecialButton style={styles.button}
            label='Next'
            onPress={() => this.props.navigation.navigate("TrainingTutorial1", {key: this.state.key})}/>


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
    justifyContent: 'flex-start'
  },
  button: {
    backgroundColor: '#ffffff',
    margin: 18,
    marginTop: 250
  },
  text: {
    justifyContent: 'center',
    color: 'white'
  },
  headertext: {
    fontFamily: 'bungee-inline',
    fontWeight: 'bold',
    fontSize: 24,
    color: "white",
    marginTop: 60,
    textAlign: 'center'
  }
});
