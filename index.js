// ADDing a comment to test the git commit hook

// Host information
const hostName = document.getElementById('host-name');
const hostAddress = document.getElementById('host-address');
const phoneNumber = document.getElementById('host-phone-number');
const email = document.getElementById('host-email');

// Client information
const companyName = document.getElementById('company-name');
const clientName = document.getElementById('client-name');
const invoiceDate = document.getElementById('invoice-date');
const clientAddress = document.getElementById('client-address');
const invoiceNumber = document.getElementById('invoice-number');
const PO_Number = document.getElementById('PO-number');

// Item information
const totalRowPrice = document.getElementById('total-row-price');

// Footer information
// const notes = document.getElementById('notes').value;
const totalAmount = document.getElementById('total-amount');

// buttons
const submitButton = document.getElementById('submit-button');
const addItemButton = document.getElementById('add-item-button');
const removeItemButton = document.getElementById('remove-item-button');

let isDefaultInvoice = true;
let isDefaultClientInfo = true;
let itemsTasks = [];

if (isDefaultInvoice) {
    // set default values for the invoice
    hostName.value = "Cruz Painting";
    hostAddress.value = "601 St Cloud Dr, Antioch, TN 37013";
    phoneNumber.value = "(615) 293-9856";
    email.value = "cruzpainting015@gmail.com";
}

if (isDefaultClientInfo) {
    // set default values for the client information
    // companyName.value = "Client Company Name";
    // clientName.value = "Client Name";
    invoiceDate.value = new Date().toISOString().split('T')[0]; // set to today's date in YYYY-MM-DD format
    // clientAddress.value = "Client Address";
    // invoiceNumber.value = "INV-001";
    // PO_Number.value = "PO-001";
}

function createItemRow(){
    // find item container 
    let container = document.querySelector('.item-container');

    // Create a new item row with the same structure as the existing item row
    let newRow = document.createElement('div');
    newRow.className = 'item-row';

    // put inputs inside the new row
    newRow.innerHTML = `
        <input
            type="text"
            placeholder="Description of item/service..."
            class="input-field item-description">

        <input
            type="number"
            placeholder="1"
            class="input-field item-quantity">

        <input
            type="number"
            placeholder="$ 0"
            class="input-field item-unit-price">

        <p class="input-field item-total">$0.00</p>
    `;

    // add the new row to the container
    container.appendChild(newRow);

    // attach event listeners to the new row
    attachRowEvents(newRow);

    // console.log('New row created: ' + newRow);
}

function removeItemRow(){
    let itemRows = document.querySelectorAll('.item-row');
    if (itemRows.length > 1) {
        itemRows[itemRows.length - 1].remove();
        console.log('Last item row removed');
    } else {
        alert('Cannot remove the last item row');
        console.log('Cannot remove the last item row');
    }
}

function readItemRow(row){
    // read the values from the row and return them as an object
    // we use class selectors to get the values from the inputs inside the row
    //! we don't use id selectors because there are multiple rows with the same structure and we want to get the values 
    // from the specific row that was passed to the function
    let description = row.querySelector('.item-description').value;
    let quantity = row.querySelector('.item-quantity').value;
    let unitPrice = row.querySelector('.item-unit-price').value;

    // convert quantity and unitPrice to numbers
    quantity = parseInt(quantity);
    unitPrice = parseFloat(unitPrice);

    return {
        description: description,
        quantity: quantity,
        unitPrice: unitPrice
    };

}

function getAllValidItems(){
    // clear the itemsTasks array
    itemsTasks = []

    // get all item rows
    let itemRows = document.querySelectorAll('.item-row');

    // loop through each row and read the values
    for (let i = 0; i < itemRows.length; i++) {
        let row = itemRows[i];
        let item = readItemRow(row);

        // check if the item is valid (description is not empty, quantity and unitPrice are numbers)
        if (!isNaN(item.quantity) && !isNaN(item.unitPrice)) {
            itemsTasks.push(item);
            console.log('Valid item added: ' + JSON.stringify(item));
        } else {
            console.log('Invalid item skipped: ' + JSON.stringify(item));
        }
    }
    return itemsTasks;
}

function calculateRowTotal(row){
    // read quantity & unit price
    let quantity = row.querySelector(".item-quantity").value;
    let unitPrice = row.querySelector(".item-unit-price").value;

    let totalRowPrice = quantity * unitPrice;

    return totalRowPrice;
}

