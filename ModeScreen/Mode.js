import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Picker } from 'react-native';
import { Container, Content } from 'native-base';
import { Font } from 'expo';

import { Dropdown } from 'react-native-material-dropdown';


import Button from '../Components/Button';
import SpecialButton from '../Components/SpecialButton';
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
      value: '1'
    };
    data = [{value: 1}, {value: 2}, {value: 3}, {value: 4},
      {value: 5}, {value: 6}, {value: 7}, {value: 8},
      {value: 9}, {value: 10}, {value: 11}, {value: 12}, 
      {value: 13}, {value: 14}, {value: 15}, {value: 16}, 
      {value: 17}, {value: 18}, {value: 19}, {value: 20}];
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

        <Text style={styles.headertext}>Choose how many balls to hit:</Text>

        <Content contentContainerStyle={styles.content}>
   
          <Dropdown style = {styles.dropdown}
            label= {this.state.value}
            data={data}
            baseColor = '#ffffff'
            itemCount = '8' 
            labelFontSize = '20'
            value = {this.state.value}
            onChangeText = {(value) => this.setState({value})} />    

          <Button style={styles.button}
           label='Play'
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
  },
  dropdown: {
    backgroundColor: '#ffffff',
    margin: 35,
    marginTop: 50
  },
  picker: {
    backgroundColor: '#ffffff',
    margin: 35,
    marginTop: 50
  }
});
