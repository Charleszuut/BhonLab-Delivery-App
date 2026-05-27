// ============================================================
// config.js — App constants and Supabase credentials
// ============================================================

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const MAP_DEFAULT_CENTER = [7.1017231, 125.5120289];
const MAP_DEFAULT_ZOOM = 16;
const MAP_PREVIEW_ZOOM = 17;
const MAP_PICKER_ZOOM = 18;

const ORDER_EXPIRY_DAYS = 30;
const MAX_TOASTS = 4;
const TOAST_DURATION_MS = 3600;
const EXPORT_FILENAME_PREFIX = 'bhonlab-expired-orders';

const STATUS = {
  PENDING: 'pending',
  DELIVERED: 'delivered'
};

const TABS = {
  DASHBOARD: 'dashboard',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  MAP: 'map',
  TRICKY_SPOTS: 'tricky-spots'
};

const ORDER_FILTERS = {
  PENDING: 'pending',
  DELIVERED: 'delivered',
  ALL: 'all'
};

const LOCATION_TARGETS = {
  NEW_CUSTOMER: 'new-customer',
  CUSTOMER: 'customer',
  TRICKY_SPOT: 'tricky-spot'
};

const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

const MAP_TILES = {
  URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; OpenStreetMap contributors'
};

const STORAGE_KEYS = {
  AUTH_MODE: 'bhonlab-auth-mode'
};

const MESSAGES = {
  NO_INTERNET: 'No internet connection. Please reconnect and try again.',
  SAVE_ERROR: 'We could not save your changes. Please try again.',
  LOAD_ERROR: 'We could not load data right now. Please try again.',
  LOGIN_ERROR: 'Unable to sign in. Please check your email and password.',
  NO_TEAM: 'Your account is not linked to a team. Ask the owner to add you.',
  AUTO_EXPORT: 'Auto-export finished for old orders.',
  LOADING_DEFAULT: 'Loading BhonLab...',
  STARTUP_CONFIG: 'Replace the placeholder URL and anon key before signing in.',
  SESSION_RESTORED: 'Welcome back.',
  SIGNED_IN: 'Welcome back to BhonLab.',
  OFFLINE: 'You are offline right now.',
  ONLINE: 'Connection restored.',
  NOT_SIGNED_IN: 'Sign in first to refresh data.',
  NEED_CUSTOMER: 'Please pick a customer or choose to create a new one.',
  MISSING_ORDER_ITEMS: 'Please add at least one item.',
  MISSING_CUSTOMER_INFO: 'New customer needs a name and address.',
  MISSING_CUSTOMER_FIELDS: 'Customer name and address are required.',
  MISSING_SPOT_DETAILS: 'Please add a label and pin location.',
  SIGN_OUT_FAILED: 'We could not sign you out.',
  ORDER_DELETED: 'Order deleted.',
  CUSTOMER_DELETED: 'Customer deleted.',
  SPOT_DELETED: 'Tricky spot deleted.',
  ORDER_UPDATED: 'Order marked as delivered.',
  DATA_REFRESHED: 'Data refreshed.',
  REFRESH_COMPLETE: 'Refresh complete',
  CONFIGURE_SUPABASE: 'Configure Supabase'
};

const APP_TITLE_BY_TAB = {
  [TABS.DASHBOARD]: 'Dashboard',
  [TABS.ORDERS]: 'Orders',
  [TABS.CUSTOMERS]: 'Customers',
  [TABS.MAP]: 'Map',
  [TABS.TRICKY_SPOTS]: 'Tricky Spots'
};

const HEADER_SUBTITLES = {
  [TABS.DASHBOARD]: 'Your daily order snapshot',
  [TABS.ORDERS]: 'Manage orders and delivery status',
  [TABS.CUSTOMERS]: 'Keep customer records ready',
  [TABS.MAP]: 'See pins and delivery paths',
  [TABS.TRICKY_SPOTS]: 'Mark spots that need extra care'
};

const DEFAULT_ORDER_ITEM = '';
const NEW_ORDER_ITEM_PLACEHOLDER = 'Eggs, rice, cooking oil...';
