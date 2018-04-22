import React, { Component } from "react";
import { StyleSheet, TextInput, View } from 'react-native';
import { Container, Left, Right, Text, ListItem, Radio } from 'native-base';
import * as firebase from 'firebase';

import Button from '../Components/Button';
import NavBarNoBurger from '../Components/NavBarNoBurger';
import Hidden from '../Components/Hidden';

export default class Registration extends Component {
  static navigationOptions = {
    drawerLabel: <Hidden />,
    drawerLockMode: 'locked-closed',
  };

  constructor(props) {
    super(props);
    this.itemsRef = firebaseApp.database().ref('users2');
    this.state = {
      email: '',
      password: '',
      repeatpass: '',
      righty: true,
      lefty: false,
      fontLoaded: false
    };
  }

  handleClick = () => {
    const { navigation } = this.props;
    const {email, password, repeatpass, righty, lefty} = this.state;

    if (email == '' || password == '') {
      alert("Please enter missing information.");
    } else if (password != repeatpass){
      alert("Repeated password does not match.");
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password).then((t) => {
        let uid = firebase.auth().currentUser.uid;

        this.itemsRef.child(uid).set({
          righty: righty,
          lefty: lefty,
          difficulty: 0,
          email: email,
        });

        navigation.navigate("Welcome");
      }).catch((error) => {
        alert("registration failed?");
        alert(error.code);
      });
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

  toggleRighty() {
    this.setState({
      righty: true,
      lefty: false
    });
  }

  toggleLefty() {
    this.setState({
      righty: false,
      lefty: true
    });
  }


  render() {
    const { navigation } = this.props;

    if (!this.state.fontLoaded) { return null;}

    return (
      <Container style={styles.container}>
        <NavBarNoBurger
          title='CREATE AN ACCOUNT'
          onPressBack={() => navigation.goBack(null)}/>
        <Container style={styles.content}>
          <TextInput style={styles.inputField}
            placeholder='Email'
            keyboardType='email-address'
            onChangeText={(email) => this.setState({email})}/>

          <TextInput style={styles.inputField}
            secureTextEntry={true}
            placeholder='Password'
            onChangeText={(password) => this.setState({password})}/>

          <TextInput style={styles.inputField}
            secureTextEntry={true}
            placeholder='Re-Type Password'
            onChangeText={(repeatpass) => this.setState({repeatpass})}/>

          <View style={styles.toggles}>
          <Text style={styles.text}>Hand Dominance:</Text>
          <ListItem
            style={styles.toggleitem}
            selected={this.state.righty}
            onPress={() => this.toggleRighty()}
          >
            <Left>
              <Text>Righty</Text>
            </Left>
            <Right>
              <Radio
                selected={this.state.righty}
                onPress={() => this.toggleRighty()}
              />
            </Right>
          </ListItem>
          <ListItem
            style={styles.toggleitem}
            selected={this.state.lefty}
            onPress={() => this.toggleLefty()}
          >
            <Left>
              <Text>Lefty</Text>
            </Left>
            <Right>
              <Radio
                selected={this.state.lefty}
                onPress={() => this.toggleLefty()}
              />
            </Right>
          </ListItem>
          </View>

          <Button style={styles.button}
           label='Register'
           onPress={(e) => this.handleClick(e)}
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
  button: {
    backgroundColor: '#ffffff',
    margin: 18
  },
  inputField: {
    height: 40,
    width: 250,
    margin: 6,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    color: '#000000',
    paddingHorizontal: 6
  },
  text: {
    marginVertical: 12,
    marginHorizontal: 6
  },
  toggles: {
    backgroundColor: '#ffffff',
    margin: 6,
    width: 250
  },
  toggleitem: {
    width: '90%',
    margin: 6,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff'
  }
});
