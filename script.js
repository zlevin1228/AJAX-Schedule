$(document).ready(function () {

    // edit link: https://www.npoint.io/docs/01b53c694243426560d6
    const scheduleUrl = 'https://api.npoint.io/01b53c694243426560d6'
    const btn = $('#submitDay')

    const bellSchedule = {
        1: { start: '8:24 AM', end: '9:31 AM' },
        2: { start: '9:36 AM', end: '10:43 AM' },
        3: { start: '10:48 AM', end: '11:55 AM' },
        4: { start: '12:00 PM', end: '12:35 PM' },
        5: { start: '12:41 PM', end: '1:48 PM' },
        6: { start: '1:53 PM', end: '3:00 PM' },
    }


    $('#submitDay').on('click', function () {
        const selectedDay = $('#dayInput').val().trim().toUpperCase()
        let days = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        console.log(selectedDay)
        if (!days.includes(selectedDay)) {
            alert("Pick a day in the range!");
        } else {
            $.ajax({
                type: "GET",
                url: "https://api.npoint.io/01b53c694243426560d6",
                success: function (data) {
                    let schedule = data.schedule
                    let daySchedule = schedule.filter(classItem => classItem.days.includes(selectedDay))
                    console.log(daySchedule)
                    let htmlString = "<tr>"
                    daySchedule.forEach((classItem) => {
                        htmlString += `<td>${classItem.period}</td>
                                        <td>NOT DONE</td>
                                        <td>${classItem.class}</td>
                                        <td>${classItem.teacher}</td>
                                        <td>${classItem.room}</td>`
                    })
                    htmlString += "</tr>"
                    $('#scheduleList').append(htmlString)
                },
                error: function () {
                    console.log('Connection error')
                }
            })
        }
    })
})