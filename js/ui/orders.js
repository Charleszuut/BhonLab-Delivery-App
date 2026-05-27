// ============================================================
// ui/orders.js — Orders screen render and form logic
// ============================================================

function renderOrders() {
  renderOrderFilterButtons();
  renderOrdersList();
  renderOrderCustomerSearch();
  renderOrderEditingState();
}

function renderOrderFilterButtons() {
  const buttons = elements.orderFilterRow.querySelectorAll('[data-order-filter]');
  buttons.forEach((button) => {
    const isActive = button.dataset.orderFilter === state.ui.orderFilter;
    button.classList.toggle('is-active', isActive);
  });
}

function getFilteredOrders() {
  const filter = state.ui.orderFilter;
  if (filter === ORDER_FILTERS.ALL) return state.data.orders;
  return state.data.orders.filter((order) => order.status === filter);
}

function renderOrdersList() {
  const orders = getFilteredOrders();
  if (orders.length === 0) {
    elements.ordersList.innerHTML = '<div class="empty-state">No orders match this view yet.</div>';
    return;
  }

  elements.ordersList.innerHTML = orders.map((order) => renderOrderCard(order)).join('');
}

function renderOrderCard(order) {
  const customer = getOrderCustomer(order);
  const customerName = getCustomerDisplayName(customer);
  const statusClass = order.status === STATUS.DELIVERED ? 'delivered' : 'pending';
  const statusLabel = getStatusLabel(order.status);
  const itemChips = Array.isArray(order.items) && order.items.length > 0
    ? order.items.map((item) => `<span class="item-chip">${escapeHtml(item)}</span>`).join('')
    : '<span class="item-chip">No items</span>';
  const notesHtml = order.notes
    ? `<p class="order-notes">📝 ${escapeHtml(order.notes)}</p>`
    : '';
  const deliveredHtml = order.delivered_at
    ? `<p class="small-copy">Delivered: ${escapeHtml(formatDate(order.delivered_at))}</p>`
    : '';
  const deliverButton = order.status === STATUS.PENDING
    ? `<button class="button button-primary button-small" data-action="mark-delivered" data-id="${order.id}" type="button">Mark as Delivered</button>`
    : '';

  return `
    <article class="order-card">
      <div class="card-title-row">
        <div>
          <h4>${escapeHtml(customerName)}</h4>
          <p class="small-copy">${escapeHtml(formatDate(order.created_at))}</p>
        </div>
        <span class="badge ${statusClass}">${escapeHtml(statusLabel)}</span>
      </div>
      <div class="items-chip-row">${itemChips}</div>
      ${notesHtml}
      ${deliveredHtml}
      <div class="card-actions">
        ${deliverButton}
        <button class="button button-ghost button-small" data-action="select-customer" data-id="${customer?.id || ''}" type="button">View Customer</button>
        <button class="button button-ghost button-small" data-action="edit-order" data-id="${order.id}" type="button">Edit</button>
        <button class="button button-danger button-small" data-action="delete-order" data-id="${order.id}" type="button">Delete</button>
      </div>
    </article>
  `;
}

function renderOrderCustomerSearch() {
  const query = elements.orderCustomerSearch.value.trim().toLowerCase();
  const matches = query
    ? state.data.customers.filter((customer) => getCustomerFullText(customer).toLowerCase().includes(query)).slice(0, 8)
    : [];

  if (!query) {
    elements.customerSearchResults.innerHTML = '<div class="search-hint">Type a name, address, or phone to find a customer.</div>';
  } else if (matches.length === 0) {
    elements.customerSearchResults.innerHTML = '<div class="empty-state">No matching customer. Tick “Create a new customer” to add one.</div>';
  } else {
    elements.customerSearchResults.innerHTML = matches.map((customer) => {
      const isSelected = customer.id === state.ui.selectedOrderCustomerId;
      return `
        <button class="search-result ${isSelected ? 'is-selected' : ''}" data-action="pick-order-customer" data-id="${customer.id}" type="button">
          <strong>${escapeHtml(customer.name)}</strong>
          <span>${escapeHtml(customer.address)}${customer.phone ? ` · ${escapeHtml(customer.phone)}` : ''}</span>
        </button>
      `;
    }).join('');
  }

  renderSelectedOrderCustomerSummary();
}

