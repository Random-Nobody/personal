import { SvgProps } from 'react-native-svg';
import bk from '@/assets/games/chess/bk.svg';
import wk from '@/assets/games/chess/wk.svg';
import bq from '@/assets/games/chess/bq.svg';
import wq from '@/assets/games/chess/wq.svg';
import bb from '@/assets/games/chess/bb.svg';
import wb from '@/assets/games/chess/wb.svg';
import bn from '@/assets/games/chess/bn.svg';
import wn from '@/assets/games/chess/wn.svg';
import br from '@/assets/games/chess/br.svg';
import wr from '@/assets/games/chess/wr.svg';
import bp from '@/assets/games/chess/bp.svg';
import wp from '@/assets/games/chess/wp.svg';
import { PieceType } from './types';



export const pieceComponents: Record<string, React.FC<SvgProps>> = {
  'br': br, 'bn': bn, 'bb': bb, 'bq': bq, 'bk': bk, 'bp': bp,
  'wr': wr, 'wn': wn, 'wb': wb, 'wq': wq, 'wk': wk, 'wp': wp,
};


export const initialBoard: PieceType[][] = [
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', 'wq', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
];