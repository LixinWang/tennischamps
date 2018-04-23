import React, { Component } from "react";
import { StyleSheet, TextInput, View } from 'react-native';
import { Container, Left, Right, Text, ListItem, Radio } from 'native-base';
import * as firebase from 'firebase';
import Button from '../Components/Button';
import NavBarWithBurger from '../Components/NavBarWithBurger';
import { Switch } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

export default class Preferences extends Component {

  constructor(props) {
    super(props);
    const {state} = this.props.navigation;
    console.log(state.params);
    window.currUser = firebase.auth().currentUser.uid;
    this.itemsRef = firebaseApp.database().ref();
    this.state = {
      fontLoaded: false,
      handedness: state.params.handedness,
      difficultyTypes: state.params.difficultyTypes
    }

    console.log("DIFFFFF", this.state.difficultyTypes);
  }

  handleDifficulty = (value) => {
      var updates = {};
      let key = firebase.auth().currentUser.uid;
      console.log("diff", value);
      console.log(key);
      console.log('/users2/' + key + '/difficulty');
      updates['/users2/' + key + '/difficulty'] = value;
      console.log(updates);
      this.setState({difficultyTypes: value});
      return this.itemsRef.update(updates);
      // key will be "ada" the first time and "alan" the second time
  }
  // handleSound = (value) => {
  //     var updates = {};
  //     console.log("diff", value);
  //     console.log(this.state.key);
  //     updates['/users/' + this.state.key + '/sound'] = value;
  //     console.log(updates);
  //     this.setState({sound: value})
  //     return this.itemsRef.update(updates);
  //     // key will be "ada" the first time and "alan" the second time
  // }
 handleHandedness = (value) => {
      var updates = {};
      let key = firebase.auth().currentUser.uid;
      console.log("diff", value);
      console.log(key);
      if (value == 0) {
        updates['/users2/' + key + '/righty'] = true;
        updates['/users2/' + key + '/lefty'] = false;
        this.setState({handedness: 0})
        return this.itemsRef.update(updates);
      } else {
        updates['/users2/' + key + '/righty'] = false;
        updates['/users2/' + key + '/lefty'] = true;
        this.setState({handedness: 1})
        return this.itemsRef.update(updates);
      }
      // console.log('/users2/' + this.state.key + '/h');
      console.log(updates);
      // key will be "ada" the first time and "alan" the second time
  }
  getDiff = async() => {
    return new Promise((resolve, reject) => {
      firebaseApp.database().ref('/users2/' + currUser).once('value').then(function(snapshot) {
        return snapshot.val().difficulty;
      }),
      function(err, tick) {
        if (err) {
          reject("it broke");
        } else {
          resolve("it worked");
        }
      }

    });
  }
componentWillMount = async() => {
  /* var difficulty = false;
   let promise = new Promise((resolve, reject) => {
      firebaseApp.database().ref('/users2/' + currUser).once('value').then(function(snapshot) {
        difficulty = snapshot.val().difficulty;
        console.log(difficulty);
      });
     setTimeout(function(){
        resolve(difficulty); // Yay! Everything went well!
      }, 250);
    });
    console.log(promise);
    promise.then((result) => {
      console.log("res", result);*/
    //this.setState({difficultyTypes: result});
    const {state} = this.props.navigation;
    this.setState({handedness: state.params.handedness});
    console.log(this.state.handedness);
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
    const radio_props = [{label: 'Easy ', value: 0 }, {label: 'Medium ', value: 1 }, {label: 'Hard ', value: 2 }];
    const dominance_props = [{label: 'Right-Handed ', value: 0 }, {label: 'Left-Handed ', value: 1 }];
    console.log("true");
    console.log("false");
    global.difficulty = this.state.difficultyTypes;
    console.log("global preferences:" + global.difficulty);

    return (
      <Container style={styles.container}>
        <NavBarWithBurger
          title='PREFERENCES'
          onPressBack={() => navigation.navigate("Home", {difficulty: this.state.difficultyTypes, handedness: this.state.handedness})}
          handleHamburger={() => navigation.navigate('DrawerOpen')}/>
        <Container style={styles.content}>

        <View style={styles.contentButtons}>
          <Text style={styles.text}>DIFFICULTY: </Text>
          <RadioForm
            style={styles.radio}
            radio_props={radio_props}
            initial={this.state.difficultyTypes}
            formHorizontal={false}
            labelHorizontal={true}
            labelStyle={{fontFamily: 'bungee-inline', fontSize: 18, color: '#ffffff'}}
            buttonColor={'#ffffff'}
            buttonSize= {18}
            onPress={(value) => {this.handleDifficulty(value)}}
          />
        </View>

        <View style={styles.contentButtons}>
          <Text style={styles.text}>HAND DOMINANCE:</Text>
          <RadioForm
            style={styles.radio}
            radio_props={dominance_props}
            initial={this.state.handedness}
            formHorizontal={false}
            labelHorizontal={true}
            labelStyle={{fontFamily: 'bungee-inline', fontSize: 18, color: '#ffffff'}}
            buttonColor={'#ffffff'}
            buttonSize= {18}
            onPress={(value) => {this.handleHandedness(value)}}
          />
        </View>

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
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  contentButtons: {
    marginBottom: 18,
    width: 250,
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
    color: '#ffffff',
    fontFamily: 'bungee-inline',
    marginTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  radioActive: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
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
  },
  radio: {
    marginVertical: 12
  }
});
