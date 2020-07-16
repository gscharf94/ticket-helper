const httpTICKETS = new XMLHttpRequest();
const httpWORKIDS = new XMLHttpRequest();
const httpRESPONSES = new XMLHttpRequest();
const httpTICKBOX = new XMLHttpRequest();
const httpPRINTREF = new XMLHttpRequest();

// const displayURL = "http://127.0.0.1:5000/display/"
const displayURL = "http://locate-helper.herokuapp.com/display/";
const printRefURL = "http://locate-helper.herokuapp.com/printref/";

Number.prototype.pad = function(len) {
    let orig = String(this);
    for(let i=0; i<len; i++) {
        orig = "0" + orig;
    }
    return orig;
}

Array.prototype.splitEveryN = function(n) {
	let newArr = [];
	let i;
	let c = 1;

	let tmp = [];
	for(i=0; i<this.length; i++) {
		if(c%n != 0) {
			tmp.push(this[i]);
			c++;
		} else {
			tmp.push(this[i]);
			newArr.push(tmp);
			tmp = [];
			c = 1;
		}
	}
	return newArr;
}

String.prototype.replaceAll = function(a, b) {
	let output = this;
	let ind = output.indexOf(a);
	while(ind !== -1) {
		output = output.replace(a,b);
		ind = output.indexOf(a);
	}
	return output;
}

const date = new Date();
// const dateStr = `${date.getFullYear()}-${(date.getMonth()+1).pad(1)}-${date.getDate()}`;
const dateStr = "2020-07-16"

const CODES = {
    '-1':"orange",
    '4':"green",
    '1':"green",
    "3U":"red",
    "8":"yellow",
    "2E":"green",
    "6A":"red",
    "3F":"red",
    "5":"green",
    "9Z":"green",
    "3P":"red",
    "2A":"green",
    "2C":"green",
    "3C":"red",
    "2E":"green",
    "2B":"green",
    "3M":"red"
}

function getData(date) {
    http.open("GET",displayURL+date);
    http.send();

    http.onreadystatechange=(e)=>{
        let ticketList = getTickets(206,http.responseText);
        updateTickets(ticketList);
    }
}

function drawBlock(tCanv, color, xPos) {
    let ctx = tCanv.getContext("2d");

    ctx.beginPath();
    ctx.rect(xPos, 0, 10, 15);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();

}

function drawTitleBox(total, greens) {
    let tCanv = document.getElementById("titleCanv");
    let ctx = tCanv.getContext('2d');

    let width = tCanv.width/total;

    for(i=0; i<total; i++) {
        ctx.beginPath();
        ctx.rect(i*width,0,width,10);
        if(i<greens) {
            ctx.fillStyle = "green";
        } else {
            ctx.fillStyle = "red";
        }
        ctx.fill();
    }

    let xyEle = document.getElementById("comparison");
    xyEle.textContent = `${greens}/${total} ready`
}

function getTickCanvResponseData(ticks) {
    httpTICKBOX.open("GET", displayURL+dateStr);
    httpTICKBOX.send();

    httpTICKBOX.onreadystatechange=(e)=> {
        let httpResponse = httpTICKBOX.responseText;
        let total = 0;
        let greens = 0;
        for(let j=0; j < ticks.length; j++) {
            let responses = getResponse(ticks[j], httpResponse);
            try {
                var tCanv = document.getElementById(`canv${ticks[j]}`);
                tCanv.width = responses.length * 10;
            }
            catch {
                continue;
            }
            for(let i=0; i<responses.length; i++) {
                let resCode = responses[i][2];
                let shortResCode = getCodeFromResponse(resCode);
                drawBlock(tCanv, CODES[shortResCode], i*10);
                total++;
                if(CODES[shortResCode] == "green") {
                    greens++;
                }
            }
        }
        drawTitleBox(total, greens);
    }
}

function updateTickets(ticketList) {
    ticketsElement = document.getElementById('tickets');
    let i;


    finalHTML = "";
    for(i=0; i<ticketList.length; i++) {
        finalHTML += `<a href="#" id ="tick${ticketList[i]}" onclick="getResponseCommand(${ticketList[i]})">`;
        finalHTML += `<div id="t${ticketList[i]}" class="ticket"><p>${ticketList[i]}</p>`;
        finalHTML += `<canvas id="canv${ticketList[i]}" width="100" height="15"></canvas></div>`;
        finalHTML += `</a>`;
    }
    ticketsElement.innerHTML = finalHTML;
    
    // let cCanv = document.getElementById(`canv${ticketList}`);
    getTickCanvResponseData(ticketList);

    
    

}

function getWorkIDs(bulkData) {
    // takes in data from heroku server
    // returns list of work order ids
    let ind = bulkData.search("abcabc");
    let end = bulkData.search("zapzap")
    let ids = bulkData.slice(ind+8, end-2);
    ids = ids.replaceAll(" ","").split(",");

    let ret = [];

    let titlesChunk = bulkData.slice(end, bulkData.length);

    let i;
    for(i=0; i<ids.length; i++) {
        let start = titlesChunk.search(ids[i]);
        titlesChunk = titlesChunk.slice(start, titlesChunk.length);
        let end = titlesChunk.search("<<>>");

        let titleString = titlesChunk.slice(0,end).replace(":"," - ").replaceAll("<","").replaceAll(">","");
        titlesChunk = titlesChunk.slice(end, titlesChunk.length);
        ret.push(titleString);

    }

    return [ids,ret];
}



