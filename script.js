'use strict';

/* User interface Start */

// Tables
var tbl = document.createElement("table");
tbl.setAttribute("id", "fulltbl");
var tblBody = document.createElement("tbody");
var body = document.getElementsByTagName("body")[0];

var attendTbl = document.createElement("table");
attendTbl.setAttribute("id", "fulltbl");
var attendTblBody = document.createElement("tbody");
var attendTblbody = document.getElementsByTagName("body")[0];

let room = document.createElement("h1");
room.setAttribute("id", "room");
body.appendChild(room);
let timeNow = document.createElement("h1");
timeNow.setAttribute("id", "time");
body.appendChild(timeNow);

let speechNowDiv = document.createElement("div");
speechNowDiv.setAttribute("id", "divNowSpeech");
body.appendChild(speechNowDiv);
let speechNow = document.createElement("h2");
speechNow.setAttribute("id", "speechNow");
speechNow.style.color = "orange";
speechNow.style.display ="inline";
divNowSpeech.appendChild(speechNow);
let speechNowButton = document.createElement("button")
speechNowButton.setAttribute("id","registerNow");
speechNowButton.style.display = "none";
speechNowButton.style.float = "next";
speechNowButton.innerHTML = "Register";
speechNowDiv.appendChild(speechNowButton);

let speechNextDiv = document.createElement("div");
speechNextDiv.setAttribute("id", "divNextSpeech");
body.appendChild(speechNextDiv);
let speechNext = document.createElement("h2");
speechNext.setAttribute("id", "speechNext");
speechNext.style.color = "green";
speechNext.style.display ="inline";
speechNextDiv.appendChild(speechNext);
let speechNextButton = document.createElement("button")
speechNextButton.setAttribute("id","registerNext");
speechNextButton.style.display ="none";
speechNextButton.style.float ="next";
speechNextButton.innerHTML = "Register";
speechNextDiv.appendChild(speechNextButton);


let showAttendanceDiv = document.createElement("div");
showAttendanceDiv.setAttribute("id", "divAttendance");
body.appendChild(showAttendanceDiv);
let showFileButton = document.createElement("button")
showFileButton.setAttribute("id","showAttendance");
showFileButton.style.display ="none";
showFileButton.style.float ="next";
showFileButton.innerHTML = "Show Attendance";
showAttendanceDiv.appendChild(showFileButton);

//space
body.appendChild(document.createElement("h1"));
/* User interface End */

// Global Data
let indexNext = -1;
let indexNow = -1;
let attendanceFile = "attendance.json";

function drawTables (table, tableBody) {
    let row = document.createElement("tr");
    let cell = document.createElement("td");
    let cellText = document.createTextNode("Name");
    cell.setAttribute("style", "font-weight:800;");
    cell.appendChild(cellText);
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.setAttribute("style", "font-weight:800;");
    cellText = document.createTextNode("Speaker");
    cell.appendChild(cellText);
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.setAttribute("style", "font-weight:800;");
    cellText = document.createTextNode("topic");
    cell.appendChild(cellText);
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.setAttribute("style", "font-weight:800;");
    cellText = document.createTextNode("start Time");
    cell.appendChild(cellText);
    cell.setAttribute("style", "font-weight:800;");
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.setAttribute("style", "font-weight:800;");
    cellText = document.createTextNode("end Time");
    cell.appendChild(cellText);
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.setAttribute("style", "font-weight:800;");
    cellText = document.createTextNode("keyword");
    cell.appendChild(cellText);
    row.appendChild(cell);
    tableBody.appendChild(row);
    table.appendChild(tableBody);
    body.appendChild(table);
    body.appendChild(document.createElement("h1"));
    body.appendChild(showFileButton);
    let txtAttendance = document.createElement("h1");
    txtAttendance.setAttribute("id", "txtAttendance");
    txtAttendance.innerHTML = "Attendance:";
    body.appendChild(txtAttendance);

};


