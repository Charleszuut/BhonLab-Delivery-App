// ============================================================
// elements.js — Cached DOM references
// ============================================================

const elements = {};

function cacheElements() {
  const elementIds = [
    'authShell', 'appShell', 'loadingOverlay', 'loadingText', 'toastContainer', 'loginForm', 'loginEmail',
    'loginPassword', 'rememberMe', 'loginButton', 'loginStatusBanner', 'sidebarUserName', 'sidebarTeamName',
    'connectionStatusBanner', 'sidebarDashboardCount', 'sidebarOrdersCount', 'sidebarCustomersCount',
    'sidebarTrickyCount', 'signOutButton', 'headerTitle', 'headerSubtitle', 'refreshButton',
    'quickAddOrderButton', 'openMapButton', 'dashboardAddOrderButton', 'dashboardCustomersButton',
    'offlineBanner', 'pendingOrdersValue', 'pendingOrdersMeta', 'customersValue', 'trickySpotsValue',
    'deliveredOrdersValue', 'expiredOrdersValue', 'dashboardPendingList', 'dashboardMiniMap', 'ordersList',
    'orderFilterRow', 'orderForm', 'orderEditBanner', 'orderCustomerSearch', 'customerSearchResults',
    'selectedCustomerSummary', 'useNewCustomerToggle', 'newCustomerFields', 'newCustomerName', 'newCustomerAddress',
    'newCustomerPhone', 'newCustomerLatitude', 'newCustomerLongitude', 'newCustomerPickMapButton',
    'newCustomerLocationPreview', 'newCustomerLocationPreviewText', 'newCustomerLocationPreviewMap', 'orderItemsEditor',
    'addItemButton', 'orderNotes', 'saveOrderButton', 'cancelOrderEditButton', 'customersList', 'customerForm',
    'customerEditBanner', 'customerName', 'customerAddress', 'customerPhone', 'customerLatitude', 'customerLongitude',
    'customerPickMapButton', 'customerLocationPreview', 'customerLocationPreviewText', 'customerLocationPreviewMap',
    'saveCustomerButton', 'cancelCustomerEditButton', 'customerHistorySubtitle', 'customerHistoryList',
    'clearCustomerSelectionButton', 'fullMap', 'trickySpotsList', 'trickySpotForm', 'trickySpotEditBanner',
    'trickySpotLabel', 'trickySpotNotes', 'trickySpotLatitude', 'trickySpotLongitude', 'trickySpotPickMapButton',
    'trickySpotLocationPreview', 'trickySpotLocationPreviewText', 'trickySpotLocationPreviewMap', 'saveTrickySpotButton',
    'cancelTrickySpotEditButton', 'mobileTabbar', 'mapPickerOverlay', 'mapPickerTitle', 'mapPickerSubtitle',
    'mapPickerCancelButton', 'mapPickerConfirmButton', 'pinPickerMap'
  ];

  elementIds.forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}
