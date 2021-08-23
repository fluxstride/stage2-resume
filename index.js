const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const mailer = require("nodemailer");
const router = require("express").Router();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const responseModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

const Response = mongoose.model("response", responseModel);

const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded());
router.get("/", (req, res) => {
    res.render("index");
});

router.post("/submit", (req, res) => {
    const response = req.body;
    const userResponse = new Response({...response });

    var transporter = mailer.createTransport({
        service: "gmail",
        auth: {
            user: "adexmailer@gmail.com",
            pass: "Password@00000",
        },
    });

    var mailOptions = {
        from: "Samuel Adekoya <adexmailer@gmail.com>",
        to: "samueladexx@gmail.com",
        subject: "Contact Response",
        html: `<p style=" font-size: 1.2rem;font-family: Poppins; line-height: 2">Thank you ${response.name} for reaching out to me. I will get back to you as soon as possible 
        <p>Name = ${response.name} </p>
        <p>email = ${response.email}</p>
        <p>message = ${response.message}</p>
        </p>`,
    };

    var recieverMailOptions = {
        from: "Samuel Adekoya <adexmailer@gmail.com>",
        to: "samueladexx@gmail.com",
        subject: "Contact Response",
        html: `<p style=" font-size: 1.2rem;font-family: Poppins; line-height: 2">You just recieved a response from ${response.name}</p>
        <p>Name = ${response.name} </p>
        <p>email = ${response.email}</p>
        <p>message = ${response.message}</p>
    `,
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });

    transporter.sendMail(recieverMailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
    // userResponse.save(() => { console.log("response saved") })
    res.render("submit", { name: response.name });
});
router.post("/", (req, res) => {});

app.use(router);
app.listen(port, console.log(`server running on port ${port}`));