function updateWorkIDs(ids, titles) {
    sidebarElement = document.getElementById("sidebar");
    let i;

    finalHTML = "";
    for(i=0; i<ids.length; i++) {
        finalHTML += `<a href="#" onclick="getTicketsCommand(${ids[i]});">`
        let title = titles[i].slice(6, titles[i].length);
        let titlePart = title.search(" ");
        titlePart = title.slice(0,titlePart)
        finalHTML += `<div id="work${ids[i]}"><p>${ids[i]} - ${titlePart}</p>`;
        finalHTML += `</div></a>`;
    }
    sidebarElement.innerHTML = finalHTML;
}

function fillWorkOrders() {
    httpWORKIDS.open("GET", displayURL+dateStr);
    httpWORKIDS.send();

    httpWORKIDS.onreadystatechange=(e)=> {
        let workIDs = getWorkIDs(httpWORKIDS.responseText);
        updateWorkIDs(workIDs[0],workIDs[1]);
    }
}

function getTickets(workID, bulkData) {
    // takes in wordID & data from heroku server
    // and pops out an array with the tickets for that work order
    let ind = bulkData.search("xyzxyz");
    let end = bulkData.search("abcabc");
    let ticketList = bulkData.slice(ind+7, end);
    ind = ticketList.search(`'${String(workID)}'`);
    ticketList = ticketList.slice(ind+7, ticketList.length);
    end  = ticketList.search("']");

    ticketList = ticketList.slice(0, end+2);

    ticketList = ticketList.slice(1, ticketList.length - 1);
    ticketList = ticketList.replaceAll(" ","");
    ticketList = ticketList.replaceAll("'","");


    return ticketList.split(",");

}

function getCodeFromResponse(response) {
    // i'm adding code assuming that there is a space at the start
    // keep this in mind when you change shit inevitably

    if(response === ` ''`) {
        return -1;
    }

    let ind = response.search(":");
    return response.slice(2, ind);
}

function updateResponses(responses) {
    let responseElement = document.getElementById('responses');
    let i,j;

    let finalHTML = "";
    finalHTML += `<table id="responseTable">`;
    finalHTML += `<tr><th>Utility</th><th>Response</th><th>Notes</th>`;
    for(i=0; i<responses.length; i++) {
        finalHTML += "<tr>";
        let rowCode = getCodeFromResponse(responses[i][2]);
        for(j=1; j<responses[i].length; j++) {
            finalHTML += `<td class="tab${j} c${rowCode}">${responses[i][j].replaceAll(`'`,"")}</td>`;
        }
        finalHTML += "</tr>";
    }
    finalHTML += `</table>`;
    responseElement.innerHTML = finalHTML;
}

function updateTicketNumber(num) {
    let ele = document.getElementById("ticketNum");
    ele.textContent = `#${num}`;
}

function getResponseCommand(ticketNumber) {
    httpRESPONSES.open("GET", displayURL+dateStr);
    httpRESPONSES.send();

    httpRESPONSES.onreadystatechange=(e)=> {
        let responses = getResponse(ticketNumber, httpRESPONSES.responseText);
        updateTicketNumber(ticketNumber);
        updateResponses(responses);
    }
}

function getTitle(workID, text) {
    let ind = text.search("zapzap");
    text = text.slice(ind, text.length);
    
    ind = text.search(`>>${workID}`);
    text = text.slice(ind, text.length);
    
    ind = text.search("<<>>");
    let title = text.slice(0,ind);
    return title.split(":")[1];
}

function updateTitle(workID, title) {
    let titleEle = document.getElementById('workOrderTitle');
    titleEle.textContent = title;

    let numEle = document.getElementById("workIDNum");
    numEle.textContent = workID;
    
}

function getResponse(ticketNumber, bulkData) {
    // returns a 2d array
    // of responses for ticket number using data from heroku server

    let ind = bulkData.search(ticketNumber)+12;
    let end = bulkData.slice(ind, bulkData.length).search("]]");
    let responses = bulkData.slice(ind, ind+end+2);
    responses = responses.replaceAll("[","").replaceAll("]","").split(",");
    return responses.splitEveryN(4);
}

function updatePrintLink(workID) {
    let iconEle = document.getElementById("printLink");
    iconEle.href = `prints/${workID}prints.pdf `;
}

function getTicketsCommand(workID) {
    httpTICKETS.open("GET", displayURL+dateStr);
    httpTICKETS.send();

    // let responseElement = document.getElementById('responses');
    // responseElement.innerHTML = "";

    httpTICKETS.onreadystatechange=(e)=> {
        let ticketList = getTickets(workID, httpTICKETS.responseText);
        let title = getTitle(workID, httpTICKETS.responseText);
        updateTickets(ticketList);
        updateTitle(workID, title);
        updatePrintLink(workID);
    }
    // fillWorkOrders();

    // let workIDElement = document.getElementById(`work${workID}`);
    // workIDElement.style.backgroundColor = "white";
    // workIDElement.style.color = "black";


}


function replaceDocument(itemID, text) {
    let p = document.getElementById(itemID);
    p.innerHTML = text;
}

fillWorkOrders();

// getResponseCommand('182005955');