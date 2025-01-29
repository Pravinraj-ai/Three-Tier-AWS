import SENDMAIL from "../mail/sendMail.js";
import generator from "generate-password";

const AdminController = (app, client, jwt) => {

    app.get('/getClients', async (req, res) => {
        try {
            await client.db("Health_and_Fitness_Tracker").collection("User").find({approved:true}).toArray().then((result) => {
                return res.json(result);
            })        
        }
        catch (err) {
            console.log(err);
        }
    });

    app.get('/getNewUsers', async (req, res) => {
        try {
            await client.db("Health_and_Fitness_Tracker").collection("User").find({approved:false}).toArray().then((result) => {
                return res.json(result);
            })
        }
        catch (err) {
            console.log(err);
        }
    });   
    
    app.post('/addDoctor', async (req, res) => {
        try {
            const tempPassword = generator.generate({
                length: 10,
                numbers: true
            });

            let date_time = new Date();
            let date = ("0" + date_time.getDate()).slice(-2);
            let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
            let year = date_time.getFullYear();
            let hours = date_time.getHours();
            let minutes = date_time.getMinutes();
            let seconds = date_time.getSeconds();
    
            const createdAt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            const doctorID = req.body.emailID + "_" + year + "-" + month + "-" + date + "_" + hours + "_" + minutes + "_" + seconds;

            try{
                await client.db("Health_and_Fitness_Tracker").collection("Doctor").insertOne({
                    doctorID: doctorID,
                    userName: req.body.userName,
                    emailID: req.body.emailID,
                    password: tempPassword,
                    contactNumber: req.body.contactNumber,
                    qualification: req.body.qualification,
                    address: req.body.address,
                    dateOfBirth: req.body.dateOfBirth,
                    age: req.body.age,
                    specialization: req.body.specialization,
                    active: true,
                    createdAt: createdAt,            
                })
                
                SENDMAIL("doctor-created", req.body.emailID, "Account Created", "Your account has been created.", {
                    userName: req.body.userName,
                    emailID : req.body.emailID,
                    password: tempPassword,
                }, (info) => {
                });

                return res.json({
                        success: true,
                        doctorData: await client.db("Health_and_Fitness_Tracker").collection("Doctor").find({}).toArray(),
                    });
            }
            catch(err){
                return res.json({success: false});
            }
        }
        catch (err) {
            console.log(err);
            return res.json({success: false});
        }
    });

    app.get('/getDoctors', async (req, res) => {
        try {
            const docData = await client.db("Health_and_Fitness_Tracker").collection("Doctor").find({}).toArray();
            for (let i = 0; i < docData.length; i++) {
                const count = await client.db("Health_and_Fitness_Tracker").collection("handleRecord").find({doctorID: docData[i].doctorID}).count();
                docData[i].count = count;
            }
            
            return res.json(docData);
            // await client.db("Health_and_Fitness_Tracker").collection("Doctor").find({}).toArray().then((result) => {
            //     return res.json(result);
            // })
        }
        catch (err) {
            console.log(err);
        }
    });

    app.post('/updateNewUser', async (req, res) => {
        const doctorDocID = req.body.doctorID;
        const trainerDocID = req.body.trainerID;
        const clientDocID = req.body.clientID;
        const adminEmailID = req.body.adminID;
        const action = req.body.action;

        const userData = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({userID: clientDocID});
        
        if(action){

            let date_time = new Date();
            let date = ("0" + date_time.getDate()).slice(-2);
            let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
            let year = date_time.getFullYear();
            let hours = date_time.getHours();
            let minutes = date_time.getMinutes();
            let seconds = date_time.getSeconds();
            
            const adminMailID = await client.db("Health_and_Fitness_Tracker").collection("Doctor").findOne({doctorID: doctorDocID});

            const createdAt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            const recordID = adminMailID.emailID + "_" + year + "-" + month + "-" + date + "_" + hours + "_" + minutes + "_" + seconds;

            try {
                await client.db("Health_and_Fitness_Tracker").collection("User").updateOne(
                    {userID: clientDocID},
                    {$set: {approved: true, active:true}});

                const doctorData = await client.db("Health_and_Fitness_Tracker").collection("Doctor").findOne({doctorID: doctorDocID});
                const trainerData = await client.db("Health_and_Fitness_Tracker").collection("Trainer").findOne({trainerID: trainerDocID});
                const adminData = await client.db("Health_and_Fitness_Tracker").collection("Admin").findOne({emailID: adminEmailID});
                
                await client.db("Health_and_Fitness_Tracker").collection("handleRecord").insertOne({
                    recordID: recordID,
                    doctorID: doctorData.doctorID,
                    userID: userData.userID,
                    trainerID: trainerData.trainerID,
                    adminID: adminData.adminID,
                    createdAt: createdAt,
                    active: true,
                });

                SENDMAIL("client-approved", userData.emailID, "Account Approved", "Your account has been approved.", {
                    userName: userData.userName,
                    doctorName: doctorData.userName,
                    trainerName: trainerData.userName,
                }, (info) => {
                });

                return res.json({
                    success: true,
                    presentData: await client.db("Health_and_Fitness_Tracker").collection("User").find({approved:true}).toArray(),
                    newData: await client.db("Health_and_Fitness_Tracker").collection("User").find({approved:false}).toArray()
                });
            } catch (err) {
                console.log(err);
                return res.json({success: false});
            }
        }
        else {
            try{
                const tempMailID = userData.emailID;
                const tempUserName = userData.userName;
                await client.db("Health_and_Fitness_Tracker").collection("User").deleteOne({userID: clientDocID});

                SENDMAIL("client-rejected", tempMailID, "Account Rejected", "Your account has been rejected.", {
                    userName: tempUserName,
                }, (info) => {
                });

                return res.json({
                    success: true,
                    presentData: await client.db("Health_and_Fitness_Tracker").collection("User").find({approved:true}).toArray(),
                    newData: await client.db("Health_and_Fitness_Tracker").collection("User").find({approved:false}).toArray()
                });

            } catch (err) {
                console.log(err);
                return res.json({success: false});
            }
            
        }
    });

    app.post('/addTrainer', async (req, res) => {
        try {
            const tempPassword = generator.generate({
                length: 10,
                numbers: true
            });

            let date_time = new Date();
            let date = ("0" + date_time.getDate()).slice(-2);
            let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
            let year = date_time.getFullYear();
            let hours = date_time.getHours();
            let minutes = date_time.getMinutes();
            let seconds = date_time.getSeconds();
    
            const createdAt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            const trainerID = req.body.emailID + "_" + year + "-" + month + "-" + date + "_" + hours + "_" + minutes + "_" + seconds;

            try{
                await client.db("Health_and_Fitness_Tracker").collection("Trainer").insertOne({
                    trainerID: trainerID,
                    userName: req.body.userName,
                    emailID: req.body.emailID,
                    password: tempPassword,
                    contactNumber: req.body.contactNumber,
                    qualification: req.body.qualification,
                    address: req.body.address,
                    age: req.body.age,
                    dateOfBirth: req.body.dateOfBirth,
                    specialization: req.body.specialization,
                    active: true,
                    createdAt: createdAt,            
                })
                
                SENDMAIL("trainer-created", req.body.emailID, "Account Created", "Your account has been created.", {
                    userName: req.body.userName,
                    emailID : req.body.emailID,
                    password: tempPassword,
                }, (info) => {
                });

                return res.json({
                        success: true,
                        trainerData: await client.db("Health_and_Fitness_Tracker").collection("Trainer").find({}).toArray(),
                    });
            }
            catch(err){
                return res.json({success: false});
            }
        }
        catch (err) {
            console.log(err);
            return res.json({success: false});
        }
    });

    app.get('/getTrainers', async (req, res) => {
        try {
            const trainerData = await client.db("Health_and_Fitness_Tracker").collection("Trainer").find({}).toArray();
            for (let i = 0; i < trainerData.length; i++) {
                const count = await client.db("Health_and_Fitness_Tracker").collection("handleRecord").find({trainerID: trainerData[i].trainerID}).count();
                trainerData[i].count = count;
                return res.json(trainerData);
            }
        }
        catch (err) {
            console.log(err);
        }
    });   


    const getRecordsData = async () => {
        const recordData = await client.db("Health_and_Fitness_Tracker").collection("handleRecord").find({}).toArray();
            for (let i = 0; i < recordData.length; i++) {
                const userData = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({userID: recordData[i].userID});
                const doctorData = await client.db("Health_and_Fitness_Tracker").collection("Doctor").findOne({doctorID: recordData[i].doctorID});
                const trainerData = await client.db("Health_and_Fitness_Tracker").collection("Trainer").findOne({trainerID: recordData[i].trainerID});
                const adminData = await client.db("Health_and_Fitness_Tracker").collection("Admin").findOne({adminID: recordData[i].adminID});

                recordData[i].userName = userData.userName;
                recordData[i].userMail = userData.emailID;
                recordData[i].doctorName = doctorData.userName;
                recordData[i].doctorMail = doctorData.emailID;
                recordData[i].trainerName = trainerData.userName;
                recordData[i].trainerMail = trainerData.emailID;
                recordData[i].adminName = adminData.userName;
                recordData[i].createdAt = recordData[i].createdAt;
            }
        return recordData;
    }

    app.get('/getRecords', async (req, res) => { 
        try {
            const recordData = await getRecordsData();
            return res.json(recordData);
        }
        catch (err) {
            console.log(err);
        }
    });

    app.post('/updateRecordState', async (req, res) => {
        try {
            const recordID = req.body.recordID;
            const active = req.body.active;

            await client.db("Health_and_Fitness_Tracker").collection("handleRecord").updateOne({recordID: recordID}, {$set: {active: !active}});
            const recordData = await getRecordsData();
            return res.json({
                success: true,
                recordData: recordData
            })
        } catch(err){
            console.log(err)
            return res.json({success:false})
        }
    });

    app.post('/updateAccess', async (req, res) => {
        try {
            const userType = req.body.userType;
            const mailID = req.body.mailID;
            const active = req.body.active;

            await client.db("Health_and_Fitness_Tracker").collection(userType).updateOne(
                {emailID: mailID},
                {$set: {active: !active}});

            if(userType === "User"){
                return res.json({
                    success: true,
                    presentData: await client.db("Health_and_Fitness_Tracker").collection(userType).find({approved:true}).toArray(),
                    newData: await client.db("Health_and_Fitness_Tracker").collection(userType).find({approved:false}).toArray()
                });
            } else {
                return res.json({
                    success: true,
                    presentData: await client.db("Health_and_Fitness_Tracker").collection(userType).find({}).toArray(),
                });
            }
        }
        catch (err) {
            console.log(err);
            return res.json({success: false});
        }
    });

    app.post('/deleteAccount', async (req, res) => {
        try {
            const userType = req.body.userType;
            const mailID = req.body.mailID;


            // Add all dependency delete here

            await client.db("Health_and_Fitness_Tracker").collection(userType).deleteOne({emailID: mailID});
            return res.json({
                success: true,
                presentData: await client.db("Health_and_Fitness_Tracker").collection(userType).find({approved:true}).toArray(),
                newData: await client.db("Health_and_Fitness_Tracker").collection(userType).find({approved:false}).toArray()
            });
        }
        catch (err) {
            console.log(err);
            return res.json({success: false});
        }
    });
}


export default AdminController;