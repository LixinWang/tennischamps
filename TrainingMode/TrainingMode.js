import React, { Component } from "react";
import { Font } from 'expo';
import * as firebase from 'firebase';
import { TouchableOpacity, Easing, StyleSheet, View, Image,PanResponder,TouchableWithoutFeedback, Animated, Alert} from 'react-native';
import { Container, Content, Left, Right, Text, ListItem, Radio } from 'native-base';

import Button from '../Components/Button';
import NavBarWithBurger from '../Components/NavBarWithBurger';
import Hidden from '../Components/Hidden';

export default class TrainingMode extends Component {
  constructor(props) {
    super(props);
    this.itemsRef = firebaseApp.database().ref('users2');
    window.currUser = firebase.auth().currentUser.uid;
    const {state} = this.props.navigation;
    this.state = {
      fontLoaded: false,
      targetCoord: null,
      target: null,
      translateX: new Animated.Value(-177),
      translateY: new Animated.Value(80),
      key: window.currUser,
      selected: parseInt(state.params.selected) + 1,
      totalBalls: parseInt(state.params.selected) + 1,
      hand: 'backhand',
      moves: [],
      ballXpx: 0,
      ballYpx: 0,
      targetXpx: 90 + 100/3,
      targetYpx: 121 + 140/3,
      targetWidth: 45,
      targetHeight: 30,
      shotTypeMade: 'backhand',
      difficultyTypes: state.params.difficulty,
      ballsHit: 0
    };
  }

targetPositions = [
    { x: 3.985, y: 1.2, w: 139/3, h: 98.5/2}, // 1
    { x: 3.985 + 2.71, y: 1.2, w: 139/3, h: 98.5/2}, // 2
    { x: 3.985 + 2.71*2, y: 1.2, w: 139/3, h: 98.5/2}, // 3

    { x: 3.985, y: 1.2 + 2.92, w: 139/3, h: 98.5/2}, // 4
    { x: 3.985 + 2.71, y: 1.2 + 2.92, w: 139/3, h: 98.5/2}, // 5
    { x: 3.985 + 2.71*2, y: 1.2 + 2.92, w: 139/3, h: 98.5/2}, // 6

    { x: 3.985, y: 7.2, w: 139/6, h: 98.5/2}, // 7
    { x: 3.985 + 1.355, y: 7.2, w: 139/6, h: 98.5/2}, // 8
    { x: 3.985 + 1.355*2, y: 7.2, w: 139/6, h: 98.5/2}, // 9

    { x: 3.985 + 1.355*3 + 0.1, y: 7.2, w: 139/6, h: 98.5/2}, // 10
    { x: 3.985 + 1.355*4 + 0.1, y: 7.2, w: 139/6, h: 98.5/2}, // 11
    { x: 3.985 + 1.355*5 + 0.1, y: 7.2, w: 139/6, h: 98.5/2}, // 12

    { x: 3.985, y: 10.245, w: 139/3, h: 98.5/2}, // 13
    { x: 3.985 + 2.71, y: 10.245, w: 139/3, h: 98.5/2}, // 14
    { x: 3.985 + 2.71*2, y: 10.245, w: 139/3, h: 98.5/2}, // 15
  ];

putTrainingDB = (value) => {
  if (!value){
    var arr = []
   var promise = new Promise((resolve, reject) => {
              firebaseApp.database().ref('/users2/' + currUser + "/stats/" + this.state.hand + "/" + this.state.target).once("value").then(snapshot => {
              hits = (snapshot.val() && snapshot.val().hits);
              if (hits) {
                hits = hits + 1
              } else {
                hits = 1
              }
              shots = (snapshot.val() && snapshot.val().shots);
              if (shots) {
                shots = shots + 1;
              } else {
                shots = 1
              }
              arr.push(shots);
              if (arr.length > 0) {
                resolve(arr);
              }
              else {
                console.log("arr" + arr.length);
                reject(Error("It broke"));
              }
            });
            });
            //make sure to change the 2 here to the current target
            promise.then((arr) => {
              console.log("arr", arr);
              firebaseApp.database().ref('/users2/').child(currUser).child("stats").child(this.state.hand).child(this.state.target).set({shots: arr[0]});
              });
  } else {
    var arr = []
            var promise = new Promise((resolve, reject) => {
            firebaseApp.database().ref('/users2/' + currUser + "/stats/" + this.state.hand + '/' + this.state.target).once("value").then(snapshot => {
              hits = (snapshot.val() && snapshot.val().hits);
              if (hits) {
                hits = hits + 1
              } else {
                hits = 1
              }
              shots = (snapshot.val() && snapshot.val().shots);
              if (shots) {
                shots = shots + 1;
              } else {
                shots = 1
              }
              arr.push([hits, shots])
              if (arr.length > 0) {
                resolve(arr);
              }
              else {
                console.log("arr" + arr.length);
                reject(Error("It broke"));
              }
            });
            });
            //make sure to change the 2 here to the current target
            promise.then((arr) => {
              firebaseApp.database().ref('/users2/').child(currUser).child("stats").child(this.state.hand).child(this.state.target).set({hits: arr[0][0], shots: arr[0][1]});
            });
    }
  }

