const Ticket = require("../models/ticket");
const formatDateMiddleware = require("../middlewares/formatDate");
const { info } = require("autoprefixer");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { v4: uuidv4 } = require('uuid');
const Iyzipay = require('iyzipay');

exports.index_get = async (req, res, next) => {
    const tickets = await Ticket.find();
    res.render("homepage",{
        title: "Home Page",
        tickets
    });
}

exports.index_post = async (req, res, next) => {
    const {departure , destination , date} = req.body

    try{

        if( !departure || !destination || !date || departure == destination){
            const tickets = await Ticket.find();
            return res.render("homepage",{
                title: "Home Page",
                error: "Please fill all the fields",
                tickets
            })
        }

        const formatDate = (dateString) => {
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            };
            return new Date(dateString).toLocaleDateString('en-US', options);
        };

        const formattedDate = formatDate(date);

        res.redirect(`/tickets?departure=${departure}&destination=${destination}&date=${formattedDate}`)

    }catch(err){
        console.log(err);
    }
}

exports.tickets_get = async (req, res, next) => {

    const { departure, destination, date } = req.query;

    try{

        const tickets = await Ticket.find({
            departure: departure,
            destination: destination,
        });

        if(tickets.length == 0 || !tickets){
            return res.render("homepage",{
                title: "Home Page",
                error: "No tickets found"
            })
        }

        const formattedTicketsDates = tickets.map(ticket => {
            const dateObject = new Date(ticket.date);
            return `${dateObject.getMonth() + 1}/${dateObject.getDate()}/${dateObject.getFullYear()}`;
        });

        if( formattedTicketsDates.includes(date)){
            return res.render("tickets",{
                title: departure + " - " + destination,
                tickets : tickets.filter(ticket => {
                    const dateObject = new Date(ticket.date);
                    return `${dateObject.getMonth() + 1}/${dateObject.getDate()}/${dateObject.getFullYear()}` === date;
                })
            });
        }

        res.render("homepage",{
            title: "Home Page",
            error: "No tickets found"
        })
        
    }catch(err){
        console.log(err);
    }
}

exports.tickets_post = async (req, res, next) => {
    try{
        const { ticketId } = req.body;

        res.redirect("/ticket-buy?id=" + ticketId);
    }catch(err){
        console.log(err);
    }
}

exports.ticket_buy_get = async (req, res, next) => {

    const ticketId = req.query.id;

    try{

        const ticket = await Ticket.findById(ticketId);

        if(!ticket){
            return res.render("error",{
                title: "Error Page",
            })
        }

        res.render("ticket-buy",{
            title: "Ticket Buy",
            ticket,
            error: null
        });

    }catch(err){
        console.log(err);
    }
}

exports.ticket_buy_post = async (req, res, next) => {

    const ticketid = req.query.id;
    const ticket = await Ticket.findById(ticketid);

    const { name, email, phone, tc , quantity , ticketId } = req.body;

    try{
          
            if( !name || !email || !phone || !tc || !quantity || !ticketId){
                return res.render("ticket-buy",{
                    title: "Ticket Buy",
                    error: "Please fill all the fields",
                    ticket
                })
            }

            if( tc.length != 11){
                return res.render("ticket-buy",{
                    title: "Ticket Buy",
                    error: "Please enter a valid TC",
                    ticket
                })
            }

            console.log("teoken: ",process.env.JWT_SECRET_KEY)

            const token = jwt.sign({ name, email, phone, tc, quantity, ticketId }, process.env.JWT_SECRET_KEY);

            res.redirect(`/payment?token=${token}`)


    }catch(err){
        console.log(err);
    }
}

exports.payment_get = async (req, res, next) => {

    const token = req.query.token;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    try{

        if(!decodedToken){
            return res.render("error",{
                title: "Error Page",
            })
        }

        const ticket = await Ticket.findById(decodedToken.ticketId);

        const { name, email, phone, tc, quantity } = decodedToken;

        res.render("payment",{
            title: "Payment",
            ticket,
            name,
            email,
            phone,
            tc,
            quantity,
        });

    }catch(err){
        console.log(err);
    }
}

exports.payment_post = async (req, res, next) => {

    const { cardName, cardNumber, expirationDate, cvv, ticketId, username, phone, email, tc, quantity } = req.body;

    const uniqueId = uuidv4();

    try {

        const iyzipay = new Iyzipay({
            apiKey: process.env.PAYMENT_API_KEY,
            secretKey: process.env.PAYMENT_SECRET_KEY,
            uri: 'https://sandbox-api.iyzipay.com'
        });

        const ticket = await Ticket.findById(ticketId);

        console.log("ticket price : ", ticket.price);
        console.log("quantity : ", quantity);

        const data = {
            locale: "tr",
            conversationId: uniqueId,
            price: ((ticket.price * 100).toFixed(2)).toString(),
            currency: "TRY",
            installment: "1",
            paymentChannel: "WEB",
            paymentGroup: "PRODUCT",
            paymentCard: {
                cardHolderName: cardName,
                cardNumber: cardNumber,
                expireMonth: expirationDate.split("/")[0],
                expireYear: "20" + expirationDate.split("/")[1],
                cvcNumber: cvv,
                registerCard: "0"
            },
            buyer: {
                id: "BY789",
                name: "John",
                surname: "Doe",
                gsmNumber: "+905350000000",
                email: "email@email.com",
                identityNumber: "74300864791",
                lastLoginDate: "2015-10-05 12:43:35",
                registrationDate: "2013-04-21 15:12:09",
                registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
                ip: "85.34.78.112",
                city: "Istanbul",
                country: "Turkey",
                zipCode: "34732"
            },
            shippingAddress: {
                contactName: "Jane Doe",
                city: "Istanbul",
                country: "Turkey",
                address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
                zipCode: "34742"
            },
            billingAddress: {
                contactName: "Jane Doe",
                city: "Istanbul",
                country: "Turkey",
                address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
                zipCode: "34742"
            },
            basketItems: [
                {
                    id: ticket._id.toString(),
                    name: ticket.departure + " - " + ticket.destination + " - " + ticket.companyName,
                    category1: "Travel",
                    category2: "Bus Tickets",
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: ((ticket.price * quantity * 100).toFixed(2)).toString()
                },
            ]
        }

        console.log("data :", data);

        const result = await new Promise((resolve, reject) => {
            iyzipay.payment.create(data, function (err, result) {
                if (err) {
                    console.log("eror: ", err);
                    reject(err);
                }
                console.log("result :",result);
                resolve(result);
            });
        });

        // onur was here

        res.status(200).json({ success: true, message: "Payment successful." });

    } catch (err) {
        console.error("Payment error:", err);
        res.status(500).json({ success: false, message: "Payment error." });
    }
}

exports.contact_get = async (req, res, next) => {
    res.render("contact",{
        title: "Contact Page"
    });
}

exports.error_get = async (req, res, next) => {
    res.render("error",{
        title: "Error Page"
    });
}