/* Events */
// Register to Current Speech
registerNow.addEventListener("click", async () => {
    console.log("indexNow in click : " + indexNow + "and next: " + indexNext);
    if (indexNow == -1) {
        alert("speech now not selected");
        return;
    }
    // TEST TO CREATE EMPTY FILE
    if (dirHandle == undefined) {
        dirHandle = await getNewDirectoryHandle();
        fileHandle = await createEmptyFile("attendance.json", dirHandle);
        console.log(data.speeches[indexNow]);
        await writeFile(fileHandle, "{\"speeches\": [" + JSON.stringify(data.speeches[indexNow]) + "]}");
    } else {
        console.log(data.speeches[indexNow]);
        let size = await getFileSize(fileHandle);
        console.log("SIZE IS: " + size);
        await writeFile(fileHandle, ", " + JSON.stringify(data.speeches[indexNow]) + "]}", size - 2 );
    }
    showAttendanceFile();
});


// Register to Next Speech
registerNext.addEventListener("click", async () =>{
    if (indexNext == -1) {
        alert("speech next not selected");
        return;
    }
    // TEST TO CREATE EMPTY FILE
    if (dirHandle == undefined) {
        dirHandle = await getNewDirectoryHandle();
        fileHandle = await createEmptyFile("attendance.json", dirHandle);
        console.log(data.speeches[indexNext]);
        await writeFile(fileHandle, "{\"speeches\": [" + JSON.stringify(data.speeches[indexNext]) + "]}");
    } else {
        console.log(data.speeches[indexNext]);
        let size = await getFileSize(fileHandle);
        console.log("SIZE IS: " + size);
        await writeFile(fileHandle, ", " + JSON.stringify(data.speeches[indexNext]) + "]}", size - 2);
    }
    showAttendanceFile();
});

showAttendance.addEventListener("click", async () =>{
    getJSONOutFs(showAttendanceFunc);
});

function getSpeech (data) {

    let updRoom = document.getElementById("room");
    console.log(name);
    updRoom.innerHTML = data.name;

    while (tbl.rows.length > 0) {
        tbl.deleteRow(0);
    }
    if (attendTbl.hasChildNodes())
        attendTbl.parentNode.removeChild(attendTbl);

    fill_title(tbl, tblBody, data);
    console.log("speeches length = " + data.speeches.length);
    showAttendanceFile();

    let today= new Date();

    let currentTime = String(today.getHours()).padStart(2,"0") + ":" + String(today.getMinutes()).padStart(2,"0");
    let theTime = document.getElementById("time");
    theTime.innerHTML = currentTime;
    for (let t=0; t < data.speeches.length; t++) {
        let speechStartTime = data.speeches[t].startTime;
        let speechEndTime = data.speeches[t].endTime;
        if (currentTime >= speechStartTime && currentTime <= speechEndTime) {
            document.getElementById("speechNow").innerHTML = String("Speech on going: " + data.speeches[t].topic)
            document.getElementById("speechNow").style.color = "orange";
            document.getElementById("registerNow").style.display = "block"
            indexNow = t;
            console.log("indexNow : " + indexNow + "( " + typeof indexNow + ")" + " and: " + typeof t);
            if (data.speeches[t+1]) {
                document.getElementById("speechNext").innerHTML = String("Next speech: " + data.speeches[t+1].topic)
                document.getElementById("speechNext").style.color = "green";
                document.getElementById("registerNext").style.display = "block"
                indexNext = t+1;
                console.log("indexNext : " + indexNext + "( " + typeof indexNext + ")" + " and: " + typeof t);
                console.log(data.speeches[indexNext]);
            } else {
                document.getElementById("speechNext").innerHTML = ""
                document.getElementById("registerNext").style.display = "none"
            }
            return;
        }
    }
    document.getElementById("speechNow").innerHTML = String("No Speech at the moment");
    document.getElementById("speechNow").style.color = "red";

    document.getElementById("speechNext").innerHTML = "";
    document.getElementById("registerNow").style.display = "none"
    document.getElementById("registerNext").style.display = "none"
    console.log("No Speech found at: " + currentTime);
};

function showAttendanceFile() {
    if (fileHandle != undefined && dirHandle != undefined) {
        document.getElementById("showAttendance").style.display = "block";
    }
};


const parseJSON = async (input, process) => {
    console.log("input: " + input);
    getJSONIn(input, process);
};

function showAttendanceFunc(tblData) {
    console.log("Attendance called");
    while (attendTbl.rows.length > 0) {
        attendTbl.deleteRow(0);
    }
    fill_title(attendTbl, attendTblBody, tblData);
    attendTbl.appendChild(attendTblBody);
    body.appendChild(attendTbl);
};

// RUN //

drawTables(tbl, tblBody);

