import { Triple } from "../Graphs/Triple";

export enum Status { 
  Opened = 'Opened', 
  Finished = 'Finished', 
  Cancelled = 'Cancelled'
}

export interface Dialog {
  readonly type: DialogType
  readonly status: Status
}

export interface DialogSaViewMapping {
  readonly dialogIndex: number
  readonly saViewIndex: number
}

export const getDialogsByType = <T extends Dialog>(dialogs: Dialog[], type: DialogType): T[] => {
  return dialogs.filter((value: Dialog) => value.type == type) as T[];
};

export function shouldDialogBeVisible(dialog: Dialog): boolean {
  return dialog.status != Status.Finished 
    && dialog.status != Status.Cancelled
}

export function getDialogMappingsToSaView(saViewIndex: number, viewMappings: DialogSaViewMapping[]) {
  return viewMappings.filter((v, ix, arr) => {
    return v.saViewIndex == saViewIndex;
  });
}

// DIALOGS:

export enum DialogType {
  DeleteGraph = 'DeleteGraph'
}
export interface DeleteGraphDialog extends Dialog {
  readonly type: DialogType.DeleteGraph
  readonly graphToDeleteIndex: number
}

export enum DialogType {
  AddTriple = 'AddTriple'
}
export interface AddTripleDialog extends Dialog {
  readonly type: DialogType.AddTriple
  readonly triple: Triple
}

export enum DialogType {
  DialogMenu = 'DialogMenu'
}
export interface DialogMenuDialog extends Dialog {
  readonly type: DialogType.DialogMenu
  readonly selectedDialog: DialogType | undefined
  readonly createdGraphIndex: number
}