  getTrainingResult = (endDistance) => {
        //if (this.state.shotTypeMade != this.state.hand) {
          //alert("Not the right shot type!");
          //this.putTrainingDB(false);
        //} else {
        ballsLeft = this.state.selected - 1;
        if (endDistance < 7 && endDistance >= 5){
          if (this.state.selected > 0) {
            Alert.alert(
                'Accuracy',
                'That was okay. Balls left: ' + ballsLeft,
                [
                  {text: 'Ok', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              )
          }
           this.putTrainingDB(false);
        }
        else if (endDistance < 5 && endDistance >= 3) {
          if (this.state.selected > 0) {
            Alert.alert(
                'Accuracy',
                'Ohh... so close! Balls left: ' + ballsLeft,
                [
                  {text: 'Ok', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              )
          }
            this.putTrainingDB(false);
          }
        else if (endDistance < 3){
          if (this.state.selected > 0) {
            Alert.alert(
                'Accuracy',
                'Target hit! Balls left: ' + ballsLeft,
                [
                  {text: 'Ok', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              )
          }
          this.setState({ballsHit: this.state.ballsHit+1});
          this.putTrainingDB(true);
        }
        else {
          if (this.state.selected > 0) {
            Alert.alert(
                'Accuracy',
                'Oops! Too far. Balls left: ' + ballsLeft,
                [
                  {text: 'Ok', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              )
          }
          this.putTrainingDB(false);
        }

  }

  gamephase = 0;

  targetX = 5.5;
  targetY = 3;

  ballX = 0;
  ballY = 0;
  balldX = 0;
  balldY = 0;

  fingerX = 0;
  fignerY = 0;
  fingerdX = 0;
  fingerdY = 0;

  courtToPxX(x) {
    return 17 * (x - 5.5) - 176;
  }

  courtToPxY(y) {
    return 17 * (y) + 100;
  }

  pxToCourtX(x) {
    pxFromCourtCenter = x - 192;
    distFromCourtCenter = pxFromCourtCenter / 17;

    return distFromCourtCenter + 5.5;
  }

  pxToCourtY(y) {
    return (y - 160) / 17;
  }

  placeBall(x, y) {
    x = this.courtToPxX(x);
    y = this.courtToPxY(y);

    this.setState({ballXpx: x, ballYpx: y});
  }

  placeTarget(x, y) {
    x = this.courtToPxX(x);
    y = this.courtToPxY(y);

    // Correct from center to top left corner
    // x = x + this.state.targetWidth / 2;
    // y = y - this.state.targetHeight / 2;

    this.setState({targetXpx: 320 + x, targetYpx: y});
  }

  configTarget(idx) {
    tgt = this.targetPositions[idx];
    this.setState({targetWidth: tgt.w});
    this.setState({targetHeight: tgt.h});

    this.targetX = tgt.x;
    this.targetY = tgt.y;

    this.placeTarget(tgt.x, tgt.y);

    this.setState({target: idx + 1});
  }

  // Randomly Generate Shot Type:
  randShot = Math.floor(Math.random() * 3);
  getShotType() {
    if (this.randShot == 0) {
      this.state.hand = "forehand";
    } else if (this.randShot == 1) {
      this.state.hand = "backhand";
    } else {
      this.state.hand = "serve";
    }
  }

  // Randomly Generate Target:
  getRandomTargetIndex() {
    if (this.randShot == 2) {
      min = Math.ceil(6);
      max = Math.floor(12);
      return (Math.floor(Math.random() * (max - min)) + min); //The maximum is exclusive and the minimum is inclusive
    } else {
      min = Math.ceil(0);
      max = Math.floor(6);
      min2 = Math.ceil(12);
      max2 = Math.floor(15);
      return ((Math.floor(Math.random() * (max - min)) + min) || (Math.floor(Math.random() * (max2 - min2)) + min2));
    }
  }

  targetIndex = this.getRandomTargetIndex();
  targetName = '';
  getTargetName() {
    if (this.targetIndex == 0) {
      this.targetName = "Left Baseline";
    } else if (this.targetIndex == 1) {
      this.targetName = "Centre Mark";
    } else if (this.targetIndex == 2) {
      this.targetName = "Right Baseline";
    } else if (this.targetIndex == 3) {
      this.targetName = "Left Baseline";
    } else if (this.targetIndex == 4) {
      this.targetName = "T Serviceline";
    } else if (this.targetIndex == 5) {
      this.targetName = "Right Serviceline";
    } else if (this.targetIndex == 6) {
      this.targetName = "Deuce Left";
    } else if (this.targetIndex == 7) {
      this.targetName = "Deuce Middle";
    } else if (this.targetIndex == 8) {
      this.targetName = "Deuce Right";
    } else if (this.targetIndex == 9) {
      this.targetName = "Advantage Left";
    } else if (this.targetIndex == 10) {
      this.targetName = "Advantage Middle";
    } else if (this.targetIndex == 11) {
      this.targetName = "Advantage Right";
    } else if (this.targetIndex == 12) {
      this.targetName = "Beyond Left Net Area";
    } else if (this.targetIndex == 13) {
      this.targetName = "Beyond Middle Net Area";
    } else if (this.targetIndex == 14) {
      this.targetName = "Beyond Right Net Area";
    } else {
      this.targetName = "error error";
    }
  }

  isDead = false;

  stepcnt = 0;
  foo() {
    if(this.isDead) return;

    // Here's where we move the ball
    switch(this.gamephase) {
      case 0: // before shot fired
        // if (this.randShot == 'serve') {}
        this.ballX = 5.5;
        this.ballY = 0;
        this.stepcnt = 120;
        this.configTarget(this.targetIndex);
        break;
      case 1: // shot is flying thru air
        if (global.difficulty == 0) {
          this.ballY += 8 / 60;  // move at 3 m/s
          break;
        } else if (global.difficulty == 1) {
          this.ballY += 16 / 60;
          break;
        } else {
          this.ballY += 20 / 60;
          break;
        }
      case 2: // In the process of hitting it back
        this.ballX = this.pxToCourtX(this.fingerX);
        this.ballY = this.pxToCourtY(this.fingerY);

        this.balldX = this.fingerdX / 17;
        this.balldY = this.fingerdY / 17;
        /*console.log(" ");
        console.log(this.ballY);
        console.log(this.fingerY);*/
        break;
      case 3: // ball is flying back
        this.ballX += this.balldX * 5;
        this.ballY += this.balldY * 7;

        this.balldX *= 0.97;
        this.balldY *= 0.97;

        if(this.stepcnt-- == 0)
        {
          this.gamephase = 4;
        }
        break;
      case 4: // Ball has hit target and is now static, game over
        // pythagorus
        dist = ((this.ballX - this.targetX)**2 + (this.ballY - this.targetY)**2);
        dist = dist ** (1/2);
        this.getTrainingResult(dist);
        this.gamephase = 5;
        break;
      case 5:
        this.state.selected--;

        // If there are more rounds to play, go back to state 0
        if(this.state.selected > 0)
        {
          this.gamephase = 0;
        }
        else
        {
          // Go to end screen.
          // this
          //alert("End of training", "nice job dude", )
          //onPress={() => this.props.navigation.navigate("EndGameScreen", {totalBalls: this.state.totalBalls})}
          Alert.alert(
              'Training Finished',
              'See how you did!',
              [
                {text: 'View Results', onPress: () => this.props.navigation.navigate("EndGameScreen", {totalBalls: this.state.totalBalls, targetsHit: this.state.ballsHit})},
              ],
              { cancelable: false }
            )
          // doThisThing: () => this.props.navigation.navigate("EndGameScreen", {totalBalls: this.state.totalBalls, targetsHit: this.state.ballsHit});
          this.isDead = true;
        }

        // nothing to do here, we're done!
        // TODO: we should
        break;
    }

    this.placeBall(this.ballX, this.ballY);

    // only reschedule if we didn't get
    // unmounted yet (ie user is still on this page)
    if(!this.isDead) setTimeout(() => this.foo(), 16.6667);
  }

  relAngle(x0, y0, x1, y1) {
    return 180 * Math.atan2(y1 - y0, x1 - x0) / 3.14159;
  }

  headingAccumulate = 0;
  p2x = 0;
  p2y = 0;
  lastHeading = 0;

  cnt = 1;

  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gs) => true, // make PanResponder repond
     onPanResponderMove: (evt, gs) => {
        // If your finger is down, you're presently moving the ball, we don't do anything special until release
        if(this.gamephase == 1 && this.ballY > 12)
        {
          this.gamephase = 2;
          this.p2x = gs.moveX;
          this.p2y = gs.moveY;
        }

        if(this.gamephase == 2)
        {
          this.fingerX = gs.moveX;
          this.fingerY = gs.moveY;
          this.fingerdX = gs.vx;
          this.fingerdY = gs.vy;

          p1x = gs.moveX;
          p1y = gs.moveY;

          if(this.cnt++ % 2000 == 0) debugger;

          // Figure out the heading of each segment
          theta1 = this.relAngle(p1x, p1y, this.p2x, this.p2y);

          this.p2x = p1x;
          this.p2y = p1y;

          this.headingAccumulate += this.lastHeading - theta1;

          this.lastHeading = theta1;

          console.log(this.headingAccumulate);
        }
     },
    onPanResponderRelease: (evt, gs) => {
      // Upon release, we transition to the 3rd state
      //debugger;

      if(this.gamephase == 2)
      {
        this.gamephase = 3;
      }
     }

  });
  static navigationOptions = {
    drawerLabel: <Hidden />,
  };

  async componentDidMount() {
    await Expo.Font.loadAsync({
      'bungee-inline': require('../assets/fonts/BungeeInline-Regular.ttf'),
      'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
      'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ fontLoaded: true, stopAnimation: false });

    // start off the periodic UI updates
    setTimeout(() => this.foo(), 16.6667);
  }

  async componentWillUnmount() {
    this.isDead = true;
  }

  get(value) {
    if (value == 'translateX') {
      return this.state.translateX
    } else {
      return this.state.translateY
    }
  }

  render() {
    const { navigation } = this.props;

    if (!this.state.fontLoaded) { return null;}

    this.getShotType();
    this.getTargetName();

    console.log("CASE", this.gamephase);
    console.log("BALLZ LEFT", this.state.selected);
    return (
      <Container style={styles.container}>
        <NavBarWithBurger
          title='TRAINING'
          onPressBack={() => navigation.navigate("Home", {selected: this.state.selected})}
          handleHamburger={() => navigation.navigate('DrawerOpen')}/>

        <View contentContainerStyle={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.text}> Shot: {this.state.hand} </Text>
          <Text style={styles.text}> Target: {this.targetName} </Text>
        </View>
          <TouchableWithoutFeedback onPressIn={ () => { if(this.gamephase == 0) { this.gamephase = 1;} }} >
          <Image style={styles.court}
            source={require('../assets/images/tenniscourt.png')}
          />
          </TouchableWithoutFeedback>

          <Animated.Image
            {...this.imagePanResponder.panHandlers}

            style = {[styles.ball, {transform:[{translateX: this.state.ballXpx},{translateY: this.state.ballYpx}] }]}
            source={require('../assets/images/tennisball.png')}/>


          <View style={[styles.target, {width: this.state.targetWidth, height: this.state.targetHeight, top: this.state.targetYpx, left: this.state.targetXpx}]} >
            <Text style={styles.targetText}>{this.targetIndex + 1}</Text>
          </View>
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
    backgroundColor: '#ffffff',
    position: 'absolute',
    zIndex: 3,
    bottom: 10,
    left: 60

  },
  text: {
    fontFamily: 'bungee-inline',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textContainer: {
    margin: 10
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
    height: 16,
  },
  box: {
    position: 'absolute',
    top: 96,
    right: 171,
    zIndex: 1,
    height: 25,
    width: 25
  },
  target: {
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FDFEFC'
  },
  targetText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 10
  }
});
