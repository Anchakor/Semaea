import { Triple } from '../Graphs/Triple';
import { checkKindFor } from 'Common';

export enum Status { 
  Opened = 'Opened', 
  Finished = 'Finished', 
  Cancelled = 'Cancelled'
}

export interface Dialog {
  readonly kind: DialogKind
  readonly status: Status
  readonly createdGraphIndex?: number
}

export interface DialogSaViewMapping {
  readonly dialogIndex: number
  readonly saViewIndex: number
}

export const dialogIsOfKind = checkKindFor<Dialogs>();

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

export type Dialogs = Dialog
  | DeleteGraphDialog
  | AddTripleDialog
  | DialogMenuDialog
  | OpenFileDialog

export enum DialogKind {
  DeleteGraph = 'DeleteGraph'
}
export interface DeleteGraphDialog extends Dialog {
  readonly kind: DialogKind.DeleteGraph
  readonly graphToDeleteIndex: number
}

export enum DialogKind {
  AddTriple = 'AddTriple'
}
export interface AddTripleDialog extends Dialog {
  readonly kind: DialogKind.AddTriple
  readonly triple: Triple
}

export enum DialogKind {
  DialogMenu = 'DialogMenu'
}
export interface DialogMenuDialog extends Dialog {
  readonly kind: DialogKind.DialogMenu
  readonly selectedDialog: DialogKind | undefined // TODO probably remove
  readonly createdGraphIndex: number
}

export enum FileDialogStatus {
  LoadingDirectory = 'LoadingDirectory',
  LoadedDirectory = 'LoadedDirectory',
  ProcessingFile = 'ProcessingFile',
}

// File dialogs:

export interface FileDialog extends Dialog {
  readonly createdGraphIndex: number
  readonly syncID: number
  readonly directoryPath: string
  readonly fileDialogStatus: FileDialogStatus
  readonly filePath?: string
}

export function isFileDialog(dialog: Dialog): dialog is FileDialog {
  switch (dialog.kind) {
    case DialogKind.OpenFile:
      return true;
    default:
      return false;
  }
}

export enum DialogKind {
  OpenFile = 'OpenFile'
}
export interface OpenFileDialog extends FileDialog {
  readonly kind: DialogKind.OpenFile
}
