const calendar = document.querySelector('.calendar');

// 🔧 CHANGE THESE PER MONTH (TEMPORARY – will be removed when month selector is added)
const daysInMonth = 31;
const startOffset = 3; // 0 = Monday

// 👉 Google Sheet details
const SHEET_ID = '16nbAR20INmfNgd_RRsgbt6ag9dSe5-5YF-3kK1YsrV4';
const SHEET_NAME = 'Sheet1';

const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const events = {};

    data.forEach(row => {
      const day = parseInt(row.Day);
      if (isNaN(day)) return;

      if (!events[day]) events[day] = [];

      events[day].push({
        title: row.Event || '',
        language: row.Language || '',
        time: row.Time || '',
        location: row.Location || '',
        notes: row.Details || ''
      });
    });

    renderCalendar(events);
  })
  .catch(error => {
    console.error('Error loading events:', error);
  });

function renderCalendar(events) {
  calendar.innerHTML = '';

  // Empty cells before Day 1
  for (let i = 0; i < startOffset; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day', 'empty');
    calendar.appendChild(emptyDiv);
  }

  // Render days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    dateDiv.textContent = day;
    dayDiv.appendChild(dateDiv);

    // Show event labels only (no expansion)
    if (events[day]) {
  const uniqueTitles = [...new Set(events[day].map(e => e.title))];

  uniqueTitles.forEach(title => {
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event');
    eventDiv.textContent = title;
    dayDiv.appendChild(eventDiv);
  });

  dayDiv.addEventListener('click', () => {
    openEventModal(day, events[day]);
  });
}


    calendar.appendChild(dayDiv);
  }
}

// ===============================
// MODAL LOGIC
// ===============================

function openEventModal(day, dayEvents) {
  const modal = document.getElementById('eventModal');
  const modalDate = document.getElementById('modalDate');
  const modalEvents = document.getElementById('modalEvents');

  modalDate.textContent = `January ${day}`;
  modalEvents.innerHTML = '';

  // Group by event title
  const grouped = {};
  dayEvents.forEach(e => {
    if (!grouped[e.title]) grouped[e.title] = [];
    grouped[e.title].push(e);
  });

  Object.keys(grouped).forEach(title => {
    const block = document.createElement('div');
    block.style.marginBottom = '16px';

    let html = `<strong>${title}</strong><br>`;

    grouped[title].forEach(entry => {
      html += `${entry.language ? entry.language + ' – ' : ''}${entry.time}<br>`;
    });

    const first = grouped[title][0];
    if (first.location) {
      html += `📍 ${first.location}<br>`;
    }
    if (first.notes) {
      html += `<small>${first.notes}</small>`;
    }

    block.innerHTML = html;
    modalEvents.appendChild(block);
  });

  modal.style.display = 'flex';
}

// Close modal on background tap
document.getElementById('eventModal').addEventListener('click', e => {
  if (e.target.id === 'eventModal') {
    e.currentTarget.style.display = 'none';
  }
});
