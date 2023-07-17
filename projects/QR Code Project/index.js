/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import inquirer from 'inquirer';
import qr from "qr-image";
import fs from "fs";

inquirer
    .prompt([
        {"message": "Enter URL of QR Code: ",
        name: "URL",
        },
    ])
    .then((ans) => {
        const qr_png = qr.image(ans.URL);
        qr_png.pipe(fs.createWriteStream('qr_img.png'));

        fs.writeFile("URL.txt", ans.URL, (err) => {
            if (err) throw err;
            console.log("The file has been saved!");
        })
    })
    .catch((error) => {
        throw error;
    });
