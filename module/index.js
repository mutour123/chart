const fs = require('fs')

exports.getChart = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./view/chart.html', function (err, data) {
            if (err) {
                reject(err)
            }
            data = data.toString()
            resolve(data)
        })
    })
}

exports.getLogin = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./login.html', function (err, data) {
            if (err) {
                reject(err)
            }
            data = data.toString()
            resolve(data)
        })
    })
}