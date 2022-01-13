require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busqueda = require('./models/busquedas');

// console.log(process.env.MAPBOX_KEY)

const main = async() => {

    const busquedas = new Busqueda();
    let opt = null;

    do {

        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // mostrar mensaje- 
                const termino = await leerInput('ciudad: ')
                    // buscar lugar -
                const lugares = await busquedas.ciudad(termino);
                // seleccionar el lugar
                const idSelec = await listarLugares(lugares);
                if (idSelec === "0") continue;

                lugarSele = lugares.find(l => l.id === idSelec)

                // guardar en db

                busquedas.agregarHistorial(lugarSele.nombre)
                    // busquedas.leerDB()

                // await pausa()



                const clima = await busquedas.climalugar(lugarSele.lat, lugarSele.lng)
                console.clear()
                console.log('\n Informacion de la ciudad\n'.green)
                console.log('Ciudad: ', lugarSele.nombre.green)
                console.log("lat: ", lugarSele.lat)
                console.log("lng: ", lugarSele.lng)
                console.log("Temperatura: ", clima.temp)
                console.log("minima: ", clima.max)
                console.log("maxima: ", clima.min)
                console.log("como esta el clima: ", clima.des.green)

                break;
            case 2:

                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const id = `${i +1}.`.green
                    console.log(`${id} ${lugar}`)

                });
                break;

        }



        if (opt !== 0) await pausa()


    }
    while (opt !== 0);



}

main()