/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { FC, ReactElement, createContext, useContext, useReducer } from 'react';


interface Notification {
  id?: any;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface Action {
  type: 'ADD_NOTIFICATION' | 'REMOVE_NOTIFICATION';
  payload: Notification | any
}

const initialState: Notification[] = [];


const notificationReducer = (state: Notification[], action: Action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return [...state, {
        id: new Date().getTime(),
        message: action.payload.message,
        type: action.payload.type
      }];
    case "REMOVE_NOTIFICATION":
      return state.filter((notification) => notification.id !== action.payload.id);
    default:
      return state;
  }
};

interface NotificationContext {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContext>({
  notifications: [],
  addNotification: (notification: Notification) => { },
  removeNotification: (id: string) => { }
});

export const useNotification = () => {
  return useContext(NotificationContext);
};

interface Props {
  children: ReactElement
}

const NotificationProvider: FC<Props> = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, initialState)

  const addNotification = (notification: Notification) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: { id } });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
