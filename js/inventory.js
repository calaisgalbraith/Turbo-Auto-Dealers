renderCars()
async function renderCars (filterOptions = []) {
    let cars
    await $.getJSON("./data/cars.json", function(json) {
        const filteredCars = json.filter((car) => filterCars(car, filterOptions))
        cars = filteredCars;
    });
    let carHTML = ''
    
    if (cars.length === 0) { // if no cars in stock, display default message
        carHTML = `<div class="col defaultMessage">No cars currently in inventory. </br>
                Please call <a href="tel:555-877-5434">555-877-5434</a> to be notified when the 2024 Subaru Crosstrek is back in stock.</div>`
    }

    // if cars exist, display them
    for (const car in cars) {
        const displayCar = cars[car]
        let mileage = ''
        let condition = ''
        if (!displayCar.mileage) { // if used car (mileage !== 0)
             mileage = `<li class="list-group-item">Mileage: $${displayCar.mileage}</li>`
        }
        carHTML += `
            <div class="col">
                <div class="card">
                <img src="${displayCar.imgSrc}" class="card-img-top" alt="${displayCar.altTxt}">
                <div class="card-header">
                    ${displayCar.condition} ${displayCar.year} ${displayCar.model}
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">MSRP: $${displayCar.price}</li> 
                        <li class="list-group-item">Color: ${displayCar.color} <i class="bi bi-circle-fill" style="color: ${displayCar.color}"></i></li>
                        <li class="list-group-item">Fuel Type: ${displayCar.fuel} <i class="bi ${displayCar.fuelIcon}"></i></li>
                    </ul>
                </div>
                </div>
            </div>`
    }
    $('.inventoryContainer').html(carHTML)
}

// Filter cars based on user selected filters
function filterCars (car, filterOptions) {
    let returnCar = true
    for (let key in filterOptions) {
        if (filterOptions[key] === '') { // if no filter applied for field, continue
            continue
        }
        if (filterOptions[key] !== car[key].toLowerCase()) { // check if car value matches filter value
            returnCar = false
            break
        }
    }
    return returnCar
}

// Func to filter buttons when filter inventory btn clicked
$('#filterInventoryBtn').click((e) => {
    e.preventDefault()
    const filterOptions = {
        "model": $('#modelSelect').val(),
        "condition": $('#conditionSelect').val(),
        "color": $('#colorSelect').val(),
        "year": $('#yearSelect').val(),
        "fuel": $('#fuelSelect').val(),
    }
    renderCars(filterOptions)
})

$('#clearFiltersBtn').click((e) => { // on click, clear filters & update displayed cars
    e.preventDefault()
    clearFilters()
    renderCars()
})

// Clear form filters, reset selects
function clearFilters () {
    $('#modelSelect').prop('selectedIndex',0);
    $('#conditionSelect').prop('selectedIndex',0);
    $('#colorSelect').prop('selectedIndex',0);
    $('#yearSelect').prop('selectedIndex',0);
    $('#fuelSelect').prop('selectedIndex',0);
}

// Toggle filter panel
$('.filterToggle button').click((e) => {
    e.preventDefault()
    $('#filterInventoryOptions').toggle()
})