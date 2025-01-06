const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();


async function main() {
    try {
        await database.category.createMany({
            data: [
                {name: "Computer Science"},
                {name: "Mucis"},
                {name: "Art"},
                {name: "Mathematics"},
                {name: "Science"},
                {name: "History"},
                {name: 'Engineering'},
                {name: 'Business'},
            ]
        })
    console.log("Seeded the database with categories");
    } catch (error) {
        console.log("Error seeding the database categoriers ", error);
    } finally {
        await database.$disconnect();
    }
}

main();