// script.js – Google Sheets powered events with separate Time & Location columns

const calendar = document.querySelector('.calendar');

// 🔧 CHANGE THESE PER MONTH
const daysInMonth = 31;
const startOffset = 3; // 0 = Monday, 1 = Tuesday, etc.

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
        time: row.Time || '',
        location: row.Location || '',
        notes: row.Notes || ''
      });
    });

    renderCalendar(events);
  })
  .catch(error => {
    console.error('Error loading events:', error);
  });

function renderCalendar(events) {

  // 🟦 Add empty cells before Day 1
  for (let i = 0; i < startOffset; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day', 'empty');
    calendar.appendChild(emptyDiv);
  }

  // 🗓️ Render actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    dateDiv.textContent = day;
    dayDiv.appendChild(dateDiv);

    if (events[day]) {
      events[day].forEach(eventObj => {

        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.textContent = eventObj.title;

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('event-details');
        detailsDiv.style.display = 'none';

        if (eventObj.time) {
          const timeEl = document.createElement('div');
          timeEl.classList.add('event-time');
          timeEl.textContent = `⏰ ${eventObj.time}`;
          detailsDiv.appendChild(timeEl);
        }

        if (eventObj.location) {
          const locEl = document.createElement('div');
          locEl.classList.add('event-location');
          locEl.textContent = `📍 ${eventObj.location}`;
          detailsDiv.appendChild(locEl);
        }

        if (eventObj.notes) {
          const notesEl = document.createElement('div');
          notesEl.classList.add('event-notes');
          notesEl.textContent = eventObj.notes;
          detailsDiv.appendChild(notesEl);
        }

        dayDiv.appendChild(eventDiv);

        if (detailsDiv.children.length > 0) {
          dayDiv.appendChild(detailsDiv);
        }

        dayDiv.addEventListener('click', () => {
          const expanded = dayDiv.classList.toggle('expanded');
          detailsDiv.style.display = expanded ? 'block' : 'none';
        });
      });
    }

    calendar.appendChild(dayDiv);
  }
}
