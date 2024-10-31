$(document).ready(function () {
  // edit link: https://www.npoint.io/docs/01b53c694243426560d6
  const bellSchedule = { // All times of periods
    1: { start: "8:24 AM", end: "9:31 AM" },
    2: { start: "9:36 AM", end: "10:43 AM" },
    3: { start: "10:48 AM", end: "11:55 AM" },
    lunch: { start: "12:00 PM", end: "12:35 PM" },
    4: { start: "12:41 PM", end: "1:48 PM" },
    5: { start: "1:53 PM", end: "3:00 PM" },
  };

  const dailyPeriods = { // Lists out all periods in proper block format
    A: [1, 2, 3, "Lunch", 5, 6],
    B: [4, 1, 2, "Lunch", 7, 5],
    C: [3, 4, 1, "Lunch", 6, 7],
    D: [2, 3, 4, "Lunch", 5, 6],
    E: [1, 2, 3, "Lunch", 7, 5],
    F: [4, 1, 2, "Lunch", 6, 7],
    G: [3, 4, 7, "Lunch", 5, 6],
  };

  $("#submitDay").on("click", function () {
    const selectedDay = $("#dayInput").val().trim().toUpperCase(); // selectedDay is the input in the box
    let days = ["A", "B", "C", "D", "E", "F", "G"]; // Days Array
    if (!days.includes(selectedDay)) { // If the letter is not in the array, send the alert below
      alert("Pick a day in the range!");
    } else {
      $.ajax({
        url: `https://api.npoint.io/01b53c694243426560d6`, // JSON file
        method: "GET",
        success: function (data) { // On success of loading, this will run
          const schedule = data.schedule;  // Gets schedule from response
          const daySchedule = dailyPeriods[selectedDay]; // The selected day will grab its array of periods
          $("#scheduleList").empty();  // Empties the schedule
          let bellIndex = 1; // Starts with initial bell time
          daySchedule.forEach(function (period) {  // for each period, runt his
            if (period === "Lunch") {
              //if it is lunch
              const lunchTime = bellSchedule.lunch;  // gets the lunch time
              $("#scheduleList").append(`
                            <tr>
                                <td>Lunch</td>
                                <td>${lunchTime.start} - ${lunchTime.end}</td>
                                <td class="text-center" colspan="3" style="color: red"><b>Lunch Break</b></td>
                            </tr>
                        `); // appends lunch to the list
            } else {
              const periodData = schedule.find(function (item) { // if it's not lunch then returns a different period
                return (
                  item.period === period && item.days.includes(selectedDay)
                );
              });
              if (periodData) {
                const time = bellSchedule[bellIndex]; // appends the next period based on what index it currently is
                $("#scheduleList").append(`
                                <tr class="schedule-row" data-start="${time.start}" data-end="${time.end}">
                                    <td>${period}</td>
                                    <td>${time.start} - ${time.end}</td>
                                    <td>${periodData.class}</td>
                                    <td>${periodData.teacher}</td>
                                    <td>${periodData.room}</td>
                                </tr>
                            `);
                bellIndex++; //continues to the next period
              }
            }
          });
          highlightCurrentClass(); // runs function below
        },
        error: function () { //error if ajax doesn't properly load
          alert("Connection Error");
        },
      });
    }
  });
  // ChatGPT
  function highlightCurrentClass() {
    const currentTime = new Date(); // gives date and time
    $(".schedule-row").each(function () {
      const startTime = parseTime($(this).data("start")); // converts the start into a 12 hr format
      const endTime = parseTime($(this).data("end")); // converts the end into a 12 hr format
      if (currentTime >= startTime && currentTime <= endTime) {
        //when the current time is during / in between the time of the period, it will add the class to highlight the row
        $(this).addClass("table-warning");
      }
    });
  }

  function parseTime(timeString) {
    //Formula to convert time idk this is very complicated
    const [hour, minute] = timeString.match(/\d+/g).map(Number);
    const isPM = timeString.includes("PM") && hour !== 12;
    return new Date().setHours(isPM ? hour + 12 : hour, minute, 0);
  }
});
