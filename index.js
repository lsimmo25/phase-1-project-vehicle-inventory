class Vehicle {
    constructor(stock, vin, type, year, make, model, odom, msrp, listPrice) {
        this.stock = stock
        this.vin = vin
        this.type = type
        this.year = year
        this.make = make
        this.model = model
        this.odom = odom
        this.msrp = msrp
        this.listPrice = listPrice

    }

}

document.addEventListener("DOMContentLoaded", () => {

})

//function that uses https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/

const decodeVin = (vin) => {
    return fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}*BA?format=json&modelyear=2011/`)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}

//render current inventory

//filter inventory
