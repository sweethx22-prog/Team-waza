let requests = JSON.parse(localStorage.getItem('person-requests') || '[]');

function saveRequests() {
  localStorage.setItem('person-requests', JSON.stringify(requests));
}

function getTypeClass(type) {
  if (type === 'Doctor') return 'doctor';
  if (type === 'Traslado') return 'traslado';
  return 'medicina';
}

function generateCode() {
  return `MED-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function renderLists() {
  const pending = requests.filter((item) => item.status !== 'Atendida' && item.status !== 'Entregado');
  const medicine = requests.filter((item) => item.type === 'Medicina');

  document.getElementById('pending-list').innerHTML = pending.length === 0
    ? '<p class="small">No hay solicitudes pendientes.</p>'
    : pending.map((item) => `
        <div class="item">
          <strong>${item.name}</strong> · ${item.colonia}<br>
          <span class="chip ${getTypeClass(item.type)}">${item.type}</span>
          <div class="small">${item.detail}</div>
          <div class="small">📍 ${item.street || 'Sin calle registrada'}</div>
          <div class="actions">
            <button onclick="acceptRequest('${item.id}')">Aceptar</button>
            <button class="secondary-btn" onclick="markVisited('${item.id}')">Marcar visitada/trasladada</button>
            ${item.type === 'Medicina' ? `<button class="secondary-btn" onclick="generateMedicineCode('${item.id}')">Generar código</button>` : ''}
          </div>
        </div>
      `).join('');

  document.getElementById('medicine-list').innerHTML = medicine.length === 0
    ? '<p class="small">No hay solicitudes de medicina.</p>'
    : medicine.map((item) => `
        <div class="item">
          <strong>${item.name}</strong><br>
          <div class="small">${item.detail}</div>
          <span class="chip ${item.status === 'Entregado' ? 'done' : 'pending'}">${item.status || 'Pendiente'}</span>
          ${item.code ? `<div class="map-box">Código: ${item.code}</div>` : ''}
          <div class="actions">
            <button onclick="markDelivered('${item.id}')">Marcar entregado</button>
          </div>
        </div>
      `).join('');
}

window.acceptRequest = function(id) {
  const item = requests.find((entry) => String(entry.id) === String(id));
  if (!item) return;
  item.status = 'Aceptada';
  saveRequests();
  renderLists();
  alert('Solicitud aceptada');
};

window.markVisited = function(id) {
  const item = requests.find((entry) => String(entry.id) === String(id));
  if (!item) return;
  item.status = 'Atendida';
  saveRequests();
  renderLists();
  alert('Marcado como visitada o trasladada');
};

window.generateMedicineCode = function(id) {
  const item = requests.find((entry) => String(entry.id) === String(id));
  if (!item) return;
  item.code = generateCode();
  item.status = 'Pendiente entrega';
  saveRequests();
  renderLists();
  alert(`Código generado: ${item.code}`);
};

window.markDelivered = function(id) {
  const item = requests.find((entry) => String(entry.id) === String(id));
  if (!item) return;
  item.status = 'Entregado';
  saveRequests();
  renderLists();
  alert('Medicamento marcado como entregado');
};

renderLists();
