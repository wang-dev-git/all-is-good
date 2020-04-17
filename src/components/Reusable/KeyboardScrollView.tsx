import React from 'react';
import { StyleSheet } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface Props {
  contentContainerStyle?: any;
}
const KeyboardScroll: React.FC<Props> = (props) => {
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid contentContainerStyle={props.contentContainerStyle}>
      {props.children}
    </KeyboardAwareScrollView>
  );

}

const styles = StyleSheet.create({

});

export default KeyboardScroll

