
export type DialogType = void // TODO

export type ViewStatus = 'opened' | 'closed' | 'no view'

export interface Dialog {
  type: DialogType
  viewStatus: ViewStatus
}

export const getDialogsByType = <T extends Dialog>(dialogs: Dialog[], type: DialogType): T[] => {
  return dialogs.filter((value: Dialog) => value.type == type) as T[];
};

