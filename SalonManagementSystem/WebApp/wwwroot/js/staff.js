// Hàm lấy lịch làm việc của nhân viên
async function fetchSchedules(staffId) {
    try {
        const response = await fetch(`http://localhost:5002/api/staff/${staffId}/schedules`);
        const schedules = await response.json();
        displaySchedules(schedules);
    } catch (error) {
        console.error("Lỗi khi lấy lịch làm việc:", error);
    }
}

// Hàm hiển thị lịch làm việc
function displaySchedules(schedules) {
    const scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = ""; // Xóa nội dung cũ

    if (schedules && schedules.length > 0) {
        schedules.forEach(schedule => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${schedule.date}</td>
                <td>${schedule.startTime}</td>
                <td>${schedule.endTime}</td>
            `;
            scheduleList.appendChild(row);
        });
    } else {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="3">Không có lịch làm việc.</td>`;
        scheduleList.appendChild(row);
    }
}