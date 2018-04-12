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
    this.itemsRef = firebaseApp.database().ref('users');
    const {state} = this.props.navigation;
    window.currUser = state.params.key;
    this.state = {
      fontLoaded: false,
      targetCoord: null,
      target: null,
      translateX: new Animated.Value(-173),
      translateY: new Animated.Value(100),
      key: state.params.key, 
      hand: 'backhand',
      moves: []
    };
  }

  translateX = new Animated.Value(-173);
  translateY = new Animated.Value(100);
  p1x = 0;
  p1y = 0;
  p2x = 0;
  p2y = 0;

  relAngle(x0, y0, x1, y1) {
    return 180 * Math.atan2(y1 - y0, x1 - x0) / 3.14159;
  }

  segLen(x0, y0, x1, y1) {
    dx = x1 - x0;
    dy = y1 - y0;

    return Math.sqrt(dx * dx + dy * dx);
  }

  getTrainingResult = (value, gs) => {
    var shotStart = [gs.x0, gs.y0];
    var shotCoordinate = [gs.moveX, gs.moveY];
    var shotTarget = this.state.targetCoord;
    let [startXCoord, startYCoord] = shotStart;
    let [xCoord, yCoord] = shotCoordinate;
    let [xCoordTar, yCoordTar] = shotTarget;
    startDistance = (((startXCoord - xCoordTar)**2) + ((startYCoord - (yCoordTar))**2))**0.5
    endDistance = (((xCoord - xCoordTar) **2) + ((yCoord - (yCoordTar + 100)) **2))**0.5
    startDistanceX = startXCoord - xCoordTar;
    startDistanceY = startYCoord - yCoordTar;
    endDistanceX = xCoord - xCoordTar;
    endDistanceY = yCoord - yCoordTar;
    if (gs.vx < -1 || gs.vy < -1) {
          alert("far");
    }
    else if (this.state.hand == 'backhand') {
        var midpt = Math.ceil(value.length/2);
        console.log(value[midpt]);
        var val = value[midpt].split(",");
        var initial = value[1].split(",");
        console.log("val", value);
        console.log("first", val[0]);
        console.log("second", initial[0]);
        console.log("end", endDistance);
        if (!(val[0] < initial[0])) {
          alert("Not backhand!")
        } else if (!(val[1] < initial[1])) {
          alert("Oops, shot in the wrong direction!");
        } else {
            console.log(endDistance);
            if (endDistance < 100 && endDistance >= 50){
              alert("ok");
            }
           else if (endDistance < 50 && endDistance >= 30) {
              alert("close");
            }
          else if (endDistance < 30){
            alert("on target!");
            firebaseApp.database().ref('/users/' + currUser + "/stats/" + this.state.hand).once("value").then(snapshot => {
              snapshot.forEach(function(childSnapshot) {
              var hits = (childSnapshot.val() && childSnapshot.val().hits) + 1;
              var shots = (childSnapshot.val() && childSnapshot.val().shots) + 1;
            })
            });
          }
          else {
            alert("far");
          }
        }
    }
  }
 addToStats = (value) => {
      var updates = {};
      console.log("diff", value);
      console.log(this.state.key);
      if (value == 0) {
        updates['/users/' + this.state.key + '/righty'] = true;
        updates['/users/' + this.state.key + '/lefty'] = false;
        this.setState({handedness: 0})
        return this.itemsRef.update(updates);
      } else {
        updates['/users/' + this.state.key + '/righty'] = false;
        updates['/users/' + this.state.key + '/lefty'] = true;
        this.setState({handedness: 1})
        return this.itemsRef.update(updates);
      }
      // console.log('/users/' + this.state.key + '/h');
      console.log(updates);
      // key will be "ada" the first time and "alan" the second time
  }
  headingAccumulate = 0;
  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gs) => true, // make PanResponder repond 
     onPanResponderMove: (evt, gs) => {
      p3x = gs.x0;
      p3y = gs.y0;

      // Figure out the heading of each segment
      theta1 = this.relAngle(p3x, p3y, this.p2x, this.p2y);
      theta2 = this.relAngle(this.p2x, this.p2y, this.p1x, this.p1y);
      
      // Heading difference between the previous and current
      // line segments
      headingChange = theta2 - theta1;

      // Accumulate how much total heading change we've had
      // since starting the gesture
      // Ie if you draw 1/4 of a circle, we'll
      // accumulate 90 degrees of heading change
      this.headingAccumulate += headingChange;

      this.translateX.setValue(gs.dx-173);
      this.translateY.setValue(gs.dy+100);
      console.log(gs.dx);
      console.log("--");
      console.log(gs.dy);
      //this.stopAnimation.setValue(true);
      console.log("trigger onPanResponderMove");
      Animated.parallel([
      Animated.decay(this.state.translateX, {
          velocity: gs.vx,
          deceleration: 0.997
      }),
      Animated.decay(this.state.translateY, {
          velocity: gs.vy,
          deceleration: 0.997
      })
      ]).start();
      Animated.delay(10000);
      console.log("x", gs.moveX);
      console.log("y", gs.moveY);
      this.setState({moves: this.state.mover += [[gs.moveX + "," + gs.moveY + " "]]});
      console.log("loc", gs.dx);
      console.log("loc", gs.dy);

     },
    onPanResponderRelease: (evt, gs) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      console.log("xVal", gs.moveX);
      console.log("yVal", gs.moveY);
      console.log("released");
      var s = this.state.mover;
      s = s.split(" ");
      this.getTrainingResult(s, gs);
      console.log(this.state.targetCoord);
      var shotStart = [gs.x0, gs.y0]
      console.log('start', shotStart);
      var shotCoordinate = [gs.moveX, gs.moveY];
      var shotTarget = this.state.targetCoord;
      let [startXCoord, startYCoord] = shotStart;
      let [xCoord, yCoord] = shotCoordinate
      let [xCoordTar, yCoordTar] = shotTarget
      console.log("coord", shotCoordinate);
      console.log("target", shotTarget);
      console.log("velocity", gs.vx);
      console.log("velocity", gs.vy);
       // gs.vx and gs.vy give the x/y velocity upon
       // release of the touch
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
    // const translateX = new Animated.Value(-173);
    // const translateY = new Animated.Value(100);
    var stopAnimation = false; 


    if (!this.state.fontLoaded) { return null;}

    if (this.state.target == 1) {
      view = <View style={styles.target}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (this.state.target == 2) {
            view = <View style={styles.target2}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>

    } else if (this.state.target == 3) {
            view = <View style={styles.target3}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (this.state.target == 4) {
            view = <View style={styles.target4}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (this.state.target == 5) {
            view = <View style={styles.target5}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    }  else if (this.state.target == 6) {
            view = <View style={styles.target6}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (this.state.target == 7) {
            view = <View style={styles.target7}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (this.state.target == 8) {
            view = <View style={styles.target8}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (this.state.target == 9) {
            view = <View style={styles.target9}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (this.state.target == 10) {
            view = <View style={styles.target10}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (this.state.target == 11) {
            view = <View style={styles.target11}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (this.state.target == 12) {
            view = <View style={styles.target12}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (this.state.target == 13) {
            view = <View style={styles.target13}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (this.state.target == 14) {
            view = <View style={styles.target14}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else {
      view = <View style={styles.target15}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    }
    var counter = 1;
    var anotherCount = 0;
    const onPress = () => {
        console.log("check");
        anotherCount += 1;
    let animation = Animated.parallel([
    Animated.timing(this.state.translateX, {
        toValue: 40,
        duration: 10000,
        easing: Easing.bounce,
    }),
    Animated.timing(this.state.translateY, {
        toValue: 800,
        duration: 10000,
        easing: Easing.bounce,
    })
    ]);

    if (counter ==1) {
      console.log("im about to start");
      animation.start();
      counter = counter+1;
    } else {
      console.log(counter);
      animation.stop();
      //animation2.start();
    }
    console.log("temp", anotherCount);
    };


    return (
      <Container style={styles.container}>
        <Navbar
          title='TRAINING'
          onPressBack={() => navigation.goBack("Home")}
          handleHamburger={() => navigation.navigate('DrawerOpen')}/>

        <View contentContainerStyle={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.text}> Shot: forehand </Text>
        </View>
          <TouchableWithoutFeedback onPressIn ={onPress}>
          <Image style={styles.court}
            source={require('../assets/images/tenniscourt.png')}
          />
          </TouchableWithoutFeedback>

          <Animated.Image
            {...this.imagePanResponder.panHandlers}
            style = {[styles.ball, {transform:[{translateX: this.state.translateX},{translateY: this.state.translateY}] }]}
            source={require('../assets/images/tennisball.png')}
            
          />
          

          <Image style={styles.box}
            source={require('../assets/images/box.png')}
          />

          {view}
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
    top: 90+ 100/3,
    left: 121 + 140/3

  },
  target2: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 130+ 100/3,
    left: 121 + 140/3

  },
  target3: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 260+ 100/3,
    left: 121 + 140/3

  },
  target4: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 260+ 100/3,
    left: 50 + 140/3

  },
  target5: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 90+ 100/3,
    left: 50 + 140/3
  },
  target6: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 130+ 100/3,
    left: 50 + 140/3
  },
  target7: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 90+ 100/3,
    left: 215 + 140/3
  },
  target8: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 130+ 100/3,
    left: 215 + 140/3
  },
  target9: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 260+ 100/3,
    left: 215 + 140/3
  },
  target10: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 195+ 100/3,
    left: 75 + 140/3
  },
  target11: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 195+ 100/3,
    left: 97 + 140/3

  },
  target12: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 195+ 100/3,
    left: 120 + 140/3
  },
    target13: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 195+ 100/3,
    left: 147 + 140/3
  },
  target14: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 195+ 100/3,
    left: 170 + 140/3
  },
  target15: {
    width: 140/3,
    height: 100/3,
    backgroundColor: 'red',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 195+ 100/3,
    left: 192+ 140/3
  },
  targetText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 10
  }
});

