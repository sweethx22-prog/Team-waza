const form = document.getElementById('person-form');
const requestList = document.getElementById('request-list');
const medicinePanel = document.getElementById('medicine-panel');
const typeSelect = document.getElementById('type');
const doctorFields = document.getElementById('doctor-fields');
const trasladoFields = document.getElementById('traslado-fields');
const medicinaFields = document.getElementById('medicina-fields');

let requests = JSON.parse(localStorage.getItem('person-requests') || '[]');

function saveRequests() {
  localStorage.setItem('person-requests', JSON.stringify(requests));
}

function getTypeClass(type) {
  if (type === 'Doctor') return 'doctor';
  if (type === 'Traslado') return 'traslado';
  return 'medicina';
}

function updateDynamicFields() {
  const selectedType = typeSelect.value;
  doctorFields.style.display = selectedType === 'Doctor' ? 'block' : 'none';
  trasladoFields.style.display = selectedType === 'Traslado' ? 'block' : 'none';
  medicinaFields.style.display = selectedType === 'Medicina' ? 'block' : 'none';
}

typeSelect.addEventListener('change', updateDynamicFields);

function renderRequests() {
  if (requests.length === 0) {
    requestList.innerHTML = '<p class="small">No hay solicitudes registradas todavía.</p>';
    return;
  }

  requestList.innerHTML = requests.map((item) => {
    const extraDetails = [];
    if (item.type === 'Doctor') {
      if (item.reference) extraDetails.push(`Referencia: ${item.reference}`);
      if (item.streetDescription) extraDetails.push(`Calle accesible: ${item.streetDescription}`);
    } else if (item.type === 'Traslado') {
      if (item.address) extraDetails.push(`Dirección: ${item.address}`);
    } else if (item.type === 'Medicina') {
      if (item.medicineDescription) extraDetails.push(`Medicina: ${item.medicineDescription}`);
    }

    return `
      <div class="item">
        <strong>${item.name}</strong> · ${item.colonia || item.address || item.medicineColonia || 'Sin datos'}<br>
        <span class="chip ${getTypeClass(item.type)}">${item.type}</span>
        <div class="small">${item.detail || item.medicineDescription || 'Sin detalles'}</div>
        ${extraDetails.length ? `<div class="small">${extraDetails.join(' · ')}</div>` : ''}
        ${item.street ? `<div class="map-box">📍 ${item.street}</div>` : ''}
        ${item.photoData ? `<img class="photo-preview" src="${item.photoData}" alt="Foto de la solicitud" />` : ''}
        <div class="actions">
          <button onclick="markAsVisited(${item.id})">Marcar como atendida</button>
          <button class="danger-btn" onclick="deleteRequest(${item.id})">Eliminar</button>
        </div>
      </div>
    `;
  }).join('');
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
      <div class="small">${item.detail || item.medicineDescription || 'Sin detalles'}</div>
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
  const selectedType = typeSelect.value;
  const photoInput = selectedType === 'Traslado'
    ? document.getElementById('traslado-photo')
    : selectedType === 'Medicina'
      ? document.getElementById('medicina-photo')
      : document.getElementById('photo');

  let photoData = '';
  if (photoInput.files && photoInput.files[0]) {
    photoData = await readFileAsDataURL(photoInput.files[0]);
  }

  const newRequest = {
    id: Date.now(),
    type: selectedType,
    name: selectedType === 'Doctor'
      ? document.getElementById('name').value.trim()
      : selectedType === 'Traslado'
        ? document.getElementById('traslado-name').value.trim()
        : document.getElementById('medicina-name').value.trim(),
    colonia: selectedType === 'Doctor'
      ? document.getElementById('colonia').value.trim()
      : selectedType === 'Medicina'
        ? document.getElementById('medicina-colonia').value.trim()
        : '',
    detail: selectedType === 'Doctor'
      ? document.getElementById('detail').value.trim()
      : selectedType === 'Traslado'
        ? document.getElementById('traslado-detail').value.trim()
        : document.getElementById('medicina-description').value.trim(),
    reference: selectedType === 'Doctor' ? document.getElementById('reference').value.trim() : '',
    street: selectedType === 'Doctor'
      ? document.getElementById('street').value.trim()
      : selectedType === 'Medicina'
        ? document.getElementById('medicina-street').value.trim()
        : '',
    streetDescription: selectedType === 'Doctor' ? document.getElementById('street-description').value.trim() : '',
    address: selectedType === 'Traslado' ? document.getElementById('address').value.trim() : '',
    medicineDescription: selectedType === 'Medicina' ? document.getElementById('medicina-description').value.trim() : '',
    medicineColonia: selectedType === 'Medicina' ? document.getElementById('medicina-colonia').value.trim() : '',
    photoData,
    status: 'Pendiente',
    code: selectedType === 'Medicina' ? `MED-${Math.random().toString(36).slice(2, 7).toUpperCase()}` : ''
  };

  requests.unshift(newRequest);
  saveRequests();
  renderRequests();
  renderMedicinePanel();
  form.reset();
  updateDynamicFields();
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

updateDynamicFields();
renderRequests();
renderMedicinePanel();
