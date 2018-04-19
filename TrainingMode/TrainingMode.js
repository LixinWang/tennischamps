import React, { Component } from "react";
import { Font } from 'expo';
import * as firebase from 'firebase';
import { TouchableOpacity, Easing,StyleSheet, View, Image,PanResponder,TouchableWithoutFeedback, Animated} from 'react-native';
import { Container, Content, Left, Right, Text, ListItem, Radio } from 'native-base';

import Button from '../Components/Button';
import Navbar from '../Components/Navbar';
import Hidden from '../Components/Hidden';

export default class TrainingMode extends Component {
  constructor(props) {
    super(props);
    const {state} = this.props.navigation;
    window.currUser = firebase.auth().currentUser.uid;
    this.state = {
      fontLoaded: false,
      targetCoord: null,
      target: null,
      translateX: new Animated.Value(-177),
      translateY: new Animated.Value(80),
      hand: 'backhand',
      moves: [],
      ballXpx: 0,
      ballYpx: 0,
      targetXpx: 90+ 100/3,
      targetYpx: 121 + 140/3,
      targetWidth: 45,
      targetHeight: 30,
      shotTypeMade: 'backhand'
    };
  }

targetPositions = [
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
    { x: 0, y: 0, w: 45, h: 30},
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
              alert(arr[0][0]);
              firebaseApp.database().ref('/users2/').child(currUser).child("stats").child(this.state.hand).child(this.state.target).set({hits: arr[0][0], shots: arr[0][1]});
            });
    }
  }
  
  getTrainingResult = (endDistance) => {
    if (this.state.hand == 'backhand') {
        if (this.state.shotTypeMade != this.state.hand) {
          alert("Not the right shot type!");
          this.putTrainingDB(false);
        } else {
          if (endDistance < 30 && endDistance >= 20){
              alert("ok");
             this.putTrainingDB(false);
          }
          else if (endDistance < 20 && endDistance >= 10) {
              alert("close");
              this.putTrainingDB(false);

            }
          else if (endDistance < 10){
            alert("on target!");
            this.putTrainingDB(true);
          }
          else {
            alert("far");
            this.putTrainingDB(false);
          }
        }
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
    x = x + this.state.targetWidth / 2;
    y = y - this.state.targetHeight / 2;

    this.setState({targetXpx: 320 + x, targetYpx: y});
  }

  configTarget(idx) {
    tgt = this.targetPositions[idx];
    this.setState({targetWidth: tgt.w});
    this.setState({targetHeight: tgt.h});
    
    this.targetX = tgt.x;
    this.targetY = tgt.y;

    this.placeTarget(tgt.x, tgt.y);
  }

  stepcnt = 0;

  foo() {
    // Here's where we move the ball
    switch(this.gamephase) {
      case 0: // before shot fired
        this.ballX = 5.5;
        this.ballY = 0;
        this.stepcnt = 120;
        
        this.configTarget(0);
        break;
      case 1: // shot is flying thru air
        this.ballY += 8 / 60;  // move at 3 m/s
        break;
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
        // nothing to do here, we're done!
        // TODO: we should
        break;
    }

    this.placeBall(this.ballX, this.ballY);
    setTimeout(() => this.foo(), 16.6667);    
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
    //var a = Math.floor(Math.random() * 15) + 1 ;

    // start off the periodic UI updates
    // this gets re-called at the end of
    setTimeout(() => this.foo(), 16.6667);




    var a = 1;
    var view = null
    var targetLocations = [];
    if (a == 1) {
      this.setState({target: 1});
      this.setState({targetCoord: [((121 + 140/3) + ((121 + 140/3) + 140/3))/2, ((90+ 100/3) + ((90 + 100/3) + (90 + 100/3)))/2]});
    }
    if (a == 2) {
      this.setState({target: 2});
      this.setState({targetCoord: [((121 + 140/3) + ((121 + 140/3) + 140/3))/2, ((130+ 100/3) + ((130 + 100/3) + (90 + 100/3)))/2]});
    }
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

    return (
      <Container style={styles.container}>
        <Navbar
          title='TRAINING'
          onPressBack={() => navigation.navigate("Home")}
          handleHamburger={() => navigation.navigate('DrawerOpen')}/>

        <View contentContainerStyle={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.text}> Shot: forehand </Text>
        </View>
          <TouchableWithoutFeedback onPressIn={ () => { if(this.gamephase == 0) { this.gamephase = 1;} }} >
          <Image style={styles.court}
            source={require('../assets/images/tenniscourt.png')}
          />
          </TouchableWithoutFeedback>

          <Animated.Image
            {...this.imagePanResponder.panHandlers}
            style = {[styles.ball, {transform:[{translateX: this.state.ballXpx},{translateY: this.state.ballYpx}] }]}
            source={require('../assets/images/tennisball.png')}

          />

          <View style={[styles.target, {width: this.state.targetWidth, height: this.state.targetHeight, top: this.state.targetYpx, left: this.state.targetXpx}]} >
            <Text style={styles.targetText}>TARGET</Text>
          </View>
          <Button style={styles.button}
           label='End the game'
           onPress={() => this.props.navigation.navigate("EndGameScreen")}
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
    marginVertical: 1,
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
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 10
  }
});
