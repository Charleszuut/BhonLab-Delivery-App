// ============================================================
// ui/customers.js — Customers screen render and form logic
// ============================================================

function renderCustomers() {
  renderCustomersList();
  renderCustomerEditingState();
  renderLocationPreview(LOCATION_TARGETS.NEW_CUSTOMER);
  renderLocationPreview(LOCATION_TARGETS.CUSTOMER);
  renderCustomerHistory();
}

function renderCustomersList() {
  const query = (state.ui.customerSearchQuery || '').trim().toLowerCase();
  const customers = query
    ? state.data.customers.filter((customer) => getCustomerFullText(customer).toLowerCase().includes(query))
    : state.data.customers;

  if (customers.length === 0) {
    elements.customersList.innerHTML = '<div class="empty-state">No customers saved yet. Add the first household here.</div>';
    return;
  }

  elements.customersList.innerHTML = customers.map((customer) => renderCustomerCard(customer)).join('');
}

function renderCustomerCard(customer) {
  const customerOrders = state.data.orders.filter((o) => o.customer_id === customer.id);
  const orderCount = customerOrders.length;
  const lastOrder = customerOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  const lastOrderText = lastOrder ? `Last: ${formatCompactDate(lastOrder.created_at)}` : null;
  const isPinned = Boolean(customer.latitude && customer.longitude);

  const orderCountBadge = `<span class="badge neutral">${orderCount > 0 ? `${orderCount} order${orderCount === 1 ? '' : 's'}` : 'No orders yet'}</span>`;
  const lastOrderBadge = lastOrderText ? `<span class="small-copy muted-text">${escapeHtml(lastOrderText)}</span>` : '';
  const phoneHtml = customer.phone ? `<p class="small-copy">📞 ${escapeHtml(customer.phone)}</p>` : '';
  const viewOnMapButton = isPinned
    ? `<button class="button button-ghost button-small" data-action="view-on-map" data-id="${customer.id}" type="button">View on Map</button>`
    : '';

  return `
    <article class="customer-card ${customer.id === state.ui.selectedCustomerHistoryId ? 'is-selected' : ''}">
      <div class="card-title-row">
        <div>
          <h4>${escapeHtml(customer.name)}</h4>
          <p class="small-copy">📍 ${escapeHtml(customer.address)}</p>
          ${phoneHtml}
        </div>
        <div class="badge-col">
          ${orderCountBadge}
          ${lastOrderBadge}
        </div>
      </div>
      <div class="meta-row">
        <span class="badge neutral">${isPinned ? 'Pinned' : 'No pin yet'}</span>
        <span class="badge neutral">${escapeHtml(formatDateOnly(customer.created_at))}</span>
      </div>
      <div class="card-actions">
        <button class="button button-primary button-small" data-action="quick-add-order" data-id="${customer.id}" type="button">New Order</button>
        ${viewOnMapButton}
        <button class="button button-ghost button-small" data-action="edit-customer" data-id="${customer.id}" type="button">Edit</button>
        <button class="button button-danger button-small" data-action="delete-customer" data-id="${customer.id}" type="button">Delete</button>
      </div>
    </article>
  `;
}

function renderCustomerEditingState() {
  const isEditing = Boolean(state.ui.editingCustomerId);
  resetFormBanner(elements.customerEditBanner, isEditing);
  elements.saveCustomerButton.textContent = isEditing ? 'Update customer' : 'Save customer';
  elements.cancelCustomerEditButton.classList.toggle('hidden', !isEditing);
}

function resetCustomerForm() {
  state.ui.editingCustomerId = null;
  elements.customerName.value = '';
  elements.customerAddress.value = '';
  elements.customerPhone.value = '';
  elements.customerLatitude.value = '';
  elements.customerLongitude.value = '';
  renderCustomerEditingState();
  renderLocationPreview(LOCATION_TARGETS.CUSTOMER);
}

function populateCustomerForm(customer) {
  state.ui.editingCustomerId = customer.id;
  elements.customerName.value = customer.name || '';
  elements.customerAddress.value = customer.address || '';
  elements.customerPhone.value = customer.phone || '';
  elements.customerLatitude.value = customer.latitude ?? '';
  elements.customerLongitude.value = customer.longitude ?? '';
  renderCustomerEditingState();
  renderLocationPreview(LOCATION_TARGETS.CUSTOMER);
  elements.customerName.focus();
}

