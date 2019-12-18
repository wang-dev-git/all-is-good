import React from 'react';
import { StyleSheet, Image } from 'react-native';

interface Props {
  src: any;

  indicator?: any;
  style?: any;
  resizeMode?: any;
}
const defaultProps = {
  resizeMode: 'contain'
}

const AssetImage: React.SFC<Props> = (props) => {
  return (
    <Image
      resizeMode={props.resizeMode}
      style={[styles.image, props.style]}
      source={props.src}
      />
  )
}

const styles = StyleSheet.create({
  image: {
    width: undefined,
    height: undefined,
    flex: 1,
  },
});

AssetImage.defaultProps = defaultProps
export default AssetImage