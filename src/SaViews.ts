import { shouldDialogBeVisible, getDialogMappingsToSaView } from './Dialogs/Dialog';
import { StoreState } from './UIStore/Main';

export interface SaView {
  readonly saGraphViewIndex: number
  readonly originatingSaViewIndex?: number
}

export function shouldSaViewBeVisible(saViewIndex: number, state: StoreState): boolean {
  // if the SaView is not linked to Dialogs which should not be visible
  const linkedDialogs = getDialogMappingsToSaView(saViewIndex, state.dialogs_.viewMappings);
  if (linkedDialogs.length == 0) return true;
  return linkedDialogs.filter((v, ix, arr) => {
    const dialog = state.dialogs_.dialogs[v.dialogIndex];
    if (!dialog) return false;
    return shouldDialogBeVisible(dialog);
  }).length > 0;
};

export function getClosestVisibleSaViewIndex(startingIndex: number, state: StoreState): number | undefined {
  const indexes = state.saViews_.saViews.map((v, ix) => ix);
  const previousIndexes = indexes.filter((ix) => ix < startingIndex);
  previousIndexes.reverse();
  const nextIndexes = indexes.filter((ix) => ix > startingIndex);
  const checkedIndexes = previousIndexes.concat(nextIndexes);
  for (let index = 0; index < checkedIndexes.length; index++) {
    const ix = checkedIndexes[index];
    if (shouldSaViewBeVisible(ix, state)) return ix;
  }
  return undefined;
}

export function getOriginatingOrClosestSaViewIndex(startingIndex: number, state: StoreState): number | undefined {
  let index = startingIndex;
  while (true) {
    const saView = state.saViews_.saViews[index];
    if (!saView) break;
    const originatingSaViewIndex = saView.originatingSaViewIndex;
    if (!originatingSaViewIndex) break;
    if (shouldSaViewBeVisible(originatingSaViewIndex, state)) 
      return originatingSaViewIndex;
    else
      index = originatingSaViewIndex;
  }
  return getClosestVisibleSaViewIndex(startingIndex, state);
}