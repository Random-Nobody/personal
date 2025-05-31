import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  board: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#000',
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
    backgroundColor: '#FFFFFF',
  },
  dark: {
    backgroundColor: '#B58863',
  },
  highlight: {
    width: '25%',
    height: '25%',
    borderRadius: '50%',
    backgroundColor: '#3337',
  },
  capturable: {
    backgroundColor: '#f005',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
  },
  heldPiece: {
    position: 'absolute',
    width: '12.5%', //need clever way to not hardcode 8*8 board?
    aspectRatio: 1,
    zIndex: 1000,
  },
});

export default styles;