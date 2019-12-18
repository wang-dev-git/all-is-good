import React from 'react';

import { StyleSheet, View, Text, TextInput } from 'react-native';

interface Props {
  title: string;
  value: string;
  placeholder: string;
  maxLength?: number;
  maxLines?: number;
  multiline?: boolean;
  autocorrect?: boolean;
  keyboardType?: any;
  secure?: boolean;
  editable?: boolean;

  onChange: (event: any) => void;
}

const TitledInput: React.SFC<Props> = (props) => {
  const onChange = (event: any) => {
    const text = event.nativeEvent.text
    const lines = text.split("\n").length
    const max = props.maxLines
    if (!max || lines <= max)
      props.onChange(event)
  }
  return (
    <View style={[styles.container, props.editable === false ? {opacity: 0.42} : {}]}>
      <Text style={props.multiline ? {marginBottom: 8} : {}}>{props.title.toUpperCase()}</Text>
      <TextInput
        value={props.value}
        placeholder={props.placeholder}
        onChange={onChange}
        multiline={props.multiline}
        style={[styles.input, props.multiline ? {minHeight: 60} : {height: 50}]}
        maxLength={props.maxLength || 500}
        keyboardType={props.keyboardType}
        underlineColorAndroid='transparent'
        secureTextEntry={props.secure}
        autoCorrect={props.autocorrect}
        editable={props.editable}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: {
    color: '#777',
  },
});

export default TitledInput