const fs = require('fs')
const axios = require('axios');
class Busqueda {

    historial = []
    dbpth = './db/database.json'

    constructor() {
        // leer db si existe
        this.leerDB()
    }

    get historialCapitalizado() {

        return this.historial.map(lugar => {
            let palabras = lugar.split(' ')

            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))
            return palabras.join(' ')
        })

    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsWethers() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'

        }
    }

    async ciudad(lugar = "") {



        try {
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            const resp = await intance.get();

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return []
        }
        // http://api.openweathermap.org/data/2.5/weather?lat=3.44&lon=-76.51972&appid=604d0573b0e5db477c38c312fd4bb6f5&units=metric&lang=es
    }

    async climalugar(lat, lon) {
        try {
            const intance = axios.create({
                    baseURL: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                    params: this.paramsWethers
                })
                // instancia de axios.create()
            const resp = await intance.get()
            const { temp_min, temp_max, temp } = resp.data.main
            const { description } = resp.data.weather[0]
                // console.log(resp.data.main)

            return {
                des: description,
                min: temp_min,
                max: temp_max,
                temp: temp

            }






        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial(lugar = "") {
        // prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return
        }
        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        // grabar en db
        this.guardarBD()
            // this.leerDB()
    }

    guardarBD() {

        const payload = {
            historial: this.historial
        };
        // console.log(payload);

        fs.writeFileSync(this.dbpth, JSON.stringify(payload));

    }


    leerDB() {

        //debe de existir...
        if (!fs.existsSync(this.dbpth)) {
            return;
        }
        const info = fs.readFileSync(this.dbpth, { encoding: 'utf-8' });
        const data = JSON.parse(info)
            // console.log(data.historial)
        this.historial = data.historial
            // cargar la info readfilesyncc

    }

}
module.exports = Busqueda