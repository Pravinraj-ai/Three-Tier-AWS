import SENDMAIL from "../mail/sendMail.js";

const LoginController = (app, client, jwt) => {

    var roles = {
        "user" : "User",
        "trainer" : "Trainer",
        "admin" : "Admin",
        "doctor" : "Doctor",
    };

    app.get('/verifyAuth', (req, res) => {
        const token = req.session.user;
        if (!token) {
            return res.json({success: false})
        } else {
            return res.json({success: true})
        }    
    });

    app.post("/login", (req, res)=> {
        const mailID = req.body.email;
        const password = req.body.password;
        const userType = req.body.userType;
        
        client.db("Health_and_Fitness_Tracker").collection(roles[userType]).findOne({
            emailID: mailID,
            password: password,
        }).then((result) => {
            if (result != null) {
                
                if (result.approved == false) {
                    return res.json({success: false, message:"Your account isn't approved yet."})
                }
                if (result.active == false) {
                    return res.json({success: false, message:"Your account is deactivated."})
                }
                const token = jwt.sign(
                    {mailID},
                    "secret-key",
                    {expiresIn: "1d"}
                );

                res.cookie('loginToken', token);
                req.session.user = mailID;
                req.session.userName = result.userName;
                req.session.userType = userType;
                return res.json({success: true, token: token, userName: result.userName, email: result.emailID, type: userType})
            } else {
                return res.json({success: false, message:"Invalid Email ID or Password"})
            }
        })
    })

    app.get("/logout", (req, res) => {
        res.clearCookie("loginToken");
        res.clearCookie("connect.sid");
        req.session.user = '';
        req.session.destroy();
      
        return res.json({success: true})
    })

    app.post("/forgotpassword", (req, res) => {
        const mailID = req.body.email;
        const userType = req.body.userType;
    
        client.db("Health_and_Fitness_Tracker").collection(roles[userType]).findOne({emailID: mailID}).then((result) => {
            if (result != null) {
                SENDMAIL("forget-password", mailID, "Forget Password", "The password for your account.", {
                    userName: result.userName,
                    password: result.password,
                }, (info) => {
                });
                return res.json({success: true})
            } else {
                return res.json({success: false})
            }
        }); 
    })

    app.post("/checkMailAvailability", (req, res) => {
        const emailID = req.body.emailCheck;
        client.db("Health_and_Fitness_Tracker").collection("User").findOne({emailID: emailID}).then((result) => {
            if(result == null){
                return res.json({success: true})
            }else{
                return res.json({success: false})
            }
        })
    });

    app.post("/signup", (req, res) => {
        const userName = req.body.userName;
        const emailID = req.body.email;
        const password = req.body.password;
        const contactNumber = req.body.contactNumber;
        const address = req.body.address;
        const age = req.body.age;
        const gender = req.body.gender;
        const fitnessGoals = req.body.fitnessGoals;
        const healthData = req.body.healthData;
        const DOB = req.body.DOB;

        let date_time = new Date();
        let date = ("0" + date_time.getDate()).slice(-2);
        let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
        let year = date_time.getFullYear();
        let hours = date_time.getHours();
        let minutes = date_time.getMinutes();
        let seconds = date_time.getSeconds();

        const createdAt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        const userID = emailID + "_" + year + "-" + month + "-" + date + "_" + hours + "_" + minutes + "_" + seconds;

        try {
            client.db("Health_and_Fitness_Tracker").collection("User").insertOne({
                userID : userID,
                userName: userName,
                emailID: emailID,
                password: password,
                contactNumber: contactNumber,
                dateOfBirth: DOB,
                age: age,
                address: address,
                gender: gender,
                fitnessGoals: fitnessGoals,
                healthData: healthData,
                createdAt: createdAt,
                active : false,
                approved : false,
            }).then((result) => {console.log(result) });

            return res.json({success: true});
        }   
        catch(err) {
            console.log(err);
            return res.json({success: false});
        }
    });

    app.post('/changePassword', async (req, res) => {
        const userType = req.body.userType;
        const mailID = req.body.mailID;
        const newPassword = req.body.newPassword;
        const userName = req.body.userName;

        const verifyOldPassword = await client.db("Health_and_Fitness_Tracker").collection(roles[userType]).findOne({emailID: mailID, password: req.body.currentPassword});
       
        if (verifyOldPassword == null){
            return res.json({success: false, message: "Incorrect Password"})
        }

        await client.db("Health_and_Fitness_Tracker").collection(roles[userType]).updateOne({emailID: mailID}, {$set: {password: newPassword}}).then((result) => {
            if (result.modifiedCount == 1) {
                SENDMAIL("password-change", mailID, "Password Change", "Password has been changed for your account.", {
                    userName: userName,
                }, (info) => {
                });
                return res.json({success: true})
            } else {
                return res.json({success: false})
            }
        });
    });

}



export default LoginController;