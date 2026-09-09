window.approveAppointment = function(id) {
    let appointments = [];
    try {
        appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    } catch {
        appointments = [];
    }
    const index = appointments.findIndex(app => app.id === id);
    if (index !== -1) {
        appointments[index].status = 'approved';
        localStorage.setItem('appointments', JSON.stringify(appointments));
        alert('Agendamento aprovado com sucesso!');
        renderApprovalList();
        const calendarContainer = document.getElementById('calendar-container');
        if (calendarContainer) renderCalendar(calendarContainer);
    }
};

window.rejectAppointment = function(id) {
    let appointments = [];
    try {
        appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    } catch {
        appointments = [];
    }
    const index = appointments.findIndex(app => app.id === id);
    if (index !== -1) {
        appointments[index].status = 'rejected';
        localStorage.setItem('appointments', JSON.stringify(appointments));
        alert('Agendamento rejeitado.');
        renderApprovalList();
        const calendarContainer = document.getElementById('calendar-container');
        if (calendarContainer) renderCalendar(calendarContainer);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loggedInUser = localStorage.getItem('loggedInUser');
    const path = window.location.pathname;

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const username = usernameInput ? usernameInput.value.trim().toLowerCase() : '';
            const password = passwordInput ? passwordInput.value : '';

            if ((username === 'professor' || username === 'coordenador') && password === '123') {
                localStorage.setItem('loggedInUser', username);
                window.location.href = 'dashboard.html';
            } else {
                alert('Usuário ou senha inválidos.');
            }
        });
    }

    const isLoginPage = path.endsWith('index.html') || path.endsWith('/') || path === '';
    if (!loggedInUser && !isLoginPage) {
        window.location.href = 'index.html';
    }

    const userNameDisplay = document.getElementById('loggedInUserName');
    if (userNameDisplay && loggedInUser) {
        userNameDisplay.textContent = loggedInUser.charAt(0).toUpperCase() + loggedInUser.slice(1);
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        });
    }

    const sidebar = document.querySelector('.sidebar');
    if (sidebar && loggedInUser) {
        const roomLink = sidebar.querySelector('a[href="room-scheduling.html"]');
        const equipmentLink = sidebar.querySelector('a[href="equipment-scheduling.html"]');
        const approvalLink = sidebar.querySelector('a[href="approvals.html"]');

        if (loggedInUser === 'professor') {
            if (approvalLink) approvalLink.style.display = 'none';
        } else if (loggedInUser === 'coordenador') {
            if (roomLink) roomLink.style.display = 'none';
            if (equipmentLink) equipmentLink.style.display = 'none';
        }
    }

    const schedulingForm = document.getElementById('schedulingForm');
    if (schedulingForm) {
        schedulingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = schedulingForm.dataset.type;
            const itemSelect = document.getElementById('itemSelect');
            const scheduleDateInput = document.getElementById('scheduleDate');
            const startTimeInput = document.getElementById('startTime');
            const endTimeInput = document.getElementById('endTime');

            const item = itemSelect ? itemSelect.value : '';
            const date = scheduleDateInput ? scheduleDateInput.value : '';
            const startTime = startTimeInput ? startTimeInput.value : '';
            const endTime = endTimeInput ? endTimeInput.value : '';

            if (!item || !date || !startTime || !endTime) {
                alert('Preencha todos os campos.');
                return;
            }

            const newAppointment = {
                id: Date.now(),
                type: type,
                item: item,
                date: date,
                startTime: startTime,
                endTime: endTime,
                user: loggedInUser,
                status: 'pending'
            };

            let appointments = [];
            try {
                appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            } catch {
                appointments = [];
            }

            appointments.push(newAppointment);
            localStorage.setItem('appointments', JSON.stringify(appointments));

            alert('Solicitação enviada para aprovação com sucesso!');
            schedulingForm.reset();
            renderAppointmentsList(type);
        });
    }

    const calendarContainer = document.getElementById('calendar-container');
    if (calendarContainer) renderCalendar(calendarContainer);

    if (path.includes('room-scheduling.html')) renderAppointmentsList('room');
    if (path.includes('equipment-scheduling.html')) renderAppointmentsList('equipment');
    if (path.includes('approvals.html')) renderApprovalList();
});

