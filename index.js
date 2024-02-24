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

    const inventoryList = document.getElementById("table-content")
    const decodeBtn = document.getElementById("decode")
    const newStockNum = document.getElementById("stock-number")
    const newVin = document.getElementById("vin")
    const newYear = document.getElementById("year")
    const newMake = document.getElementById("make")
    const newModel = document.getElementById("model")
    const addVehicleForm = document.getElementById("add-vehicle-form")
    const searchBtn = document.getElementById("search")
    const clearBtn = document.getElementById("clear")


    // Add new vehicle to current inventory list
    const addVehicle = () => {
        const vehicle = new Vehicle(newStockNum.value, newVin.value, newYear.value, newMake.value, newModel.value)
        console.log(vehicle)
        fetch(`http://localhost:3000/vehicles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(vehicle)
        })
            .catch(error => console.log(error))
    }

    addVehicleForm.addEventListener("submit", (e) => {
        addVehicle()
    })

    // Decode VIN and auto populate Year, Make and Model
    const decodeVin = (vin) => {
        console.log(vin)
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
                vehicles.forEach(vehicle => {
                    const tableContent = document.createElement("tr")
                    const deleteBtn = document.createElement("button")
                    deleteBtn.classList.add("delete-button")
                    deleteBtn.textContent = "Delete"
                    tableContent.innerHTML = `
                        <td>${vehicle.stock}</td>
                        <td>${vehicle.vin}</td>
                        <td>${vehicle.year}</td>
                        <td>${vehicle.make}</td>
                        <td>${vehicle.model}</td>
                    `
                    inventoryList.appendChild(tableContent)

                })

            })
            .catch(error => console.log(error))

        searchBtn.addEventListener("click", searchStock)
        clearBtn.addEventListener("click", clearFilter)
    }

    //Filter Inventory by Stock Number
    const searchStock = () => {

        // when I click search I want to pull the value from searchValue in a new array
        // I then want the container inventoryList to only show the new array
        // I want this formatted the same way as display vehicles

        const searchValue = document.getElementById("search-value").value.toLowerCase()
        fetch(`http://localhost:3000/vehicles`)
            .then(res => res.json())
            .then(vehicles => {
                const searchVehicleResult = vehicles.filter(vehicle => vehicle.stock.toLowerCase() === searchValue)
                inventoryList.innerHTML = ""
                //Since our filter returns a new array with the searchValue if we use if > 0 it will know that we actually returned an array
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
                        </tr>
                    `
                        inventoryList.appendChild(displayResult)
                    })
                } else {
                    const noResultMessage = document.createElement("li")
                    noResultMessage.textContent = "No vehicle found with that stock number"
                    inventoryList.appendChild(noResultMessage)

                }
            })
    }

    //clear filter
    const clearFilter = () => {
        inventoryList.innerHTML = ""
        displayVehicles()
    }

    //Delete Stock from current inventory list



    const main = () => {
        displayVehicles()

    }

    main()

})





