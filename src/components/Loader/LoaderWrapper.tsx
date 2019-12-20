import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay'

import { mainStyle } from '../../styles/main.style'

interface Props {
  shown: boolean;
  title: string;
}

const LoaderWrapper: React.SFC<Props> = (props) => (
  <Spinner
    visible={props.shown}
    textContent={props.title}
    textStyle={styles.textStyle}
    />
)

const styles = StyleSheet.create({
  textStyle: {
    ...mainStyle.montBold,
    color: '#fff',
    fontSize: 16,
  },
});

const mapStateToProps = (state: any) => ({
  title: state.loaderReducer.title,
  shown: state.loaderReducer.shown,
})

export default connect(mapStateToProps)(LoaderWrapper)