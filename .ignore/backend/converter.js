

let arguments = process.argv.slice(2)

let str = arguments[0].replace(/'/g, '"')

let json

try {
    json = JSON.parse(str)
}
catch {
    console.log('something went wrong');
    process.exit()
}


let newJson = {}

json.forEach( (k) => {
    newJson[k] = 0
} )


console.log(newJson)