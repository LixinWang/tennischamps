import React, { Component } from "react";
import firebase from 'firebase';
import { Font } from 'expo';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Container, Content, Left, Right, Text, ListItem, Radio } from 'native-base';

import Button from '../Components/Button';
import Navbar from '../Components/Navbar';
import Hidden from '../Components/Hidden';

export default class LogIn extends Component {
  static navigationOptions = {
      drawerLabel: <Hidden />,
      drawerLockMode: 'locked-closed',
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      fontLoaded: false
    };
  }

  handleClickForgot = () => {
    const { username } = this.state;
    firebase.auth().sendPasswordResetEmail(username)
      .then(() => { alert("If your email is valid, a reset link has been sent!")})
      .catch(() => { alert("If your email is valid, a reset link has been sent!") });
  }

  handleClick = () => {
    const { username, password } = this.state;
    const { navigation } = this.props;

    if (username == '' || password == '') {
      alert("Please enter username and password.");
    } else {
      firebase.auth().signInWithEmailAndPassword(username, password)
        .then(() => 
        { 
          // Ok, we've successfully signed in!
          // Let's fetch the user's info from the DB.
          
          var key = firebase.auth().currentUser.uid;
          console.log(key);

          firebaseApp.database().ref('/users2/' + key).once("value")
            .then(snapshot => {
              var difficulty = snapshot.val() && snapshot.val().difficulty;
              var sound = snapshot.val() && snapshot.val().sound;
              var handedness = snapshot.val() && snapshot.val().righty;
              if (handedness == false) {
                handedness = 1;
              } else {
                handedness = 0;
              }
              console.log(handedness);
              navigation.navigate("Home", {key: key, difficulty: difficulty, sound: sound, handedness: handedness});
            })
      }).catch(() => { alert("Invalid username or password."); });;
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

    return (
      <Container style={styles.container}>
        <Navbar
          title='LOG IN'
          onPressBack={() => navigation.goBack(null)}
          handleHamburger={() => navigation.navigate('DrawerOpen')}/>

        <Content contentContainerStyle={styles.content}>
          <View style={styles.loginFields}>
            <TextInput
              style={styles.inputField}
              placeholder='Email'
              keyboardType='email-address'
              onChangeText={(username) => this.setState({username})}/>

            <TextInput
              secureTextEntry={true}
              style={styles.inputField}
              placeholder='Password'
              onChangeText={(password) => this.setState({password})}/>

            <TouchableOpacity
              style={styles.textLink}
               onPress={() => this.handleClickForgot()}
             >
             <Text style={styles.text}> Forgot your password? </Text>
            </TouchableOpacity>
          </View>


        <Button style={styles.button}
         label='Log In'
         onPress={(e) => this.handleClick(e)}/>
          <TouchableOpacity
            style={styles.textLink}
             onPress={() => navigation.navigate("Registration")}
           >
           <Text style={styles.text}> Don&#8217;t have an account? </Text>
          </TouchableOpacity>

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
    marginTop: 18
  },
  inputField: {
    height: 40,
    width: 250,
    marginTop: 6,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    color: '#000000',
    paddingHorizontal: 6
  },
  loginFields: {
    marginTop: '30%',
    marginBottom: '10%'
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  textLink: {
    width: 250,
    margin: 6
  }
});
