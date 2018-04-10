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
    this.state = {
      fontLoaded: false,
      translateX: new Animated.Value(-173),
      translateY: new Animated.Value(100)

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
      console.log("xValF", gs.moveX);
      console.log("yValF", gs.moveY);

     },
    onPanResponderRelease: (evt, gs) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      console.log("xVal", gs.moveX);
      console.log("yVal", gs.moveY);
    }
  });
  static navigationOptions = {
    drawerLabel: <Hidden />,
  };


  getAccuracy(shotCoordinate, shotTarget) {
    let [xCoord, yCoord] = shotCoordinate
    let [xCoordTar, yCoordTar] = shotTarget
    distance = (((xCoord - xCoordTar)**2) + ((yCoord - yCoordTar)**2))**0.5
    if (distance < 5) {
      return "veryclose"
    }
    if (distance > 5 && distance <= 15) {
      return "close"
    }
    if (distance > 15 && distance <= 25) {
      return "average"
    }
    if (distance > 25) {
      return "far"
    }

  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      'bungee-inline': require('../assets/fonts/BungeeInline-Regular.ttf'),
      'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
      'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ fontLoaded: true, stopAnimation: false });

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
    var a = Math.floor(Math.random() * 15) + 1 ;
    var view = null
       

    var targetLocations = [];


    if (a == 1) {
      view = <View style={styles.target}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (a == 2) {
            view = <View style={styles.target2}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>

    } else if (a == 3) {
            view = <View style={styles.target3}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (a == 4) {
            view = <View style={styles.target4}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (a == 5) {
            view = <View style={styles.target5}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    }  else if (a == 6) {
            view = <View style={styles.target6}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (a == 7) {
            view = <View style={styles.target7}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (a == 8) {
            view = <View style={styles.target8}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (a == 9) {
            view = <View style={styles.target9}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (a == 10) {
            view = <View style={styles.target10}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (a == 11) {
            view = <View style={styles.target11}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (a == 12) {
            view = <View style={styles.target12}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (a == 13) {
            view = <View style={styles.target13}>
            <Text style={styles.targetText}>TARGET</Text>
          </View>
    } else if (a == 14) {
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
    width: 140/6,
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
    width: 140/6,
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
    width: 140/6,
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
    width: 140/6,
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
    width: 140/6,
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
    width: 140/6,
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
    width: 140/6,
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
    width: 140/6,
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
    width: 140/6,
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
    width: 140/6,
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
    width: 140/6,
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
    width: 140/6,
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

