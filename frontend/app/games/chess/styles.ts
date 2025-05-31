import { StyleSheet } from 'react-native';
import { chessColors } from './consts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  board: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: chessColors.black,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  square: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  light: {
    backgroundColor: chessColors.white,
  },
  dark: {
    backgroundColor: chessColors.dark,
  },
  highlight: {
    width: '25%',
    height: '25%',
    borderRadius: '50%',
    backgroundColor: chessColors.highlight,
  },
  capturable: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: chessColors.captureable,
  },
  heldPiece: {
    position: 'absolute',
    width: '12.5%', // maybe need clever way to not hardcode 8*8 board?
    aspectRatio: 1,
    zIndex: 1000,
  },
});

export default styles;