function renderSelectedOrderCustomerSummary() {
  const customer = state.data.customers.find((entry) => entry.id === state.ui.selectedOrderCustomerId) || null;
  if (!customer) {
    elements.selectedCustomerSummary.classList.add('hidden');
    elements.selectedCustomerSummary.innerHTML = '';
    return;
  }

  elements.selectedCustomerSummary.classList.remove('hidden');
  elements.selectedCustomerSummary.innerHTML = `
    <strong>${escapeHtml(customer.name)}</strong>
    <div class="small-copy">${escapeHtml(customer.address)}</div>
    <div class="small-copy">${escapeHtml(customer.phone || 'No phone')}</div>
    <div class="small-copy">${customer.latitude && customer.longitude ? `Pin: ${escapeHtml(customer.latitude)}, ${escapeHtml(customer.longitude)}` : 'No pin yet'}</div>
  `;
}

function renderOrderEditingState() {
  const isEditing = Boolean(state.ui.editingOrderId);
  resetFormBanner(elements.orderEditBanner, isEditing);
  elements.saveOrderButton.textContent = isEditing ? 'Update order' : 'Save order';
  elements.cancelOrderEditButton.classList.toggle('hidden', !isEditing);
}

function renderOrderItemsEditor(initialItems = [DEFAULT_ORDER_ITEM]) {
  const items = initialItems.length > 0 ? initialItems : [DEFAULT_ORDER_ITEM];
  elements.orderItemsEditor.innerHTML = items.map((item, index) => renderOrderItemRow(item, index)).join('');
}

function renderOrderItemRow(value, index) {
  return `
    <div class="item-row" data-item-row="${index}">
      <input type="text" class="order-item-input" data-item-index="${index}" value="${escapeHtml(value)}" placeholder="${NEW_ORDER_ITEM_PLACEHOLDER}" />
      <button type="button" class="button button-danger button-small" data-action="remove-order-item" data-index="${index}">Remove</button>
    </div>
  `;
}

function collectOrderItems() {
  const itemInputs = Array.from(elements.orderItemsEditor.querySelectorAll('.order-item-input'));
  return normalizeItems(itemInputs.map((input) => input.value));
}

function resetOrderForm() {
  state.ui.editingOrderId = null;
  state.ui.selectedOrderCustomerId = null;
  elements.orderCustomerSearch.value = '';
  elements.useNewCustomerToggle.checked = false;
  elements.newCustomerFields.classList.add('hidden');
  elements.newCustomerName.value = '';
  elements.newCustomerAddress.value = '';
  elements.newCustomerPhone.value = '';
  elements.newCustomerLatitude.value = '';
  elements.newCustomerLongitude.value = '';
  elements.orderNotes.value = '';
  renderOrderItemsEditor([DEFAULT_ORDER_ITEM]);
  renderSelectedOrderCustomerSummary();
  renderOrderEditingState();
  renderLocationPreview(LOCATION_TARGETS.NEW_CUSTOMER);
  renderOrderCustomerSearch();
}

