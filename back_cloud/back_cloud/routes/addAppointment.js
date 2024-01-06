const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();

var express = require('express');
var router = express.Router();

router.post('/', async function(req, res, next) {
    console.log("Enter addApointmnet");
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{
        const [insert_app] = await conn.execute('INSERT INTO `appoointment`(`id`,`firstName`,`lastName`,`cnp`,`phoneNumber`,`appointmentDate`,`appointmentTime`,`standardPackage`,`bloodType`) VALUES(?,?,?,?,?,?,?,?,?)',[
            req.body.id,
            req.body.firstName,
            req.body.lastName,
            req.body.cnp,
            req.body.phoneNumber,
            req.body.appointmentDate,
            req.body.appointmentTime,
            req.body.standardPackage,
            req.body.bloodType
        ]);
        
        if (insert_app.affectedRows != 1) {
            return res.status(422).json({
                message: "The appoointment hasn't been inserted successfully.",
            });
        }     
    
        return res.status(201).json({
            message: "The appointment was successfully inserted !",
        });        
                        
    } catch(err){
        next(err);
    }
});

module.exports = router;

exports.registerLocation = async(req,res,next) => {
    
}