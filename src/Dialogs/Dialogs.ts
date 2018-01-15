
export enum DialogType {
  DeleteGraph = 'DeleteGraph'
} // TODO

export enum Status { 
  Opened = 'Opened', 
  Closed = 'Closed', 
  NoView = 'NoView'
}

export interface Dialog {
  type: DialogType
  status: Status
}

export const getDialogsByType = <T extends Dialog>(dialogs: Dialog[], type: DialogType): T[] => {
  return dialogs.filter((value: Dialog) => value.type == type) as T[];
};

export interface DeleteGraphDialog extends Dialog {
  type: DialogType.DeleteGraph
  graphToDeleteIndex: number
}
