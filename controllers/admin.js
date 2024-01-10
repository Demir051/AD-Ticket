const Ticket = require('../models/ticket');
const Admin = require('../models/admin');

const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

exports.admin_get = async (req, res) => {
    res.render('admin/index' , {
        title: 'Admin Panel'
    });
};

exports.add_ticket_get = async (req, res) => {
    res.render('admin/add-ticket' , {
        title: 'Add Ticket'
    });
};

exports.add_ticket_post = async (req, res) => {

    const {
        departure,
        destination,
        date,
        passengerCount,
        price,
        companyName
    } = req.body

    try{

        const ticket = await Ticket.create({
            departure,
            destination,
            date,
            passengerCount,
            price,
            companyName
        });

        res.redirect('/adminpanel')

    }catch(err){
        console.log(err);
    }
}

exports.tickets_get = async (req, res) => {
    
        try{
    
            const tickets = await Ticket.find();
    
            res.render('admin/tickets' , {
                title: 'Tickets',
                tickets
            });
    
        }catch(err){
            console.log(err);
        }
}

exports.delete_ticket_get = async (req, res) => {
    const {id} = req.params;
    try{

    const ticket = await Ticket.findById(id)

    await ticket.deleteOne();

    res.redirect('/adminpanel/tickets?message=Ticket Deleted Successfully')

    }catch(err){
        console.log(err);
    }
}

exports.edit_ticket_get = async (req, res) => {
    const {id} = req.params;
    try{

    const ticket = await Ticket.findById(id)

    res.render('admin/edit-ticket' , {
        title: 'Edit Ticket',
        ticket
    })

    }catch(err){
        console.log(err);
    }
}

exports.edit_ticket_post = async (req, res) => {

    const {id} = req.params;

    const {departure,destination,date,passengerCount,price,companyName} = req.body

    console.log("date" , date)

    try{

        if(!date || date == null || date == undefined || date == ''){
            await Ticket.updateOne({ _id: id }, { 
                departure,
                destination,
                passengerCount,
                price,
                companyName
            });

            return res.redirect('/adminpanel/tickets?message=Ticket Updated Successfully')
        }

        await Ticket.updateOne({ _id: id }, { 
            departure,
            destination,
            date,
            passengerCount,
            price,
            companyName
        });

        res.redirect('/adminpanel/tickets?message=Ticket Updated Successfully')

    }catch(err){
        console.log(err);
    }
}

exports.add_admin_get = async (req, res) => {
    res.render('admin/add-admin' , {
        title: 'Add Admin'
    });
}

exports.add_admin_post = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if(userName.length < 5 || password.length < 6){
            return res.redirect('/adminpanel/add-admin-account?message=Username or Password is too short');
        }

        const existingAdmin = await Admin.findOne({ userName: userName });
        if (existingAdmin) {
            return res.redirect('/adminpanel/add-admin-account?message=Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            userName,
            password: hashedPassword
        });

        if (!newAdmin) {
            return res.status(500).json({ error: "Failed to add admin" });
        }

        res.redirect('/adminpanel/admin-accounts?message=Admin Added Successfully');

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.admin_accounts_get = async (req, res) => {

    try {

        const admins = await Admin.find();

        return res.render('admin/admin-accounts' , {
            title: 'Admin Accounts',
            admins,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.delete_admin_get = async (req, res) => {

    const {id} = req.params;

    try{

    const admin = await Admin.findById(id)

    await admin.deleteOne();

    res.redirect('/adminpanel/admin-accounts?message=Admin Deleted Successfully')

    }catch(err){
        console.log(err);
    }
}

exports.admin_login_get = async (req, res) => {
    res.render('admin/login' , {
        title: 'Admin Login'
    });
}

exports.admin_login_post = async (req, res) => {

    const {username , password} = req.body;

    try{

        if(password.length < 6){
            return res.redirect('/adminpanel/login?message=Password is too short');
        }

        const admin = await Admin.findOne({userName: username});

        if(admin){

            const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET_KEY);

            res.cookie('authToken', token);

            return res.redirect("/adminpanel");
        }

        res.redirect('/adminpanel/login?message=Username or Password is wrong');

    }catch(err){
        console.log(err);
    }
}

exports.admin_logout_get = async (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/');
}