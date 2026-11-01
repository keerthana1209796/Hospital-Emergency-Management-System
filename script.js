const STORAGE_KEY = "carequeue_demo_patients_v1";
let patients = loadPatients();
let toastTimer;

const form = document.getElementById("patientForm");
const queueBody = document.getElementById("queueBody");
const treatBtn = document.getElementById("treatBtn");
const toast = document.getElementById("toast");

function loadPatients() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
}
function savePatients() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}
function priorityName(priority) {
  return ({1:"Critical", 2:"Serious", 3:"Normal"})[priority] || "Unknown";
}
function priorityClass(priority) {
  return ({1:"critical", 2:"serious", 3:"normal"})[priority] || "normal";
}
function orderedPatients() {
  return [...patients].sort((a,b) => a.priority - b.priority || a.createdAt - b.createdAt);
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function render() {
  const ordered = orderedPatients();
  document.getElementById("totalWaiting").textContent = patients.length;
  document.getElementById("criticalCount").textContent = patients.filter(p=>p.priority===1).length;
  document.getElementById("seriousCount").textContent = patients.filter(p=>p.priority===2).length;
  document.getElementById("normalCount").textContent = patients.filter(p=>p.priority===3).length;
  document.getElementById("queueCount").textContent = `${patients.length} patient${patients.length===1?"":"s"}`;

  if (!ordered.length) {
    queueBody.innerHTML = '<tr><td colspan="5" class="table-empty">No patients in the waiting queue yet.</td></tr>';
    document.getElementById("nextPatient").className = "next-patient empty-state";
    document.getElementById("nextPatient").innerHTML = '<div class="empty-icon">＋</div><strong>No patients waiting</strong><p>Add a patient to see who is next.</p>';
    treatBtn.disabled = true;
  } else {
    queueBody.innerHTML = ordered.map((p,i) => `
      <tr>
        <td><span class="queue-number">${i+1}</span></td>
        <td>${escapeHTML(p.id)}</td>
        <td class="patient-name">${escapeHTML(p.name)}</td>
        <td><span class="priority-badge ${priorityClass(p.priority)}">● ${p.priority} · ${priorityName(p.priority)}</span></td>
        <td class="status-waiting">Waiting</td>
      </tr>`).join("");
    const next = ordered[0];
    document.getElementById("nextPatient").className = "next-patient";
    document.getElementById("nextPatient").innerHTML = `
      <div class="next-card">
        <div class="next-card-top"><span class="priority-badge ${priorityClass(next.priority)}">● Priority ${next.priority} · ${priorityName(next.priority)}</span><span class="next-order">Queue #1</span></div>
        <p class="next-name">${escapeHTML(next.name)}</p>
        <span class="next-id">Patient ID: ${escapeHTML(next.id)}</span>
      </div>`;
    treatBtn.disabled = false;
  }
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const id = document.getElementById("patientId").value.trim();
  const name = document.getElementById("patientName").value.trim();
  const priority = Number(document.getElementById("priority").value);
  if (!id || !name) return;
  if (patients.some(p => p.id.toLowerCase() === id.toLowerCase())) {
    showToast("That Patient ID is already in the waiting queue.");
    return;
  }
  patients.push({id, name, priority, createdAt: Date.now()});
  savePatients();
  render();
  form.reset();
  document.getElementById("priority").value = "3";
  showToast(`${name} added to the waiting queue.`);
});
treatBtn.addEventListener("click", () => {
  const ordered = orderedPatients();
  if (!ordered.length) return;
  const treated = ordered[0];
  patients = patients.filter(p => p !== treated);
  savePatients();
  render();
  document.getElementById("treatedMessage").textContent = `${treated.name} (${treated.id}) marked as treated in this demo.`;
  showToast(`${treated.name} was removed from the queue.`);
});
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  const id = document.getElementById("searchId").value.trim();
  const result = document.getElementById("searchResult");
  if (!id) {
    result.className = "search-result";
    result.textContent = "Please enter a Patient ID.";
    return;
  }
  const found = patients.find(p => p.id.toLowerCase() === id.toLowerCase());
  if (found) {
    const position = orderedPatients().findIndex(p => p.id === found.id) + 1;
    result.className = "search-result found";
    result.innerHTML = `<strong>${escapeHTML(found.name)}</strong> · ID ${escapeHTML(found.id)}<br>Priority ${found.priority} — ${priorityName(found.priority)} · Waiting queue position: ${position}`;
  } else {
    result.className = "search-result";
    result.textContent = `No waiting patient found with ID "${id}". A patient already marked as treated is no longer in the queue.`;
  }
});
document.getElementById("clearBtn").addEventListener("click", () => {
  if (!patients.length) { showToast("The queue is already empty."); return; }
  if (!confirm("Clear all patients from this browser's demo queue?")) return;
  patients = [];
  savePatients();
  render();
  document.getElementById("treatedMessage").textContent = "";
  showToast("Demo queue cleared.");
});
document.getElementById("todayLabel").textContent = new Intl.DateTimeFormat("en-IN", {day:"2-digit",month:"short",year:"numeric"}).format(new Date());
render();
