export type ActionLog = {
  time: number;
  widgetId: string;
  actionType: string;
  payload?: any;
  error?: any;
};

export const actionLogs: ActionLog[] = [];

export function logAction(entry: ActionLog) {
  actionLogs.push(entry);
}
