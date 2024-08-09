document.addEventListener('DOMContentLoaded', () => {
    const activityTableBody = document.getElementById('activityTableBody');
    const addActivityForm = document.getElementById('addActivityForm');
    const editActivityForm = document.getElementById('editActivityForm');
    const searchInput = document.getElementById('searchInput');
    const sortBy = document.getElementById('sortBy');
    const themeSelector = document.getElementById('themeSelector');

    let activities = JSON.parse(localStorage.getItem('activities')) || [];

    function renderActivities() {
        activityTableBody.innerHTML = '';
        activities.forEach((activity, index) => {
            const row = document.createElement('tr');
            row.draggable = true;
            row.dataset.index = index;

            // בדיקת אם הפעילות הושלמה
            const completedClass = activity.completed ? 'completed' : '';

            row.innerHTML = `
                <td class="${completedClass}">${activity.name}</td>
                <td class="${completedClass}">${activity.category}</td>
                <td class="${completedClass}">${activity.description}</td>
                <td class="${completedClass}">${new Date(activity.dateTime).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="markAsCompleted(${index})">
                        ${activity.completed ? 'בטל סיום' : 'סמן כסיום'}
                    </button>
                    <button class="btn btn-sm btn-info" onclick="editActivity(${index})">ערוך</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteActivity(${index})">מחק</button>
                </td>
            `;
            activityTableBody.appendChild(row);

            // גרירה ושחרור נשאר כפי שהוא
            row.addEventListener('dragstart', handleDragStart);
            row.addEventListener('dragover', handleDragOver);
            row.addEventListener('drop', handleDrop);
            row.addEventListener('dragend', handleDragEnd);

            if (activity.notification) {
                scheduleNotification(activity);
            }

            if (activity.repeat) {
                handleRepeatingActivities(activity, index);
            }
        });
    }

    // פונקציה לסימון משימה שהסתיימה
    window.markAsCompleted = (index) => {
        activities[index].completed = !activities[index].completed; // שינוי המצב של completed
        localStorage.setItem('activities', JSON.stringify(activities)); // שמירה ב-localStorage
        renderActivities(); // רענון הרשימה
    };

    function handleRepeatingActivities(activity, index) {
        // הוספת לוגיקה לניהול פעילויות חוזרות
    }

    function scheduleNotification(activity) {
        const activityTime = new Date(activity.dateTime).getTime();
        const currentTime = new Date().getTime();
        const tenMinutesBefore = activityTime - 10 * 60 * 1000;

        if (tenMinutesBefore > currentTime) {
            const timeUntilNotification = tenMinutesBefore - currentTime;

            setTimeout(() => {
                alert(`התראה: הפעילות "${activity.name}" תתחיל בעוד 10 דקות!`);
            }, timeUntilNotification);
        }
    }

    addActivityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newActivity = {
            name: document.getElementById('activityName').value,
            category: document.getElementById('activityCategory').value,
            description: document.getElementById('activityDescription').value,
            dateTime: document.getElementById('activityDateTime').value,
            notification: document.getElementById('activityNotification').checked,
            repeat: document.getElementById('activityRepeat').value,
            completed: false // פעילות חדשה תמיד לא הושלמה בהתחלה
        };
        activities.push(newActivity);
        localStorage.setItem('activities', JSON.stringify(activities));
        renderActivities();
        $('#addActivityModal').modal('hide');
        addActivityForm.reset();
    });

    editActivityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = document.getElementById('editActivityId').value;
        activities[index] = {
            name: document.getElementById('editActivityName').value,
            category: document.getElementById('editActivityCategory').value,
            description: document.getElementById('editActivityDescription').value,
            dateTime: document.getElementById('editActivityDateTime').value,
            notification: document.getElementById('editActivityNotification').checked,
            repeat: document.getElementById('editActivityRepeat').value,
            completed: activities[index].completed // שמירה על מצב ה-completed
        };
        localStorage.setItem('activities', JSON.stringify(activities));
        renderActivities();
        $('#editActivityModal').modal('hide');
    });

    window.editActivity = (index) => {
        const activity = activities[index];
        document.getElementById('editActivityId').value = index;
        document.getElementById('editActivityName').value = activity.name;
        document.getElementById('editActivityCategory').value = activity.category;
        document.getElementById('editActivityDescription').value = activity.description;
        document.getElementById('editActivityDateTime').value = activity.dateTime;
        document.getElementById('editActivityNotification').checked = activity.notification;
        document.getElementById('editActivityRepeat').value = activity.repeat;
        $('#editActivityModal').modal('show');
    };

    window.deleteActivity = (index) => {
        if (confirm('האם אתה בטוח שברצונך למחוק את הפעילות הזו?')) {
            activities.splice(index, 1);
            localStorage.setItem('activities', JSON.stringify(activities));
            renderActivities();
        }
    };

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredActivities = activities.filter(activity =>
            activity.name.toLowerCase().includes(searchTerm) ||
            activity.description.toLowerCase().includes(searchTerm)
        );
        renderFilteredActivities(filteredActivities);
    });

    sortBy.addEventListener('change', () => {
        const sortByValue = sortBy.value;
        const sortedActivities = [...activities].sort((a, b) => {
            if (sortByValue === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortByValue === 'dateTime') {
                return new Date(a.dateTime) - new Date(b.dateTime);
            }
        });
        renderFilteredActivities(sortedActivities);
    });

    function renderFilteredActivities(activitiesToRender) {
        activityTableBody.innerHTML = '';
        activitiesToRender.forEach((activity, index) => {
            const row = document.createElement('tr');
            row.draggable = true;
            row.dataset.index = index;

            // בדיקת אם הפעילות הושלמה
            const completedClass = activity.completed ? 'completed' : '';

            row.innerHTML = `
                <td class="${completedClass}">${activity.name}</td>
                <td class="${completedClass}">${activity.category}</td>
                <td class="${completedClass}">${activity.description}</td>
                <td class="${completedClass}">${new Date(activity.dateTime).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="markAsCompleted(${index})">
                        ${activity.completed ? 'בטל סיום' : 'סמן כסיום'}
                    </button>
                    <button class="btn btn-sm btn-info" onclick="editActivity(${index})">ערוך</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteActivity(${index})">מחק</button>
                </td>
            `;
            activityTableBody.appendChild(row);

            row.addEventListener('dragstart', handleDragStart);
            row.addEventListener('dragover', handleDragOver);
            row.addEventListener('drop', handleDrop);
            row.addEventListener('dragend', handleDragEnd);
        });
    }

    function applyTheme(theme) {
        document.body.classList.remove('theme-dark', 'theme-light');
        document.body.classList.add(theme);
    }

    themeSelector.addEventListener('change', () => {
        const selectedTheme = themeSelector.value;
        applyTheme(`theme-${selectedTheme}`);
    });

    // פונקציות עבור מזג האוויר
    const weatherIcon = document.getElementById('weatherIcon');
    const weatherDetails = document.getElementById('weatherDetails');
    const apiKey = 'be39c4bef60b243c4a80d3f41d555973';

    function getWeather(latitude, longitude) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=he&appid=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temp = data.main.temp;
                const description = data.weather[0].description;
                const iconCode = data.weather[0].icon;
                const city = data.name;

                weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
                weatherIcon.style.display = 'inline';
                weatherDetails.innerHTML = `מיקום: ${city}<br>טמפרטורה: ${temp}°C<br>תיאור: ${description}`;
            })
            .catch(error => {
                weatherDetails.innerText = 'שגיאה בהבאת נתוני מזג האוויר';
            });
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    getWeather(latitude, longitude);
                },
                error => {
                    weatherDetails.innerText = 'שגיאה בקבלת מיקום גיאוגרפי';
                }
            );
        } else {
            weatherDetails.innerText = 'המכשיר לא תומך במיקום גיאוגרפי';
        }
    }

    getLocation();

    // פונקציות עבור גרירה ושחרור
    function handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.target.classList.add('dropzone');
    }

    function handleDrop(e) {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData('text/plain');
        const targetIndex = e.target.closest('tr').dataset.index;

        if (draggedIndex !== targetIndex) {
            const draggedActivity = activities[draggedIndex];
            activities.splice(draggedIndex, 1);
            activities.splice(targetIndex, 0, draggedActivity);
            localStorage.setItem('activities', JSON.stringify(activities));
            renderActivities();
        }

        e.target.classList.remove('dropzone');
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        document.querySelectorAll('.dropzone').forEach(zone => zone.classList.remove('dropzone'));
    }

    renderActivities();
});
