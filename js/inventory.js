renderCars()
async function renderCars (filterOptions = []) {
    let cars = []
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
                        <li class="list-group-item">Miles: ${displayCar.mileage}</li> 
                        <li class="list-group-item">Color: ${displayCar.color} <i class="${displayCar.colorIcon}" style="color: ${displayCar.colorCode}"></i></li>
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
    for (const [key, value] of Object.entries(filterOptions)) {
        if (!value.length) { // if length is 0 (no filter value), continue
            continue
        }
        if (key === 'price' || key === 'mileage') {// mileage & msrp filtering
            if (Number(car[key].replace(',', '')) > Number(value[0])) { //  car price/mileage is > filtered price/mileage
                returnCar = false
                break
            }
        } else {
            let matchedFilter = false
            for (let i = 0; i < value.length; i++) {
                if (value[i] === car[key].toLowerCase()) { // check if car value matches one of the filter values (ex: filtering by crosstrek or ascent)
                    matchedFilter = true
                    break
                }
            }
            returnCar = matchedFilter // set value to if car matched one of the filters (ex: was crosstrek or ascent)
        }
    }
    return returnCar
}


// Func to filter buttons when filter inventory btn clicked
$('#filterInventoryBtn').click((e) => {
    e.preventDefault()
    const filterOptions  = {}
    for (let i = 0; i < selectIds.length; i++) {
        filterOptions[selectIds[i].value] = selectIds[i].select.getSelected()
    }
    filterOptions.mileage = [$('#mileageRange').val()] // set ranges as array to standardize filter data types
    filterOptions.price = [$('#msrpRange').val()]
    renderCars(filterOptions)
    $('.filterToggle button').html('<i class="bi bi-filter-square-fill"></i>Filter') // change filter btn fill to indicate filtering
    $('#filterInventoryOptions').slideToggle("40")
})

// on click, clear filters & update displayed cars
$('#clearFiltersBtn').click((e) => {
    e.preventDefault()
    clearFilters()
    renderCars()
    $('.filterToggle button').html('<i class="bi bi-filter"></i>Filter') // change filter btn fill to indicate no filtering
    $('#filterInventoryOptions').slideToggle("40")
})

// Clear form filters, reset selects
function clearFilters () {
    for (let i = 0; i < selectIds.length; i++) {
        selectIds[i].select.setSelected('') // reset values
    }
}

// Toggle filter panel
$('.filterToggle button').click((e) => {
    e.preventDefault()
    $('#filterInventoryOptions').slideToggle("40")
})

// When slider is changed, update max value
$('#mileageRange').on('input', (e) => {
    $('#mileageMax').val(e.target.value)
})

$('#msrpRange').on('input', (e) => {
    $('#msrpMax').val(e.target.value)
})

// Slim Select Logic
const selectIds = [
    {
        id: '#modelSelect',
        placeholderText: 'Select Model',
        value: "model"
    },
    {
        id: '#conditionSelect',
        placeholderText: 'Select Condition',
        value: "condition"
    },
    {
        id: '#colorSelect',
        placeholderText: 'Select Color',
        value: "color"
    },
    {
        id: '#yearSelect',
        placeholderText: 'Select Year',
        value: "year"
    },
    {
        id: '#fuelSelect',
        placeholderText: 'Select Fuel',
        value: "fuel"
    }
]
renderSlimSelects()
function renderSlimSelects () { // render slim selects for select inputs
    for (let i = 0; i < selectIds.length; i++) {
        selectIds[i].select = new SlimSelect({ // add select to track getting/clearing data
            select: selectIds[i].id,
            settings: {
                placeholderText: selectIds[i].placeholderText,
              }
        })
    }
}