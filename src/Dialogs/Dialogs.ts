
export type DialogType = void // TODO

export enum ViewStatus { 
  Opened = 'Opened', 
  Closed = 'Closed', 
  NoView = 'NoView'
}

export interface Dialog {
  type: DialogType
  viewStatus: ViewStatus
}

export const getDialogsByType = <T extends Dialog>(dialogs: Dialog[], type: DialogType): T[] => {
  return dialogs.filter((value: Dialog) => value.type == type) as T[];
};

