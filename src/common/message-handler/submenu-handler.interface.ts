export interface SubmenuHandler {
  handleMessage(message: any): Promise<void>;
}