function populateOrderForm(order) {
  const customer = getOrderCustomer(order);
  state.ui.editingOrderId = order.id;
  state.ui.selectedOrderCustomerId = customer?.id || null;
  elements.orderCustomerSearch.value = customer?.name || '';
  elements.useNewCustomerToggle.checked = false;
  elements.newCustomerFields.classList.add('hidden');
  elements.newCustomerName.value = '';
  elements.newCustomerAddress.value = '';
  elements.newCustomerPhone.value = '';
  elements.newCustomerLatitude.value = '';
  elements.newCustomerLongitude.value = '';
  elements.orderNotes.value = order.notes || '';
  renderOrderItemsEditor(Array.isArray(order.items) && order.items.length > 0 ? order.items : [DEFAULT_ORDER_ITEM]);
  renderSelectedOrderCustomerSummary();
  renderOrderEditingState();
  elements.saveOrderButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function handleOrderSubmit() {
  const items = collectOrderItems().filter((item) => item.trim() !== '');
  if (items.length === 0) {
    showToast('Please add at least one item.', MESSAGE_TYPES.WARNING, 'Missing items');
    return;
  }

  const hasSelectedCustomer = Boolean(state.ui.selectedOrderCustomerId);
  const useNewCustomer = elements.useNewCustomerToggle.checked;
  if (!hasSelectedCustomer && !useNewCustomer) {
    showToast('Please pick a customer or choose to create a new one.', MESSAGE_TYPES.WARNING, 'Order needs a customer');
    return;
  }

  setLoading(true, state.ui.editingOrderId ? 'Updating order...' : 'Saving order...');
  try {
    let customerId = state.ui.selectedOrderCustomerId;

    if (useNewCustomer) {
      const customerName = elements.newCustomerName.value.trim();
      const customerAddress = elements.newCustomerAddress.value.trim();
      const customerPhone = elements.newCustomerPhone.value.trim();
      const latitude = parseNumber(elements.newCustomerLatitude.value);
      const longitude = parseNumber(elements.newCustomerLongitude.value);

      if (!customerName || !customerAddress) {
        showToast('New customer needs a name and address.', MESSAGE_TYPES.WARNING, 'Missing customer info');
        return;
      }

      const newCustomer = await insertCustomer({
        name: customerName,
        address: customerAddress,
        phone: customerPhone,
        latitude,
        longitude
      });
      customerId = newCustomer.id;

      if (!customerId) {
        showToast('We could not create the new customer. Please try again.', MESSAGE_TYPES.ERROR, 'Customer not created');
        return;
      }
    }

    if (!customerId) {
      showToast('Please choose a saved customer or finish creating the new one before saving.', MESSAGE_TYPES.WARNING, 'Order needs a customer');
      return;
    }

    const existingOrder = state.ui.editingOrderId ? state.data.orders.find((order) => order.id === state.ui.editingOrderId) : null;
    const orderPayload = {
      customer_id: customerId,
      items,
      notes: elements.orderNotes.value.trim(),
      status: existingOrder?.status || STATUS.PENDING,
      delivered_at: existingOrder?.delivered_at || null
    };

    if (state.ui.editingOrderId) {
      await updateOrder(state.ui.editingOrderId, orderPayload);
      state.ui.editingOrderId = null;
    } else {
      await insertOrder(orderPayload);
    }

    showToast('Order saved.', MESSAGE_TYPES.SUCCESS, 'Done');
    resetOrderForm();
    await loadAppData();
  } catch (error) {
    showGlobalError(error, SAVE_ERROR_MESSAGE, 'Order not saved');
  } finally {
    setLoading(false);
  }
}

async function handleMarkDelivered(orderId) {
  if (!orderId) return;
  setLoading(true, 'Marking order delivered...');
  try {
    await markOrderDelivered(orderId);
    showToast('Order marked as delivered.', MESSAGE_TYPES.SUCCESS, 'Updated');
    await loadAppData();
  } catch (error) {
    showGlobalError(error, SAVE_ERROR_MESSAGE, 'Could not update order');
  } finally {
    setLoading(false);
  }
}

function handleEditOrder(orderId) {
  const order = state.data.orders.find((entry) => entry.id === orderId);
  if (!order) return;
  populateOrderForm(order);
  setCurrentTab(TABS.ORDERS);
}

async function handleDeleteOrder(orderId) {
  if (!orderId) return;
  const confirmed = window.confirm('Delete this order?');
  if (!confirmed) return;
  setLoading(true, 'Deleting order...');
  try {
    await deleteOrders([orderId]);
    showToast('Order deleted.', MESSAGE_TYPES.SUCCESS, 'Deleted');
    await loadAppData();
  } catch (error) {
    showGlobalError(error, SAVE_ERROR_MESSAGE, 'Could not delete order');
  } finally {
    setLoading(false);
  }
}
