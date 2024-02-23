class Vehicle {
    constructor(stock, vin, year, make, model) {
        this.stock = stock
        this.vin = vin
        this.year = year
        this.make = make
        this.model = model
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const inventoryList = document.getElementById("inventory-list")



//function that uses https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/

const decodeVin = (vin) => {
    return fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}*BA?format=json&modelyear=2011/`)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}

//render current inventory
const displayVehicles = () => {
    fetch(`http://localhost:3000/vehicles`)
        .then(res => res.json())
        .then(vehicles => {
            vehicles.forEach(vehicle => {
                console.log(vehicle)
                const listItem = document.createElement("li")
                listItem.textContent = `Stock: ${vehicle.stock} | VIN: ${vehicle.vin} | Year: ${vehicle.year} | Make: ${vehicle.make} | Model: ${vehicle.model}`
                inventoryList.appendChild(listItem)
            })
        })
        .catch(error => console.log(error))
}

//filter inventory

const main = () => {
    displayVehicles()
}

main()

})