// ============================================================
// helpers.js — Pure utility helpers
// ============================================================

function formatDate(value) {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));
}

function formatDateOnly(value) {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

function formatCompactDate(value) {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
}

function formatItems(items) {
  if (!Array.isArray(items) || items.length === 0) return 'No items';
  return items.join(', ');
}

function normalizeItems(rawItems) {
  return rawItems.map((item) => item.trim()).filter(Boolean);
}

function parseNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeCsvValue(value) {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function createCsvContent(rows) {
  return rows.map((row) => row.map((value) => escapeCsvValue(value)).join(',')).join('\n');
}

function getCustomerFullText(customer) {
  return [customer.name, customer.address, customer.phone].filter(Boolean).join(' ');
}

function getOrderCustomer(order) {
  return state.data.customers.find((customer) => customer.id === order.customer_id) || null;
}

function getStatusLabel(status) {
  return status === STATUS.DELIVERED ? 'Delivered' : 'Pending';
}

function getOrderItemCount(order) {
  return Array.isArray(order.items) ? order.items.length : 0;
}

function getCustomerLocation(customer) {
  if (!customer) return null;
  const latitude = parseNumber(customer.latitude);
  const longitude = parseNumber(customer.longitude);
  if (latitude === null || longitude === null) return null;
  return [latitude, longitude];
}

function getTrickySpotLocation(spot) {
  const latitude = parseNumber(spot.latitude);
  const longitude = parseNumber(spot.longitude);
  if (latitude === null || longitude === null) return null;
  return [latitude, longitude];
}

function getCustomerDisplayName(customer) {
  return customer?.name || 'Unknown customer';
}

function getFriendlyErrorMessage(error, fallbackMessage = MESSAGES.LOAD_ERROR) {
  const message = error?.message || '';
  if (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('fetch')) {
    return MESSAGES.NO_INTERNET;
  }
  if (message.includes('Invalid login credentials')) {
    return MESSAGES.LOGIN_ERROR;
  }
  if (message.includes('team')) {
    return MESSAGES.NO_TEAM;
  }
  return fallbackMessage;
}

function groupOrdersByStatus(orders) {
  return {
    pending: orders.filter((order) => order.status === STATUS.PENDING),
    delivered: orders.filter((order) => order.status === STATUS.DELIVERED)
  };
}

function getLocationTargetConfig(target) {
  if (target === LOCATION_TARGETS.NEW_CUSTOMER) {
    return {
      title: 'Pick New Customer Location',
      subtitle: 'Tap anywhere on the map to set the customer location.',
      latInputId: 'newCustomerLatitude',
      lngInputId: 'newCustomerLongitude',
      previewTextId: 'newCustomerLocationPreviewText',
      previewMapId: 'newCustomerLocationPreviewMap',
      previewKey: 'newCustomer'
    };
  }

  if (target === LOCATION_TARGETS.CUSTOMER) {
    return {
      title: 'Pick Customer Location',
      subtitle: 'Tap anywhere on the map to set the customer location.',
      latInputId: 'customerLatitude',
      lngInputId: 'customerLongitude',
      previewTextId: 'customerLocationPreviewText',
      previewMapId: 'customerLocationPreviewMap',
      previewKey: 'customer'
    };
  }

  return {
    title: 'Pick Tricky Spot Location',
    subtitle: 'Tap anywhere on the map to set the tricky spot location.',
    latInputId: 'trickySpotLatitude',
    lngInputId: 'trickySpotLongitude',
    previewTextId: 'trickySpotLocationPreviewText',
    previewMapId: 'trickySpotLocationPreviewMap',
    previewKey: 'trickySpot'
  };
}

function getLocationCoordinatesFromInputs(target) {
  const config = getLocationTargetConfig(target);
  const latitude = parseNumber(elements[config.latInputId].value);
  const longitude = parseNumber(elements[config.lngInputId].value);
  if (latitude === null || longitude === null) return null;
  return [latitude, longitude];
}

function setLocationCoordinatesOnInputs(target, coordinates) {
  const config = getLocationTargetConfig(target);
  elements[config.latInputId].value = coordinates ? coordinates[0] : '';
  elements[config.lngInputId].value = coordinates ? coordinates[1] : '';
}

function getOrderPopupHtml(order) {
  const customer = getOrderCustomer(order);
  return `
    <div class="map-popup">
      <strong>${escapeHtml(customer?.name || 'Unknown customer')}</strong><br />
      <span>Status: ${escapeHtml(getStatusLabel(order.status))}</span><br />
      <span>Items: ${escapeHtml(formatItems(order.items))}</span><br />
      <span>Notes: ${escapeHtml(order.notes || 'No notes')}</span>
    </div>
  `;
}

function getTrickySpotPopupHtml(spot) {
  return `
    <div class="map-popup">
      <strong>${escapeHtml(spot.label)}</strong><br />
      <span>${escapeHtml(spot.notes || 'No notes')}</span>
    </div>
  `;
}

function isOnline() {
  return navigator.onLine;
}
