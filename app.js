//Dependencies
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');

//Importing classes
const Engineer = require('./lib/engineer');
const Intern = require('./lib/intern');
const Manager = require('./lib/manager');

const writeFileAsync = util.promisify(fs.writeFile);
const appendFileAsync = util.promisify(fs.appendFile);
const readFileAsync = util.promisify(fs.readFile);

const employeeArray = [];

//Prompts the user for information for first input, which is required to be a manager
function managerInfo() {
    return inquirer.prompt([
        {
            type: "list",
            name: "role",
            message: "Choose role (first entry must be a manager): ",
            choices: ["Manager"]
        },
        {
            type: "input",
            name: "name",
            message: "Enter employee's name: "
        },
        {
            type: "input",
            name: "id",
            message: "Enter employee's ID: "
        },
        {
            type: "input",
            name: "email",
            message: "Enter employee's email: "
        },
        {
            type: "input",
            name: "officeNumber",
            message: "Enter manager's office number: "
        }
    ]);
}

//Prompts the user to choose which role to add
function whichRole() {
    return inquirer.prompt([
        {
            type: "list",
            name: "role",
            message: "Choose role (choose 'Exit' to stop adding employees): ",
            choices: ["Intern", "Engineer", "Exit"]
        }
    ]);
}

//Prompts the user for information about the intern
function getInternInfo() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter employee's name: "
        },
        {
            type: "input",
            name: "id",
            message: "Enter employee's ID: "
        },
        {
            type: "input",
            name: "email",
            message: "Enter employee's email: "
        },
        {
            type: "input",
            name: "school",
            message: "Enter intern's current school: "
        }
    ]);
}

//Prompts the user for informarion about the engineer
function getEngineerInfo() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter employee's name: "
        },
        {
            type: "input",
            name: "id",
            message: "Enter employee's ID: "
        },
        {
            type: "input",
            name: "email",
            message: "Enter employee's email: "
        },
        {
            type: "input",
            name: "github",
            message: "Enter engineer's Github username: "
        }
    ]);
}

//Returns an HTML header based on the employees role to append to the output file
async function appendHTMLTemplate(employee) {
    if (employee.getRole() === "Manager") {
        var managerTemplate = await readFileAsync("./templates/manager.html", "utf8");

        var mapObj = {
            NAME: employee.getName(),
            ID: employee.getId(),
            EMAIL: employee.getEmail(),
            ROLESPECIFIC: employee.getOfficeNumber()
        };

        managerTemplate = managerTemplate.replace(/NAME|ID|EMAIL|ROLESPECIFIC/g, function (matched) {
            return mapObj[matched];
        });

        await appendFileAsync("./output/my-team.html", managerTemplate);
    }
    else if (employee.getRole() === "Intern") {
        var internTemplate = await readFileAsync("./templates/intern.html", "utf8");

        var mapObj = {
            NAME: employee.getName(),
            ID: employee.getId(),
            EMAIL: employee.getEmail(),
            ROLESPECIFIC: employee.getSchool()
        };

        internTemplate = internTemplate.replace(/NAME|ID|EMAIL|ROLESPECIFIC/g, function (matched) {
            return mapObj[matched];
        });

        await appendFileAsync("./output/my-team.html", internTemplate);
    }
    else {
        var engineerTemplate = await readFileAsync("./templates/engineer.html", "utf8");

        var mapObj = {
            NAME: employee.getName(),
            ID: employee.getId(),
            EMAIL: employee.getEmail(),
            ROLESPECIFIC: employee.getGithub()
        };

        engineerTemplate = engineerTemplate.replace(/NAME|ID|EMAIL|ROLESPECIFIC/g, function (matched) {
            return mapObj[matched];
        });

        await appendFileAsync("./output/my-team.html", engineerTemplate);
    }
}


//Populates the employee array with team members after the manager data has been pushed
async function createTeam() {
    var continueInLoop = true;
    while (continueInLoop) {
        var newEmp;
        var empData;
        var empType = await whichRole();
        if (empType.role === "Exit") {
            continueInLoop = false;
        }
        else if (empType.role === "Intern") {
            empData = await getInternInfo();
            newEmp = new Intern(empData.name, empData.id, empData.email, empData.school);
            employeeArray.push(newEmp);
        }
        else {
            empData = await getEngineerInfo();
            newEmp = new Engineer(empData.name, empData.id, empData.email, empData.github);
            employeeArray.push(newEmp);
        }
    }
}

//Main application code
async function init() {
    var managerData = await managerInfo();
    var newManager = new Manager(managerData.name, managerData.id, managerData.email, managerData.officeNumber);

    employeeArray.push(newManager);

    await createTeam();

    console.log(employeeArray)

    var htmlHeader = await readFileAsync("./templates/main.html", "utf8")
    await writeFileAsync("./output/my-team.html", htmlHeader);

    employeeArray.forEach(employee => {
        appendHTMLTemplate(employee);
    });
}

init();

