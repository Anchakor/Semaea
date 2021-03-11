import { SaGraphView } from './Graphs';
import { arrayImmutableSet, objectClone, objectJoin } from '../Common';
import { StoreLib, UIStoreTools } from '../External';
import { SaView } from '../SaViews';

/* SaViews
SaViews are the Semaea Views, the main UI views user can switch between
SaViews 0..* - 0..1 Dialogs
SaViews 0..* - 0..1 SaGraphViews
*/

export interface State {
  readonly saViews: SaView[]
  readonly currentSaViewIndex: number
}
export const defaultState: State = { 
  saViews: [{ 
    saGraphViewIndex: 0
  }],
  currentSaViewIndex: 0
};

const slice = UIStoreTools.createSlice({
  name: 'SaViews',
  initialState: defaultState,
  reducers: {
    changeSaViewToIndex: (state, a: UIStoreTools.PayloadAction<number>) => {
      state.currentSaViewIndex = a.payload;
    },
    changeSaViewSaGraphView: (state, a: UIStoreTools.PayloadAction<{
      saViewIndex: number
      saGraphViewIndex: number
    }>) => {
      state.saViews[a.payload.saViewIndex].saGraphViewIndex = a.payload.saGraphViewIndex;
    },
  }
});

export const {
  changeSaViewSaGraphView,
  changeSaViewToIndex
} = slice.actions;

export const reducer = slice.reducer;
