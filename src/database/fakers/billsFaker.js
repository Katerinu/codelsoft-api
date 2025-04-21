import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { PrismaClient } from "../../../prisma-auth-database/auth-client/index.js";

const prisma = new PrismaClient();

const generateFakeBill = async () => {
    const billStatus = faker.helpers.arrayElement(
        ["Pending", "Paid", "Overdue"],
        faker.number.int({ min: 1, max: 3 }));
    

    // Generate random amount between 10 and 1000
    const amount = faker.number.int({ min: 10, max: 1000 });
    
    // Generate issue date within the last 30 days
    const issuedAt = faker.date.recent({ days: 30 })
    
    // If status is Paid, generate a paid date after the issue date
    let paidAt = null;
    if (billStatus === "Paid") {
        const issueDate = new Date(issuedAt);
        paidAt = faker.date.between({
            from: issueDate,
            to: new Date()
        })
    }
    
    const users = await prisma.user.findMany({
        where: {
            status: "Active",
        },
    });

    if (users.length === 0) {
        console.log("No se encontraron usuarios activos en la base de datos.");
        return null;
    }

    const randomUser = faker.helpers.arrayElement(users);
    const userUuid = randomUser.uuid;


    const bill = {
        billStatus: billStatus,
        userUuid: userUuid,
        amount: amount,
        issuedAt: issuedAt,
        paidAt: paidAt,
        deleted: false
    };
    
    return bill;
};

const generateFakeBills = (numberOfBills) => {
    const bills = [];
    for (let i = 0; i < numberOfBills; i++) {
        bills.push(generateFakeBill());
    }
    return bills;
};

export { generateFakeBill, generateFakeBills };