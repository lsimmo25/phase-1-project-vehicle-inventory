document.addEventListener("DOMContentLoaded", () => {
    //Vehicle Class
    class Vehicle {
        constructor(stock, vin, year, make, model) {
            this.stock = stock
            this.vin = vin
            this.year = year
            this.make = make
            this.model = model
        }

    }

    //Inventory Container
    const inventoryList = document.getElementById("table-content")

    //Form Inputs
    const addVehicleForm = document.getElementById("add-vehicle-form")
    const newStockNum = document.getElementById("stock-number")
    const newVin = document.getElementById("vin")
    const newYear = document.getElementById("year")
    const newMake = document.getElementById("make")
    const newModel = document.getElementById("model")

    //Buttons
    const searchBtn = document.getElementById("search")
    const clearBtn = document.getElementById("clear")
    const decodeBtn = document.getElementById("decode")


    // Add new vehicle to current inventory list
    const addVehicle = () => {
        const vehicle = new Vehicle(newStockNum.value, newVin.value, newYear.value, newMake.value, newModel.value)
        fetch(`http://localhost:3000/vehicles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(vehicle)
        })
        .then(() => {
            displayVehicles()
        })
        .catch(error => console.log(error))
    }

    addVehicleForm.addEventListener("submit", (e) => {
        e.preventDefault()
        addVehicle()
    })

    // Decode VIN and auto populate Year, Make and Model
    const decodeVin = (vin) => {
        return fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}*BA?format=json&modelyear=2011`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                newYear.value = data.Results[0].ModelYear
                newMake.value = data.Results[0].Make
                newModel.value = data.Results[0].Model
            })
            .catch(error => console.log(error))
    }

    decodeBtn.addEventListener("click", () => {
        const newVin = document.getElementById("vin").value
        decodeVin(newVin)
    })

    //Render current inventory
    const displayVehicles = () => {
        fetch(`http://localhost:3000/vehicles`)
            .then(res => res.json())
            .then(vehicles => {
                inventoryList.innerHTML = ""
                vehicles.forEach(vehicle => {
                    const tableContent = document.createElement("tr")
                    tableContent.innerHTML = `
                        <td>${vehicle.stock}</td>
                        <td>${vehicle.vin}</td>
                        <td>${vehicle.year}</td>
                        <td>${vehicle.make}</td>
                        <td>${vehicle.model}</td>
                        <td><button type="button" class="delete-button" id="delete-button">X</button></td>
                    `
                    inventoryList.appendChild(tableContent)

                    //Event listener to delete inventory
                    tableContent.querySelector(".delete-button").addEventListener("click", () => {
                        deleteVehicle(vehicle)
                    })

                })

            })
            .catch(error => console.log(error))
        //Event listeners to filter and clear filter
        searchBtn.addEventListener("click", searchStock)
        clearBtn.addEventListener("click", clearFilter)


        document.getElementById("search-value").addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                searchStock()
            }
        })


    }

    //Filter Inventory by Stock Number
    const searchStock = () => {
        const searchValue = document.getElementById("search-value").value.toLowerCase()
        fetch(`http://localhost:3000/vehicles`)
            .then(res => res.json())
            .then(vehicles => {
                const searchVehicleResult = vehicles.filter(
                    vehicle => vehicle.stock.toLowerCase() === searchValue ||
                    vehicle.vin.toLowerCase() === searchValue ||
                    vehicle.year.toLowerCase() === searchValue ||
                    vehicle.make.toLowerCase() === searchValue ||
                    vehicle.model.toLowerCase() === searchValue     
                    )
                inventoryList.innerHTML = ""
                //Check to see if result is an array with a value
                if (searchVehicleResult.length > 0) {
                    searchVehicleResult.forEach(vehicle => {
                        const displayResult = document.createElement("tr")
                        displayResult.innerHTML = `
                        <tr>
                            <td>${vehicle.stock}</td>
                            <td>${vehicle.vin}</td>
                            <td>${vehicle.year}</td>
                            <td>${vehicle.make}</td>
                            <td>${vehicle.model}</td>
                            <td><button type="button" class="delete-button">X</button></td>
                        </tr>
                    `
                        //Event listner to delete searched result vehicle
                        displayResult.querySelector(".delete-button").addEventListener("click", () => {
                            deleteVehicle(vehicle)
                        })

                        inventoryList.appendChild(displayResult)
                    })
                } else {
                    const noResultMessage = document.createElement("tr")
                    noResultMessage.innerHTML = `<td colspan="6">No vehicle found with that stock number</td>`
                    inventoryList.appendChild(noResultMessage)

                }
            })
    }

    //Clear Filter
    const clearFilter = () => {
        inventoryList.innerHTML = ""
        displayVehicles()
    }

    //Delete Stock from current inventory list
    const deleteVehicle = (vehicle) => {
        fetch(`http://localhost:3000/vehicles/${vehicle.id}`, {
            method: "DELETE"
        })
        .then(() => {
            displayVehicles()
        })
        .catch(error => console.log(error))

    }



    const main = () => {
        displayVehicles()
    }

    main()

})





