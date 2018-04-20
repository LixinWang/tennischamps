import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Container, Content } from 'native-base';
import { Font } from 'expo';
import * as firebase from 'firebase';
import Button from '../Components/Button';
import Navbar from '../Components/Navbar';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


export default class Stats extends React.Component {
  static navigationOptions = {
    title: 'Statistics',
  };

  constructor(props) {
    super(props);
    this.itemsRef = firebaseApp.database().ref('users');
    const {state} = this.props.navigation;
    window.currUser = firebase.auth().currentUser.uid;
    this.state = {
      fontLoaded: false,
      sound: state.params.sound,
      key: state.params.key,
      handedness: state.params.handedness,
      difficultyTypes: state.params.difficulty,

      tableDataHand: [
        ['1', '', '2', '', '3'], ['4', '', '5', '', '6']],
      tableDataHand2: ['7', '8', '9', '10', '11', '12'],
      tableDataHand3: ['13', '', '14', '', '15']
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

  setOurState = (finalArray) => {
      console.log('final' + finalArray);
      this.setState({tableDataHand: finalArray});
  }
  getStats = (value) => {
      if (value == 0) {
        hand = 'forehand'
        this.forehandBackhandDisplay(hand);
      }
      else if (value == 1) {
        hand = "backhand"
        this.forehandBackhandDisplay(hand);
      } else {
        hand = "serve"
        this.serveDisplay(hand);
      }
    }
    forehandBackhandDisplay = (hand) => {
      var promise = new Promise((resolve, reject) => {
        arr = []
        firebaseApp.database().ref('/users2/' + currUser + "/stats/" + hand).once("value").then(snapshot => {
        snapshot.forEach(function(childSnapshot) {
          var hits = childSnapshot.val() && childSnapshot.val().hits;
          var shots = childSnapshot.val() && childSnapshot.val().shots;
          console.log("hi" + hits/shots);
          arr.push(Math.ceil((hits/shots) * 100));
          console.log(arr);
          });
         if (arr.length > 0) {
          resolve(arr);
        }
          else {
          console.log("arr" + arr.length);
          reject(Error("It broke"));
        }
        });
      });
      promise.then((arr) => {
      return new Promise((resolve, reject) => {
      tempArr = []
      finalArr = []
      arrCounter = 0
      for (var x = 0; x < 11; x++) {
          if (x == 1 || x == 3 || x == 6 || x==8) {
            tempArr.push(" ");
          } else if (x == 0 || x == 2 || x == 4|| x == 7 || x == 9){
            tempArr.push(arr[arrCounter] + "%");
            arrCounter++;
          } else {
            finalArr.push(tempArr)
            tempArr = []
            if (x == 5) {
              tempArr.push(arr[arrCounter] + "%");
              arrCounter++;
            }
          }
      }
        console.log("final" + x + finalArr);
      tempArr = []
      finalArr2 = []
      for (var x = 0; x < 6; x++) {
          if (x == 1 || x == 3) {
            tempArr.push(" ");
          } else if (x == 0 || x == 2 || x ==4){
            tempArr.push(arr[arrCounter] + "%");
            arrCounter++;
          }
         else {
          finalArr2.push(tempArr)
          tempArr = []
        }
        console.log("final" + x + finalArr);
        if (x == 5) {
          resolve([finalArr, finalArr2]);
        }
      }
      reject(Error("it broke again"))
    })
      }).then((finalArray) => {
          this.setState({tableDataHand: finalArray[0]});
          this.setState({tableDataHand3: finalArray[1][0]});
          this.setState({tableDataHand2: ['','','','','','']});
          console.log("final", finalArray[1]);
      })
  }
  serveDisplay = (hand) => {
      var promise = new Promise((resolve, reject) => {
        arr = []
        firebaseApp.database().ref('/users2/' + currUser + "/stats/" + hand).once("value").then(snapshot => {
        snapshot.forEach(function(childSnapshot) {
          var hits = childSnapshot.val() && childSnapshot.val().hits;
          var shots = childSnapshot.val() && childSnapshot.val().shots;
          console.log("hi" + hits/shots);
          arr.push(Math.ceil((hits/shots) * 100));
          console.log(arr);
          });
         if (arr.length > 0) {
          resolve(arr);
        }
          else {
          console.log("arr" + arr.length);
          reject(Error("It broke"));
        }
        });
      });
      promise.then((arr) => {
      return new Promise((resolve, reject) => {
      tempArr = []
      finalArr = []
      arrCounter = 0
      for (var x = 0; x < 7; x++) {
        if (x < 6) {
          tempArr.push(arr[arrCounter] + "%");
            arrCounter++;
        } else {
          finalArr.push(tempArr)
          }
        console.log("final" + x + finalArr);
        if (x == 6) {
            resolve(finalArr);
        }
      }
      reject(Error("it broke again"))
    })
      }).then((finalArray) => {
          this.setState({tableDataHand2: finalArray[0]});
          this.setState({tableDataHand: [['','','','',''],['','','','','']]});
          this.setState({tableDataHand3: ['','','','','']});
          console.log("final", finalArray);
      })
  }
  render() {
    const { navigation } = this.props;
    const radio_props = [
      {label: 'Forehand ', value: 0 },
      {label: 'Backhand ', value: 1 },
      {label: 'Serve ', value: 2 }
    ];

    const tableDataServe = [
      ['1', '1', '1', '1', '1', '1']
    ];

    const tableDataHand = this.state.tableDataHand;
    const tableDataHand2 = this.state.tableDataHand2;
    const tableDataHand3 = this.state.tableDataHand3;

    console.log(tableDataHand);
    if (!this.state.fontLoaded) { return null;}
    return (
      <Container style={styles.container}>
        <Navbar
          title='Statistics'
          onPressBack={() => navigation.navigate("Home")}
          handleHamburger={() => navigation.navigate('DrawerOpen')}/>

        <Container style={styles.content}>
          <View style={styles.contentButtons}>
            <Text style={styles.text}> Shot Type: </Text>
            <RadioForm
              style={styles.radio}
              radio_props={radio_props}
              initial = {-1}
              formHorizontal={true}
              labelHorizontal={true}
              buttonColor={'#ffffff'}
              labelColor = {'#ffffff'}
              selectedLabelColor = {'#ffffff'}
              buttonSize= {18}
              animation={false}
              onPress={(value) => {this.getStats(value)}}/>
          </View>




          <Image style={styles.court}
            source={require('../assets/images/tenniscourt.png')}>

            <Table style = {styles.tableHand} borderStyle={{borderWidth: 1, borderColor: '#ffffff'}}>
              <Rows data = {tableDataHand}
                flexArr={[1, 1, 2, 1, 1]}
                style = {styles.row}
                textStyle = {styles.stats}/>

              <Row data = {tableDataHand2}
                flexArr={[1, 1, 1, 1, 1, 1]}
                style = {styles.row2}
                textStyle = {styles.stats}/>

              <Row data = {tableDataHand3}
                flexArr={[1, 1, 2, 1, 1]}
                style = {styles.row3}
                textStyle = {styles.stats}/>
            </Table>



          </Image>

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
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  text: {
    color: '#ffffff',
    margin: 20,
    fontFamily: 'bungee-inline',
    marginLeft: 20,
    fontSize: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firsttext: {
    color: '#ffffff',
    margin: 20,
    fontFamily: 'bungee-inline',
    marginLeft: 40,
    marginTop: 60,
    fontSize: 22
  },
  court: {
    height: 525,
    width: 400,
    alignSelf: 'center',
    resizeMode: 'contain',
    zIndex: 0,
    marginTop: 40
  },
  radio: {
    marginVertical: 12,
    marginLeft: 30
  },
  row: {
    height: 50
  },
  row2: {
    height: 50,
    marginTop: 100
  },
  row3: {
    height: 50,
    marginTop: 0
  },
  stats: {
    textAlign: 'center',
    fontSize: 10,
    color: '#ffffff'
  },
  tableHand: {
    width: 139,
    alignSelf: 'center',
    marginTop: '14.5%',
    backgroundColor: '#295b37'
  },
  tableServe: {
    width: 135,
    marginLeft: '34%',
    marginTop: '20%'
  }
});
