'use strict';

let dataOut;
let requestOut;
let data;
let requestIn;
let text;

const getJSONOut = (process) => {
    console.log("getJSONOut");
    requestOut = new XMLHttpRequest();
    let filename = "attendance.json";
    console.log(filename);
    requestOut.open("GET", filename, true);
    requestOut.setRequestHeader('Cache-Control', 'no-cache');

    requestOut.onerror = function() {
        alert("ERROR: Cannot Read Attendance File");
    };
    requestOut.send();


    requestOut.onload =function() {
        if(requestOut.status >= 200 && requestOut.status < 400) {
            dataOut = JSON.parse(requestOut.responseText);
            console.log(dataOut);
            process(dataOut);
        }
    };
};

const getJSONOutFs = (process) => {
 
    console.log("getJSONOutFS : FS:");
    console.log("getJSONOutFS : FS: " + fileHandle + dirHandle);

    if (fileHandle == undefined)
        alert ("No attendance file existing");

    getFileContents(fileHandle).then(function(result) {
    dataOut = JSON.parse(result);
    process(dataOut);
    console.log("TEXT: " + result);
    });
};


const getJSONIn = (roomNumber, process) => {
    requestIn = new XMLHttpRequest();
    let filename = "conferenceRoom/page";
    filename = filename.concat(roomNumber + ".json");
    console.log(filename);
    requestIn.open("GET", filename, true);

    requestIn.onload = function () {
        if(requestIn.status >= 200 && requestIn.status < 400) {
            data = JSON.parse(requestIn.responseText);
            console.log(data);
            process(data);
        } else {
            alert("ERROR: No room schedule or not readable");
        }


    };
    requestIn.onerror = function() {
        alert("ERROR: Cannot Read Room Schedule");
    };
    requestIn.send();
    console.log("return");
};

const fill_title = (table, tableBody, tblData) => {
    let row = document.createElement("tr");
    let cell = document.createElement("td");
    let cellText = document.createTextNode("Name");
    for (let t=0; t < tblData.speeches.length; t++) {
        row = document.createElement("tr");
        cell = document.createElement("td");
        cellText = document.createTextNode(tblData.speeches[t].name);
        cell.appendChild(cellText);
        row.appendChild(cell);
        cell = document.createElement("td");
        cellText = document.createTextNode(tblData.speeches[t].speaker);
        cell.appendChild(cellText);
        row.appendChild(cell);
        cell = document.createElement("td");
        cellText = document.createTextNode(tblData.speeches[t].topic);
        cell.appendChild(cellText);
        row.appendChild(cell);
        cell = document.createElement("td");
        cellText = document.createTextNode(tblData.speeches[t].startTime);
        cell.appendChild(cellText);
        row.appendChild(cell);
        cell = document.createElement("td");
        cellText = document.createTextNode(tblData.speeches[t].endTime);
        cell.appendChild(cellText);
        row.appendChild(cell);
        for(let v=0; v < tblData.speeches[t].keywords.length; v++) {
            if (v==0)
                cell = document.createElement("td");
            if (v != tblData.speeches[t].keywords.length - 1) {
               cellText = document.createTextNode(tblData.speeches[t].keywords[v].keyword + ", ");
            } else {
               cellText = document.createTextNode(tblData.speeches[t].keywords[v].keyword);
            }
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
};