function calculateInvoiceTotal() {
    // loops through all itemTasks and calculates the total amount for the invoice
    let invoiceTotal = 0;
    for (let i = 0; i < itemsTasks.length; i++) {
        let item = itemsTasks[i];
        invoiceTotal  += item.quantity * item.unitPrice;
    }

    // console.log('Total amount calculated: ' + invoiceTotal);
    return invoiceTotal;
}


function attachRowEvents(row){
    // find quantity & unit price inside this row
    let quantityInput = row.querySelector(".item-quantity");
    let unitPriceInput = row.querySelector(".item-unit-price");
    let totalRowPriceElement = row.querySelector(".item-total");

    // add input event listeners to quantity & unit price inputs
    quantityInput.addEventListener("input", function() {
        let totalRowPrice = calculateRowTotal(row);
        totalRowPriceElement.textContent = '$' + totalRowPrice.toFixed(2);

        updateInvoiceTotalDisplay();
        
    });

    unitPriceInput.addEventListener("input", function() {
        let totalRowPrice = calculateRowTotal(row);
        totalRowPriceElement.textContent = '$' + totalRowPrice.toFixed(2);

        updateInvoiceTotalDisplay();
    });

}

function updateInvoiceTotalDisplay(){
    // get all valid items
    getAllValidItems();
    
    // calculate the total amount for the invoice
    let invoiceTotal = calculateInvoiceTotal();
    totalAmount.textContent = 'Total Amount: $' + invoiceTotal.toFixed(2);
}


// Attach event listeners to existing item rows
document.querySelectorAll('.item-row').forEach(function(row) {
    attachRowEvents(row);
});


// TODO: Validate the inputs & have functions to collect the data from the inputs and return them as an object to be used in the PDF generation
function validateInputs() {

    // make sure certain fields are not empty
    if (!hostName.value || !phoneNumber.value || !email.value) {
        alert('Please fill in all host information fields.');
        return false;
    }
    
    if (!companyName.value || !clientName.value) {
        alert('Please fill in all client information fields.');
        return false;
    }

    // Validate item rows
    let itemRows = document.querySelectorAll('.item-row');
    for (let i = 0; i < itemRows.length; i++) {
        let row = itemRows[i];
        let item = readItemRow(row);
        if (!item.description || isNaN(item.quantity) || isNaN(item.unitPrice)) {
            alert('Please fill in all item fields correctly.');
            return false;
        }
    }
    return true;
}

function collectHostInfo() {
    // collect host information from the input fields and return as an object
    let hostInfo = {
        name: hostName.value,
        address: hostAddress.value,
        phone: phoneNumber.value,
        email: email.value
    };
    
    return hostInfo;

}

function collectClientInfo() {
    // collect client information from the input fields and return as
    let clientInfo = {
        companyName: companyName.value,
        clientName: clientName.value,
        clientAddress: clientAddress.value,
        // invoiceNumber: invoiceNumber.value,
        // PO_Number: PO_Number.value
    };

    return clientInfo;
}

function collectInvoiceInfo() {
    // collect invoice information from the input fields and return as
    let invoiceInfo = {
        invoiceDate: invoiceDate.value,
        invoiceNumber: invoiceNumber.value,
        PO_Number: PO_Number.value,
        // get the total amount from the totalAmount element but remove the "Total Amount: $" prefix 
        totalAmount: totalAmount.textContent.replace('Total Amount: $', '')
        
    };

    return invoiceInfo;
}

function collectItems(){
    // collect items information from the input fields and return as
    let itemsInfo = [];
    for (let i = 0; i < itemsTasks.length; i++) {
        let item = itemsTasks[i];
        itemsInfo.push({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        });
    }

    return itemsInfo;

}

function collectInvoiceData(){
    // collect invoice data from the input fields and return as
    let invoiceData = {
        hostInfo: collectHostInfo(),
        clientInfo: collectClientInfo(),
        itemsInfo: collectItems(),
        invoiceInfo: collectInvoiceInfo()
    };
    return invoiceData;
}


// TODO: Generate PDF using jsPDF and jsPDF-AutoTable
/**
 * THis first portion is in charge of setting up the PDF theme, including colors, font sizes, and margins. 
 * The second portion is in charge of generating the PDF using the collected invoice data.
 */

