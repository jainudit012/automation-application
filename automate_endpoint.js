const puppeteer = require("puppeteer");
const Joi = require('joi');
const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

// const config = fs.readFileSync('./tweet.yaml', 'utf8');
// const data = yaml.safeLoad(config);

// const users = [
//     {
//         id: 1,
//         username: "qwerty",
//         email: "qwerty@qwe.com",
//         password: "qwerty"
//     }
// ];

// app.post('/login', function(req,res){ 

//     const user = {
//         id: users.length + 1,
//         username: req.body.username,
//         email: req.body.email,
//         password: req.body.password
//     };
//     users.push(user);
//     res.send(user);

//     // console.log(users);

// });


app.get('/login', async function(req, res) {

    // const user = users.filter(u => u.id === parseInt(req.query.id))[0];
    const user = req.query;

    console.log(user.username);
    
    browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 });

try {
    await page.goto('https://twitter.com/login/', { waitUntil : 'networkidle0' });
    

    const userid = await page.$x('//*[@id="react-root"]/div/div/div[2]/main/div/div/form/div/div[1]/label/div/div[2]/div/input');
    await userid[0].type(user.username);
    const pwd = await page.$x('//*[@id="react-root"]/div/div/div[2]/main/div/div/form/div/div[2]/label/div/div[2]/div/input');
    await pwd[0].type(user.password);

    await page.keyboard.press('Enter');

} 

catch (err) {

    console.log(err);
    return err;

}

try {

    await page.waitForSelector('.DraftEditor-editorContainer');
    await page.click('.DraftEditor-editorContainer');

    await page.keyboard.type('Headless Browser, puppeteer');
    
    const filePath = path.relative(process.cwd(), '/home/pranav/Desktop/Opscale/automate/post.jpeg');
    const input = await page.$('.r-8akbif.r-orgf3d.r-1udh08x.r-u8s1d.r-xjis5s.r-1wyyakw');
    await input.uploadFile(filePath);

    await page.waitFor(3000);

    const tweetBtn = await page.$x('//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[2]/div/div[2]/div[1]/div/div/div/div[2]/div[2]/div/div/div[2]/div/div/span');
    await tweetBtn[0].click();

    await page.waitFor(8000);
    console.log("Tweet has been posted successfully.");

    browser.close();

} catch (err) {
    console.log(err);
}

});

const port = process.env.PORT || 5000
app.listen(port, function() {
    console.log(`Running on port ${port}...`);
});