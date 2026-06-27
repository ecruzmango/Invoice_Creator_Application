/*
 * This file contains the code for the recent searches feature of the invoice creator app. It allows users to save 
 * and view their recent searches for client information, such as company name and client name. The recent searches are
 * displayed in a table format, and users can click on a search to populate the form with the corresponding client information.
 */

const RECENT_SEARCHES_KEY = 'recentSearches';
const recentSearchesBody = document.getElementById('recent-searches-body');
// const insertButton = document.getElementById('insert-info-button');

let recentSearches = [];

window.recentSearchesApp = {
    saveClient: saveClient,
    renderTable: renderTable,
}

// Load recent searches from local storage when the page loads
function saveRecentSearches() {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
}

function loadRecentSearches() {
    const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);

    if (storedSearches) {
        recentSearches = JSON.parse(storedSearches);
    }

    renderTable();
}


function normalizeText(text) {
    return text.trim().toLowerCase();
}

function saveClient(clientInfo) {
    // client info should be an object with the following properties: companyName, clientName, address, phoneNumber, email
    console.log('Saving client info:', clientInfo);
    // check if the client info already exists in the recent searches
    const existingIndex = recentSearches.findIndex(search => 
        normalizeText(search.companyName) === normalizeText(clientInfo.companyName) &&
        normalizeText(search.clientName) === normalizeText(clientInfo.clientName) &&
        normalizeText(search.clientAddress) === normalizeText(clientInfo.clientAddress)
    );

    if (existingIndex !== -1) {
        // increase the count of the existing search
        recentSearches[existingIndex].count += 1;
    }
    else {
        // add the new client info to the recent searches
        recentSearches.push({
            ...clientInfo,
            count: 1
        });
    }

    // sort the recent searches by count in descending order
    recentSearches.sort((a, b) => b.count - a.count);

    // keep only the top 8 recent searches
    if (recentSearches.length > 8) {
        recentSearches = recentSearches.slice(0, 8);
    }

    saveRecentSearches();
    renderTable();
}

function deleteClient(clientInfo) {
    // find the index of the client info in the recent searches
    const index = recentSearches.findIndex(search => 
        normalizeText(search.companyName) === normalizeText(clientInfo.companyName) &&
        normalizeText(search.clientName) === normalizeText(clientInfo.clientName) &&
        normalizeText(search.clientAddress) === normalizeText(clientInfo.clientAddress)
    );

    if (index !== -1) {
        // remove the client info from the recent searches
        recentSearches.splice(index, 1);
        renderTable();
    }

}

function renderTable() {
    recentSearchesBody.innerHTML = '';

    recentSearches.forEach(search => {
        const row = document.createElement('tr');
        
        const companyNameCell = document.createElement('td');
        companyNameCell.textContent = search.companyName;
        row.appendChild(companyNameCell);

        const clientNameCell = document.createElement('td');
        clientNameCell.textContent = search.clientName;
        row.appendChild(clientNameCell);

        const countCell = document.createElement('td');
        countCell.textContent = search.count;
        row.appendChild(countCell);

        // add an "insert info" button to each row
        const buttonCell = document.createElement('td');

        // create the button element
        const insertButton = document.createElement('button');
        insertButton.textContent = 'Insertar Información';
        insertButton.className = 'insert-info';

    
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar Información';
        deleteButton.className = 'delete-search-info';        
        

        insertButton.onclick = function() {
            console.log('Insertar Información button clicked for:', search);
            window.InvoiceApp.fillClientInfo(search);
        };
        
        deleteButton.onclick = function() {
            console.log('Eliminar Información button clicked for:', search);
            deleteClient(search);
        }

        buttonCell.appendChild(insertButton);
        buttonCell.appendChild(deleteButton);
        row.appendChild(buttonCell);

        recentSearchesBody.appendChild(row);
    });
}

loadRecentSearches();