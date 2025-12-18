import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,
  theme: "light",
  notifications: [],

  modals: {
    userModal: { open: false, mode: "create" },
    vendorModal: { open: false, mode: "create" },
    eventModal: { open: false, mode: "create" },
    pubModal: { open: false, mode: "create" },
    promotionModal: { open: false, mode: "create" },
    notificationModal: { open: false, mode: "create" },
  },

  screens: {
    counsellorScreen: { open: false, mode: "view" },
    jobScreen: { open: false, mode: "view" },
    studentScreen: { open: false, mode: "view" },
    questionnaireScreen: {open: false, mode: 'view'},
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },

    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now().toString(),
        ...action.payload,
      });
    },

    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },

    openModal: (state, action) => {
      const { modal, mode, data } = action.payload;
      state.modals[modal] = { open: true, mode, data };
    },

    closeModal: (state, action) => {
      const modal = action.payload;
      state.modals[modal] = { open: false, mode: "create", data: undefined };
    },

    openScreen: (state, action) => {
      const { screen, mode = "create", data } = action.payload;
      state.screens[screen] = { open: true, mode, data };
    },

    changeViewMode: (state, action) => {
      const { screen, mode = "view", data = undefined } = action.payload;
      state.screens[screen] = { open: false, mode, data };
    },

    closeScreen: (state, action) => {
      const screen = action.payload;
      state.screens[screen] = { open: false, mode: "view", data: undefined };
    },

    closeAllScreens: (state) => {
      Object.keys(state.screens).forEach((key) => {
        state.screens[key] = { open: false, mode: "create", data: undefined };
      });
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  openModal,
  closeModal,
  openScreen,
  closeScreen,
  closeAllScreens,
  changeViewMode,
} = uiSlice.actions;

export default uiSlice.reducer;
