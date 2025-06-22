export interface Todo {
  id: string;
  userId: string;
  tabId: string;
  title: string;
  content: string;
  completed: boolean;
  notify: boolean;
  notifyAt: Date | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
