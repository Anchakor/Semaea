
export enum DialogType {
  DeleteGraph = 'DeleteGraph'
} // TODO

export enum Status { 
  Opened = 'Opened', 
  Finished = 'Finished', 
  Cancelled = 'Cancelled'
}

export interface Dialog {
  type: DialogType
  status: Status
}

export const getDialogsByType = <T extends Dialog>(dialogs: Dialog[], type: DialogType): T[] => {
  return dialogs.filter((value: Dialog) => value.type == type) as T[];
};

export function shouldDialogBeVisible(dialog: Dialog): boolean {
  return dialog.status != Status.Finished 
    && dialog.status != Status.Cancelled
}

export interface DeleteGraphDialog extends Dialog {
  type: DialogType.DeleteGraph
  graphToDeleteIndex: number
}