const PDF_THEME = {
    colors: {
        primary: [37, 99, 235],
        dark: [17, 24, 39],
        gray: [100, 116, 139],
        lightGray: [245, 247, 250],
        border: [220, 220, 220],
        white: [255, 255, 255]
    },

    fontSize: {
        company: 20,
        invoiceTitle: 28,
        heading: 12,
        body: 10,
        small: 8
    },

    margin: {
        left: 20,
        right: 20
    }
};


//! Function to generate the PDF invoice
function generateInvoicePDF(invoiceData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    drawHeader(doc, invoiceData);
    drawInvoiceInfo(doc, invoiceData);
    drawClientInfo(doc, invoiceData);
    drawItemsTable(doc, invoiceData);
    drawTotals(doc, invoiceData);
    drawFooter(doc, invoiceData);

    doc.save("invoice.pdf");
}

/**
 * This is the second portion of the code that is in charge of generating the PDF using the collected invoice data.
 * There are several functions that are responsible for drawing different sections of the PDF, such as the header, invoice info, client info, items table, totals, and footer.
 * Each function takes in the jsPDF document object and the invoice data as parameters, and uses the jsPDF API to draw the content on the PDF.
 * TODo: The drawHeader function is responsible for drawing the header
 * TODO: The drawInvoiceInfo function is responsible for drawing the invoice information section
 *  etc.
 */

function drawHeader(doc, invoiceData) {
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(...PDF_THEME.colors.primary);
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setTextColor(...PDF_THEME.colors.white);
    doc.setFontSize(PDF_THEME.fontSize.company);
    doc.setFont(undefined, "bold");

    doc.text(invoiceData.hostInfo.name.toUpperCase(), pageWidth / 2, 18, {
        align: "center"
    });

    doc.setTextColor(...PDF_THEME.colors.dark);
}

function drawInvoiceInfo(doc, invoiceData) {
    const leftX = PDF_THEME.margin.left;
    let y = 45;

    doc.setFontSize(PDF_THEME.fontSize.invoiceTitle);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...PDF_THEME.colors.dark);
    doc.text("INVOICE", leftX, y);

    y += 12;

    doc.setFontSize(PDF_THEME.fontSize.body);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...PDF_THEME.colors.gray);

    doc.text(invoiceData.hostInfo.address, leftX, y, { maxWidth: 60 });
    y += 6;

    doc.text(invoiceData.hostInfo.phone, leftX, y);
    y += 6;

    doc.text(invoiceData.hostInfo.email, leftX, y);
}

function drawClientInfo(doc, invoiceData) {
    const rightX = 115;
    let y = 45;

    doc.setFontSize(PDF_THEME.fontSize.heading);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...PDF_THEME.colors.primary);
    doc.text("BILL TO", rightX, y);

    y += 8;

    doc.setFontSize(PDF_THEME.fontSize.body);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...PDF_THEME.colors.dark);

    doc.text("Client Name: " + invoiceData.clientInfo.clientName, rightX, y);
    y += 6;

    doc.text("Company Name: " + invoiceData.clientInfo.companyName, rightX, y);
    y += 6;

    doc.text(invoiceData.clientInfo.clientAddress, rightX, y, { maxWidth: 70 });

    y += 16;

    doc.setFont(undefined, "bold");
    doc.text("Invoice #: ", rightX, y);
    doc.setFont(undefined, "normal");
    doc.text(invoiceData.invoiceInfo.invoiceNumber, rightX + 22, y);

    y += 6;

    doc.setFont(undefined, "bold");
    doc.text("Date: ", rightX, y);
    doc.setFont(undefined, "normal");
    doc.text(invoiceData.invoiceInfo.invoiceDate, rightX + 22, y);

    y += 6;

    doc.setFont(undefined, "bold");
    doc.text("PO #: ", rightX, y);
    doc.setFont(undefined, "normal");
    doc.text(invoiceData.invoiceInfo.PO_Number, rightX + 22, y);
}

