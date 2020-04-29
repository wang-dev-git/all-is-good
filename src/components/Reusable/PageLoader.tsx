import React from 'react';
import { StyleSheet, Share, Text, View, ScrollView } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay'

interface Props {
  loading: boolean;
  title: string;
  textStyle?: any;
}

const PageLoader: React.SFC<Props> = (props) => (
  <Spinner
    overlayColor='rgba(0, 0, 0, 0.82)'
    visible={props.loading}
    textContent={props.title}
    textStyle={{...styles.textStyle, ...props.textStyle}}
    />
)

const styles = StyleSheet.create({
  textStyle: {
    color: '#FFF'
  },
});

export default PageLoader