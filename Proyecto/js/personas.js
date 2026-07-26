const form = document.getElementById('person-form');
const requestList = document.getElementById('request-list');
const medicinePanel = document.getElementById('medicine-panel');

let requests = JSON.parse(localStorage.getItem('person-requests') || '[]');

function saveRequests() {
  localStorage.setItem('person-requests', JSON.stringify(requests));
}

function getTypeClass(type) {
  if (type === 'Doctor') return 'doctor';
  if (type === 'Traslado') return 'traslado';
  return 'medicina';
}

function renderRequests() {
  if (requests.length === 0) {
    requestList.innerHTML = '<p class="small">No hay solicitudes registradas todavía.</p>';
    return;
  }

  requestList.innerHTML = requests.map((item) => `
    <div class="item">
      <strong>${item.name}</strong> · ${item.colonia}<br>
      <span class="chip ${getTypeClass(item.type)}">${item.type}</span>
      <div class="small">${item.detail}</div>
      ${item.street ? `<div class="map-box">📍 ${item.street}</div>` : ''}
      ${item.photoData ? `<img class="photo-preview" src="${item.photoData}" alt="Foto de la solicitud" />` : ''}
      <div class="actions">
        <button onclick="markAsVisited(${item.id})">Marcar como atendida</button>
        <button class="danger-btn" onclick="deleteRequest(${item.id})">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function renderMedicinePanel() {
  const medicineRequests = requests.filter((item) => item.type === 'Medicina');
  if (medicineRequests.length === 0) {
    medicinePanel.innerHTML = '<p class="small">No hay solicitudes de medicina todavía.</p>';
    return;
  }

  medicinePanel.innerHTML = medicineRequests.map((item) => `
    <div class="item">
      <strong>${item.name}</strong><br>
      <div class="small">${item.detail}</div>
      <span class="chip ${item.status === 'Entregado' ? 'done' : 'pending'}">${item.status || 'Pendiente'}</span>
      ${item.code ? `<div class="map-box">Código: ${item.code}</div>` : ''}
    </div>
  `).join('');
}

window.markAsVisited = function(id) {
  const item = requests.find((entry) => entry.id === id);
  if (!item) return;
  item.status = 'Atendida';
  saveRequests();
  renderRequests();
  renderMedicinePanel();
};

window.deleteRequest = function(id) {
  requests = requests.filter((entry) => entry.id !== id);
  saveRequests();
  renderRequests();
  renderMedicinePanel();
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const photoInput = document.getElementById('photo');
  let photoData = '';

  if (photoInput.files && photoInput.files[0]) {
    photoData = await readFileAsDataURL(photoInput.files[0]);
  }

  const newRequest = {
    id: Date.now(),
    name: document.getElementById('name').value.trim(),
    colonia: document.getElementById('colonia').value.trim(),
    type: document.getElementById('type').value,
    detail: document.getElementById('detail').value.trim(),
    street: document.getElementById('street').value.trim(),
    photoData,
    status: 'Pendiente',
    code: document.getElementById('type').value === 'Medicina' ? `MED-${Math.random().toString(36).slice(2, 7).toUpperCase()}` : ''
  };

  requests.unshift(newRequest);
  saveRequests();
  renderRequests();
  renderMedicinePanel();
  form.reset();
  alert(`Solicitud guardada${newRequest.code ? ` con código ${newRequest.code}` : ''}`);
});

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

renderRequests();
renderMedicinePanel();
