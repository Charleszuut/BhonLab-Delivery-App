// ============================================================
// state.js — Shared application state
// ============================================================

const state = {
  user: null,
  teamId: null,
  currentTab: TABS.DASHBOARD,
  authStorageMode: window.localStorage.getItem(STORAGE_KEYS.AUTH_MODE) || 'local',
  ui: {
    rememberMe: true,
    orderFilter: ORDER_FILTERS.PENDING,
    selectedCustomerId: null,
    selectedCustomerHistoryId: null,
    editingCustomerId: null,
    editingTrickySpotId: null,
    editingOrderId: null,
    selectedOrderCustomerId: null,
    lastExpiredExportCount: 0,
    mapPicker: {
      active: false,
      target: null,
      coordinates: null
    }
  },
  map: {
    instance: null,
    miniInstance: null,
    previewMaps: {
      newCustomer: null,
      customer: null,
      trickySpot: null
    },
    previewMarkers: {
      newCustomer: null,
      customer: null,
      trickySpot: null
    },
    pinPickerMap: null,
    pinPickerMarker: null,
    layers: {
      dashboard: {
        orders: null,
        trickySpots: null
      },
      full: {
        orders: null,
        trickySpots: null
      }
    }
  },
  data: {
    orders: [],
    customers: [],
    trickySpots: []
  }
};
