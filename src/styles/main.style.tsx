import { ifIphoneX } from 'react-native-iphone-x-helper'

export const mainStyle = {
  // Colors
  themeGradient: { start: '#02EBE2', end: '#00A5EB' },
  themeColor: 'rgb(64, 192, 164)', // old: 'rgb(64, 192, 164)'
  themeColorAlpha: (alpha: string) => {
    return 'rgba(64, 192, 164, ' + alpha + ')'
  }, 
  lightColor: '#6E6E6E',
  darkColor: '#263238',
  redColor: '#E25464',
  greenColor: '#4BB543',
  orangeColor: '#AA8312',

  // Fonts

  montText: {
    fontSize: 15,
    fontFamily: 'nunito',
  },
  montLight: {
    fontSize: 15,
    fontFamily: 'nunito-light',
  },
  montBold: {
    fontSize: 13,
    fontFamily: 'nunito-bold',
  },

  // Styles 
  abs: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
  },
  circle: (size: number) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
  }),

  floatingBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  phonePaddingBottom: ifIphoneX({
    paddingBottom: 40,
  },{
    paddingBottom: 20,
  }).paddingBottom,

  sideMargin: 18,
}