function drawItemsTable(doc, invoiceData) {
    const tableRows = invoiceData.itemsInfo.map(function(item) {
        const cost = item.quantity * item.unitPrice;

        return [
            item.description || "",
            item.quantity.toString(),
            "$" + item.unitPrice.toFixed(2),
            "$" + cost.toFixed(2)
        ];
    });

    doc.autoTable({
        startY: 125,
        head: [["Description", "Quantity", "Unit Price", "Cost"]],
        body: tableRows,

        margin: {
            left: PDF_THEME.margin.left,
            right: PDF_THEME.margin.right
        },

        styles: {
            fontSize: PDF_THEME.fontSize.body,
            cellPadding: 4,
            lineColor: PDF_THEME.colors.border,
            lineWidth: 0.2
        },

        headStyles: {
            fillColor: PDF_THEME.colors.dark,
            textColor: PDF_THEME.colors.white,
            fontStyle: "bold"
        },

        alternateRowStyles: {
            fillColor: PDF_THEME.colors.lightGray
        },

        columnStyles: {
            0: { cellWidth: 75 },
            1: { cellWidth: 25, halign: "right" },
            2: { cellWidth: 35, halign: "right" },
            3: { cellWidth: 35, halign: "right" }
        }
    });
}

function drawTotals(doc, invoiceData) {
    let finalY = doc.lastAutoTable.finalY + 12;

    doc.setFillColor(...PDF_THEME.colors.lightGray);
    doc.roundedRect(120, finalY - 8, 70, 25, 3, 3, "F");

    doc.setFontSize(PDF_THEME.fontSize.body);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...PDF_THEME.colors.gray);

    doc.text("Subtotal:", 128, finalY);
    doc.text(invoiceData.invoiceInfo.totalAmount, 184, finalY, {
        align: "right"
    });

    finalY += 9;

    doc.setFont(undefined, "bold");
    doc.setTextColor(...PDF_THEME.colors.primary);

    doc.text("Total:", 128, finalY);
    doc.text(invoiceData.invoiceInfo.totalAmount, 184, finalY, {
        align: "right"
    });
}

function drawFooter(doc, invoiceData) {
    const pageHeight = doc.internal.pageSize.getHeight();
    const leftX = PDF_THEME.margin.left;

    doc.setDrawColor(...PDF_THEME.colors.border);
    doc.line(leftX, pageHeight - 35, 190, pageHeight - 35);

    doc.setFontSize(PDF_THEME.fontSize.small);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...PDF_THEME.colors.gray);

    doc.text("Thank you for your business!", leftX, pageHeight - 25);
    doc.text("Questions? Contact: " + invoiceData.hostInfo.email, leftX, pageHeight - 18);
}

phoneNumber.addEventListener('input', (event) => {
    // strip all non-numeric characters from the input
    let input = event.target.value.replace(/\D/g, '');
    let formattedInput = '';

    // format the input as (XXX) XXX-XXXX
    if (input.length > 0) {
        formattedInput += '(' + input.substring(0, 3);
    }
    if (input.length >= 4) {
        formattedInput += ') ' + input.substring(3, 6);
    }
    if (input.length >= 7) {
        formattedInput += '-' + input.substring(6, 10);
    }

    // set the formatted value back to the input field
    event.target.value = formattedInput;

});  

submitButton.onclick = function() {
    if (validateInputs()) {

        getAllValidItems();
        updateInvoiceTotalDisplay();

        let invoiceData = collectInvoiceData();

        // Save the client information to recent searches
        if (window.recentSearchesApp) {
            window.recentSearchesApp.saveClient(invoiceData.clientInfo);
        }

        console.log('Invoice data collected: ', collectInvoiceData());

        generateInvoicePDF(invoiceData);

    } else {
        console.log('Validation failed. Invoice not generated.');
    }

}

addItemButton.onclick = function() {
    createItemRow();    

}

removeItemButton.onclick = function() {
    removeItemRow();
}

// Talk to recentSearches.js to save the client information when the user 
// clicks the "Insert Info" button
window.InvoiceApp = {
    collectClientInfo: collectClientInfo,
    collectInvoiceData: collectInvoiceData,

fillClientInfo: function(clientInfo) {
    console.log("Filling client info:", clientInfo);

    companyName.value = clientInfo.companyName;
    clientName.value = clientInfo.clientName;
    clientAddress.value = clientInfo.clientAddress;

    console.log("Inputs after fill:", {
        companyName: companyName.value,
        clientName: clientName.value,
        clientAddress: clientAddress.value
    });
}
};


