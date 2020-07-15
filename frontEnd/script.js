const httpTICKETS = new XMLHttpRequest();
const httpWORKIDS = new XMLHttpRequest();
const httpRESPONSES = new XMLHttpRequest();

const displayURL = "http://127.0.0.1:5000/display/"

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

const date = new Date();
const dateStr = `${date.getFullYear()}-${(date.getMonth()+1).pad(1)}-${date.getDate()}`;

function getData(date) {
    http.open("GET",displayURL+date);
    http.send();

    http.onreadystatechange=(e)=>{
        let ticketList = getTickets(206,http.responseText);
        updateTickets(ticketList);
    }
}

function updateTickets(ticketList) {
    ticketsElement = document.getElementById('tickets');
    let i;

    finalHTML = "";
    for(i=0; i<ticketList.length; i++) {
        finalHTML += `<a href="#" onclick="getResponseCommand(${ticketList[i]})">`;
        finalHTML += `<div id="t${ticketList[i]}" class="ticket">${ticketList[i]}</div>`;
        finalHTML += `</a>`;
    }
    ticketsElement.innerHTML = finalHTML;
}

function getWorkIDs(bulkData) {
    // takes in data from heroku server
    // returns list of work order ids
    let ind = bulkData.search("abcabc");
    let ids = bulkData.slice(ind+8, bulkData.length-1);
    ids = ids.replaceAll(" ","").split(",");
    return ids;
}


{/* <a href="#" onclick="getTicketsCommand(230);"><div id="work230"> */}
{/* <p>230</p> */}
{/* </div></a> */}





function updateWorkIDs(ids) {
    sidebarElement = document.getElementById("sidebar");
    let i;

    finalHTML = "";
    for(i=0; i<ids.length; i++) {
        finalHTML += `<a href="#" onclick="getTicketsCommand(${ids[i]});">`
        finalHTML += `<div id="work${ids[i]}"><p>${ids[i]}</p>`;
        finalHTML += `</div></a>`;
    }
    sidebarElement.innerHTML = finalHTML;
}

function fillWorkOrders() {
    httpWORKIDS.open("GET", displayURL+dateStr);
    httpWORKIDS.send();

    httpWORKIDS.onreadystatechange=(e)=> {
        let workIDs = getWorkIDs(httpWORKIDS.responseText);
        updateWorkIDs(workIDs);
    }
}

function getTickets(workID, bulkData) {
    // takes in wordID & data from heroku server
    // and pops out an array with the tickets for that work order
    let ind = bulkData.search("xyzxyz");
    let ticketList = bulkData.slice(ind+7, bulkData.length);

    ind = ticketList.search(`'${String(workID)}'`);
    ticketList = ticketList.slice(ind+7, ticketList.length);
    let end  = ticketList.search("'],");

    ticketList = ticketList.slice(0, end+2);
    // console.log(`${ticketList}`);

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
    finalHTML += `<tr><th class="tab1">Utility</th><th class="tab2">Response</th><th class="tab3">Notes</th>`;
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

function getResponseCommand(ticketNumber) {
    httpRESPONSES.open("GET", displayURL+dateStr);
    httpRESPONSES.send();

    httpRESPONSES.onreadystatechange=(e)=> {
        let responses = getResponse(ticketNumber, httpRESPONSES.responseText);
        updateResponses(responses);
    }
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

function getTicketsCommand(workID) {
    httpTICKETS.open("GET", displayURL+dateStr);
    httpTICKETS.send();

    // let responseElement = document.getElementById('responses');
    // responseElement.innerHTML = "";

    httpTICKETS.onreadystatechange=(e)=> {
        let ticketList = getTickets(workID, httpTICKETS.responseText);
        updateTickets(ticketList);
    }
    // fillWorkOrders();


}


function replaceDocument(itemID, text) {
    let p = document.getElementById(itemID);
    p.innerHTML = text;
}

fillWorkOrders();

// getResponseCommand('182005955');