function renderCustomerHistory() {
  const customer = state.data.customers.find((entry) => entry.id === state.ui.selectedCustomerHistoryId) || null;
  if (!customer) {
    elements.customerHistorySubtitle.textContent = 'Click a customer to view their orders.';
    elements.customerHistoryList.innerHTML = '<div class="empty-state">No customer selected.</div>';
    return;
  }

  const customerOrders = state.data.orders.filter((order) => order.customer_id === customer.id);
  elements.customerHistorySubtitle.textContent = `${customer.name} has ${customerOrders.length} order${customerOrders.length === 1 ? '' : 's'}.`;

  if (customerOrders.length === 0) {
    elements.customerHistoryList.innerHTML = '<div class="empty-state">This customer has no orders yet.</div>';
    return;
  }

  elements.customerHistoryList.innerHTML = customerOrders.map((order) => `
    <div class="history-order">
      <strong>${escapeHtml(formatItems(order.items))}</strong>
      <div class="small-copy">${escapeHtml(getStatusLabel(order.status))} · ${escapeHtml(formatDate(order.created_at))}</div>
      <div class="small-copy">${escapeHtml(order.notes || 'No notes')}</div>
    </div>
  `).join('');
}

async function handleCustomerSubmit() {
  const payload = {
    name: elements.customerName.value.trim(),
    address: elements.customerAddress.value.trim(),
    phone: elements.customerPhone.value.trim(),
    latitude: parseNumber(elements.customerLatitude.value),
    longitude: parseNumber(elements.customerLongitude.value)
  };

  if (!payload.name || !payload.address) {
    showToast('Customer name and address are required.', MESSAGE_TYPES.WARNING, 'Missing fields');
    return;
  }

  if (state.ui.editingCustomerId) {
    if (customerNameExists(payload.name, state.ui.editingCustomerId)) {
      showToast('That customer name already exists. Please use a different name.', MESSAGE_TYPES.WARNING, 'Duplicate name');
      return;
    }
  } else if (customerNameExists(payload.name)) {
    showToast('That customer name already exists. Please use a different name.', MESSAGE_TYPES.WARNING, 'Duplicate name');
    return;
  }

  setLoading(true, state.ui.editingCustomerId ? 'Updating customer...' : 'Saving customer...');
  try {
    if (state.ui.editingCustomerId) {
      await updateCustomer(state.ui.editingCustomerId, payload);
      showToast('Customer updated.', MESSAGE_TYPES.SUCCESS, 'Done');
    } else {
      await insertCustomer(payload);
      showToast('Customer saved.', MESSAGE_TYPES.SUCCESS, 'Done');
    }
    resetCustomerForm();
    await loadAppData();
  } catch (error) {
    showGlobalError(error, SAVE_ERROR_MESSAGE, 'Customer not saved');
  } finally {
    setLoading(false);
  }
}

function handleEditCustomer(customerId) {
  const customer = state.data.customers.find((entry) => entry.id === customerId);
  if (!customer) return;
  populateCustomerForm(customer);
  setCurrentTab(TABS.CUSTOMERS);
}

async function handleDeleteCustomer(customerId) {
  if (!customerId) return;
  const confirmed = window.confirm('Delete this customer? Existing orders will be removed by the database cascade.');
  if (!confirmed) return;
  setLoading(true, 'Deleting customer...');
  try {
    await deleteCustomer(customerId);
    if (state.ui.selectedCustomerHistoryId === customerId) {
      state.ui.selectedCustomerHistoryId = null;
    }
    showToast('Customer deleted.', MESSAGE_TYPES.SUCCESS, 'Deleted');
    await loadAppData();
  } catch (error) {
    showGlobalError(error, SAVE_ERROR_MESSAGE, 'Could not delete customer');
  } finally {
    setLoading(false);
  }
}

function handleSelectCustomer(customerId) {
  const customer = state.data.customers.find((entry) => entry.id === customerId);
  if (!customer) return;
  state.ui.selectedCustomerHistoryId = customerId;
  setCurrentTab(TABS.CUSTOMERS);
  renderCustomers();
  showToast(`Showing orders for ${customer.name}.`, MESSAGE_TYPES.INFO, 'Customer selected');
}

function handleQuickAddOrder(customerId) {
  const customer = state.data.customers.find((entry) => entry.id === customerId);
  if (!customer) return;
  state.ui.selectedOrderCustomerId = customer.id;
  state.ui.editingOrderId = null;
  state.ui.orderFilter = ORDER_FILTERS.PENDING;
  setCurrentTab(TABS.ORDERS);
  elements.orderCustomerSearch.value = customer.name || '';
  elements.useNewCustomerToggle.checked = false;
  elements.newCustomerFields.classList.add('hidden');
  renderOrderCustomerSearch();
  renderSelectedOrderCustomerSummary();
}

function handleViewCustomerOnMap(customerId) {
  const customer = state.data.customers.find((entry) => entry.id === customerId);
  if (!customer) return;
  const location = getCustomerLocation(customer);
  if (!location) return;
  setCurrentTab(TABS.MAP);
  window.requestAnimationFrame(() => {
    if (state.map.instance) {
      state.map.instance.setView(location, MAP_DEFAULT_ZOOM + 1, { animate: true });
    }
  });
}
