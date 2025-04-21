import { seedUsers } from "../seeders/usersSeeder.js";
import { seedBills } from "../seeders/billsSeeder.js";
const mainSeedingFunction = async () => {

    const usersToAdd = 200;
    const billsToAdd = 300;

    let userslength = 0;

    if(!usersToAdd>200) {
        console.log("El número de usuarios a agregar no puede ser mayor a 200");
        return false;
    }

    if(!billsToAdd>200) {
        console.log("El número de facturas a agregar no puede ser mayor a 200");
        return false;
    }


    //Seeding de usuarios
    try {
        
        const users = await seedUsers(usersToAdd);
        if (!users) {
            console.log("Error al crear los usuarios en la base de datos local");
            return false;
        }
        userslength = users.length;
        console.log("Usuarios creados correctamente:", users.length, " usuarios creados.");
    } catch (error) {
        console.error("Error en la función principal de seeding:", error);
    }

    try{
        //Seeding de facturas
        if(userslength === 0) {
            console.log("No se han creado usuarios, no se pueden crear facturas.");
            return false;
        }

        console.log("Intentando crear", billsToAdd, "facturas...");
        const bills = await seedBills(billsToAdd);
        if (!bills) {
            console.log("Error al crear las facturas en la base de datos local");
            return false;
        }
        console.log("Facturas creadas correctamente:", bills.length, " facturas creadas.");
    }
    catch (error) {
        console.error("Error detallado en la creación de facturas:", error);
        return false;
    }

};

mainSeedingFunction()
    .then(() => {
        console.log("Proceso de seeding completado.");
        process.exit(0); // Finaliza el proceso
    })
    .catch((error) => {
        console.error("Error en el proceso de seeding:", error);
        process.exit(1); // Finaliza el proceso con error
    });