function renderCalendar(container) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    container.replaceChildren();

    const header = document.createElement('div');
    header.className = 'calendar-header';
    const h3 = document.createElement('h3');
    h3.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    header.appendChild(h3);

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach(d => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day calendar-header-day';
        dayHeader.style.fontWeight = 'bold';
        dayHeader.textContent = d;
        grid.appendChild(dayHeader);
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day';
        grid.appendChild(emptyCell);
    }

    let appointments = [];
    try {
        appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    } catch {
        appointments = [];
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayAppointments = appointments.filter(app => app && app.date === dateStr);

        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        if (dayAppointments.length > 0) {
            dayCell.classList.add('has-event');
        }

        const dayNum = document.createElement('div');
        dayNum.className = 'day-number';
        dayNum.textContent = String(day);
        dayCell.appendChild(dayNum);

        dayAppointments.forEach(app => {
            const eventBadge = document.createElement('div');
            eventBadge.style.cssText = "font-size: 0.7rem; padding: 4px; border-radius: 4px; margin-top: 4px; text-align: center; color: #fff;";

            if (app.status === 'pending') {
                eventBadge.style.backgroundColor = "rgba(245, 158, 11, 0.9)";
                eventBadge.textContent = "⏳ Pendente";
            } else if (app.status === 'approved') {
                eventBadge.style.backgroundColor = "rgba(16, 185, 129, 0.9)";
                eventBadge.textContent = "✅ Aprovado";
            } else if (app.status === 'rejected') {
                eventBadge.style.backgroundColor = "rgba(239, 68, 68, 0.9)";
                eventBadge.textContent = "❌ Rejeitado";
            }
            dayCell.appendChild(eventBadge);
        });

        grid.appendChild(dayCell);
    }

    container.append(header, grid);
}

function renderAppointmentsList(type) {
    const listContainer = document.getElementById('appointmentsList');
    if (!listContainer) return;

    let appointments = [];
    try {
        appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    } catch {
        appointments = [];
    }

    const currentLoggedInUser = localStorage.getItem('loggedInUser');
    const myAppointments = appointments.filter(app => app && app.type === type && app.user === currentLoggedInUser);

    listContainer.replaceChildren();

    if (myAppointments.length === 0) {
        const emptyP = document.createElement('p');
        emptyP.textContent = 'Nenhum agendamento.';
        listContainer.appendChild(emptyP);
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'list-group';

    myAppointments.forEach(app => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        const div = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = String(app.item || '');
        const dateFormatted = String(app.date || '').split('-').reverse().join('/');
        div.appendChild(strong);
        div.appendChild(document.createTextNode(' - ' + dateFormatted));

        const badge = document.createElement('span');
        badge.className = 'badge';
        if (app.status === 'approved') {
            badge.classList.add('bg-success');
            badge.textContent = 'Aprovado';
        } else if (app.status === 'rejected') {
            badge.classList.add('bg-danger');
            badge.textContent = 'Rejeitado';
        } else {
            badge.classList.add('bg-warning', 'text-dark');
            badge.textContent = 'Pendente';
        }

        li.append(div, badge);
        ul.appendChild(li);
    });

    listContainer.appendChild(ul);
}

function renderApprovalList() {
    const listContainer = document.getElementById('approvalList');
    if (!listContainer) return;

    let appointments = [];
    try {
        appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    } catch {
        appointments = [];
    }

    const pendingAppointments = appointments.filter(app => app && app.status === 'pending');

    listContainer.replaceChildren();

    if (pendingAppointments.length === 0) {
        const emptyP = document.createElement('p');
        emptyP.textContent = 'Sem pendências no momento.';
        listContainer.appendChild(emptyP);
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'list-group';

    pendingAppointments.forEach(app => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        const infoDiv = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = String(app.item || '');

        const userSpan = document.createElement('span');
        userSpan.className = 'text-capitalize';
        userSpan.textContent = String(app.user || '');

        const dateSpan = document.createElement('span');
        dateSpan.className = 'text-secondary';
        const dateFormatted = String(app.date || '').split('-').reverse().join('/');
        dateSpan.textContent = dateFormatted + ' das ' + String(app.startTime || '') + ' às ' + String(app.endTime || '');

        infoDiv.appendChild(strong);
        infoDiv.appendChild(document.createTextNode(' (Por: '));
        infoDiv.appendChild(userSpan);
        infoDiv.appendChild(document.createTextNode(')'));
        infoDiv.appendChild(document.createElement('br'));
        infoDiv.appendChild(dateSpan);

        const actionsDiv = document.createElement('div');

        const btnApprove = document.createElement('button');
        btnApprove.className = 'btn btn-success btn-sm me-2';
        btnApprove.textContent = 'Aprovar';
        btnApprove.onclick = () => window.approveAppointment(app.id);

        const btnReject = document.createElement('button');
        btnReject.className = 'btn btn-danger btn-sm';
        btnReject.textContent = 'Rejeitar';
        btnReject.onclick = () => window.rejectAppointment(app.id);

        actionsDiv.append(btnApprove, btnReject);
        li.append(infoDiv, actionsDiv);
        ul.appendChild(li);
    });

    listContainer.appendChild(ul);
}