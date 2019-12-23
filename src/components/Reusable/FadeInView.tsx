import React, { Component } from 'react';
import { Animated } from 'react-native';

interface Props {
  duration?: number;
  delay?: number;
  delayed?: boolean;
  style?: any;
  children?: any;
  pointerEvents?: any;

  didAppear?: () => void;
}

interface State {
  viewOpacity: Animated.Value;
}

const commonDelay = 500
class FadeInView extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      viewOpacity: new Animated.Value(0),
    };
  }

  // Delay apparition if needed
  timer: any = null
  componentDidMount() {
    const delay = this.props.delayed ? commonDelay : this.props.delay 
    if (delay)
      this.timer = setTimeout(this.runAnimation, delay)
    else
      this.runAnimation()
  }
  componentWillUnmount() {
    if (this.timer)
      clearTimeout(this.timer)
  }

  // Show up
  runAnimation = () => {
    const { viewOpacity } = this.state;
    const { didAppear, duration = 120 } = this.props;

    Animated.timing(
      viewOpacity,
      {
        toValue: 1,
        duration,
        useNativeDriver: true
      },
    ).start(didAppear || (() => {}));
  }

  render() {
    const { viewOpacity } = this.state;
    const { style } = this.props;

    return (
      <Animated.View pointerEvents={this.props.pointerEvents} style={[{ opacity: viewOpacity }].concat(style || [])}>
        {this.props.children}
      </Animated.View>
    );
  }
}

export default FadeInView;
