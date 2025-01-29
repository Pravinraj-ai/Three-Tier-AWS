import SENDMAIL from "../mail/sendMail.js";

const ProfessionalsController = (app, client, jwt) => {

    var roles = {
        "user" : "User",
        "trainer" : "Trainer",
        "admin" : "Admin",
        "doctor" : "Doctor",
    };

    var models = {
        "trainer" : "trainerID",
        "doctor" : "doctorID",
    }

    app.post('/getMyClients', async (req, res) => {
        const emailID = req.body.emailID;
        const userType = req.body.userType;

        try{
            const professionalID_collection = await client.db("Health_and_Fitness_Tracker").collection(roles[userType]).findOne({emailID: emailID});
            if (userType === "trainer") {
                const myClients = await client.db("Health_and_Fitness_Tracker").collection("handleRecord").find({
                    trainerID : professionalID_collection.trainerID
                }).toArray();
                
                for (var i = 0; i < myClients.length; i++) {
                    const clientInfo = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({
                        userID : myClients[i].userID
                    });
                    const docInfo = await client.db("Health_and_Fitness_Tracker").collection("Doctor").findOne({
                        doctorID : myClients[i].doctorID
                    });
                    
                    myClients[i].clientName = clientInfo.userName;
                    myClients[i].clientMailID = clientInfo.emailID;
                    myClients[i].doctorName = docInfo.userName;
                    myClients[i].doctorMailID = docInfo.emailID;

                    myClients[i].fitnessGoals = clientInfo.fitnessGoals;
                    myClients[i].healthData = clientInfo.healthData;
                    myClients[i].gender = clientInfo.gender;
                    myClients[i].contactNumber = clientInfo.contactNumber;
                    myClients[i].dateOfBirth = clientInfo.dateOfBirth;
                    
                }
                
                return res.json({
                    success: true,
                    myClients: myClients,
                })
            }
            else if (userType === "doctor") {
                const myClients = await client.db("Health_and_Fitness_Tracker").collection("handleRecord").find({
                    doctorID : professionalID_collection.doctorID
                }).toArray();
                
                for (var i = 0; i < myClients.length; i++) {
                    const clientInfo = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({
                        userID : myClients[i].userID
                    });
                    const docInfo = await client.db("Health_and_Fitness_Tracker").collection("Doctor").findOne({
                        doctorID : myClients[i].doctorID
                    });
                    
                    myClients[i].clientName = clientInfo.userName;
                    myClients[i].clientMailID = clientInfo.emailID;
                    myClients[i].doctorName = docInfo.userName;
                    myClients[i].doctorMailID = docInfo.emailID;

                    myClients[i].fitnessGoals = clientInfo.fitnessGoals;
                    myClients[i].healthData = clientInfo.healthData;
                    myClients[i].gender = clientInfo.gender;
                    myClients[i].contactNumber = clientInfo.contactNumber;
                    myClients[i].dateOfBirth = clientInfo.dateOfBirth;
                    
                }
                
                return res.json({
                    success: true,
                    myClients: myClients,
                })
            }
        } catch (err) {
            console.log(err)
            return res.json({
                success: false,
            })
        }
       
       
    });

    app.post('/getUserActivityLogProfessional', async (req, res) => {
        const userID = req.body.userID;

        const activityLog = await client.db("Health_and_Fitness_Tracker").collection("fitnessRecord").find({
            userID : userID
        }).sort(
            {timestamp: -1}
        ).toArray();
        return res.json({
            activityLog: activityLog
        });
    });

    const getMyAppointmentData = async (emailID, userType) => {
        
        if (userType === 'doctor') {
            const docData = await client.db("Health_and_Fitness_Tracker").collection("Doctor").findOne({
                emailID : emailID
            });
            const appointmentData = await client.db("Health_and_Fitness_Tracker").collection("appointments").find({
                doctorID : docData.doctorID
            }).sort(
                {createdAt: -1}
            ).toArray();

            for (var i = 0; i < appointmentData.length; i++) {
                const clientInfo = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({
                    userID : appointmentData[i].userID
                });
                appointmentData[i].clientName = clientInfo.userName;
                appointmentData[i].clientMailID = clientInfo.emailID;
                appointmentData[i].contactNumber = clientInfo.contactNumber
            }
            return appointmentData;
        }
        if (userType === 'trainer') {

            const trainerData = await client.db("Health_and_Fitness_Tracker").collection("Trainer").findOne({
                emailID : emailID
            });
            const appointmentData = await client.db("Health_and_Fitness_Tracker").collection("appointments").find({
                trainerID : trainerData.trainerID
            }).sort(
                {createdAt: -1}
            ).toArray();
            for (var i = 0; i < appointmentData.length; i++) {
                const clientInfo = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({
                    userID : appointmentData[i].userID
                });
                appointmentData[i].clientName = clientInfo.userName;
                appointmentData[i].clientMailID = clientInfo.emailID;
                appointmentData[i].contactNumber = clientInfo.contactNumber;
            }
            return appointmentData;
        }
    }

    app.post('/getMyAppointments', async (req, res) => {
        const emailID = req.body.emailID;
        const userType = req.body.userType;

        const appointmentData = await getMyAppointmentData(emailID, userType);

        return res.json({
            success: true,
            appointmentData: appointmentData,
        })
       
    });

    app.post('/updateMyAppointments', async (req, res) => {
        const emailID = req.body.emailID;
        const userType = req.body.userType;
        const appointmentID = req.body.appointmentID;
        const appointmentStatus = req.body.appointmentStatus;
        const appointmentNotes = req.body.appointmentNotes;
        const clientName = req.body.appointmentReqName;
        const clientEmail = req.body.appointmentReqMailID;

        const appointData = await client.db("Health_and_Fitness_Tracker").collection("appointments").findOne({
            appointmentID : appointmentID
        });
        const docData = await client.db("Health_and_Fitness_Tracker").collection("appointments").findOne({doctorID : appointData.doctorID});
        const trainerData = await client.db("Health_and_Fitness_Tracker").collection("appointments").findOne({trainerID : appointData.trainerID});
        const professionalMailID = appointData.professional === 'Doctor' ? docData.emailID : trainerData.emailID;
        const professionalName = appointData.professional === 'Doctor' ? appointData.doctorName : appointData.trainerName;

        await client.db("Health_and_Fitness_Tracker").collection("appointments").updateOne(
            { appointmentID: appointmentID },
            { $set: { status: appointmentStatus, notes: appointmentNotes } }
        ).then((response) => {

            if (appointmentStatus === 'Accepted') {
                SENDMAIL("appointment-confirmed", clientEmail, "Appointment Confirmed", "The appointment has been confirmed.", {
                    professionalName: professionalName,
                    clientname: clientName,
                    date: appointData.appointmentDate,
                    professionalEmail: professionalMailID,
                    time: appointData.appointmentTime,
                }, (info) => {
                });

            } else if(appointmentStatus === 'Canceled') {
                SENDMAIL("appointment-cancelled", clientEmail, "Appointment Canceled", "A appointment has been canceled.", {
                    professionalName: professionalName,
                    clientname: clientName,
                    date: appointData.appointmentDate,
                    professionalEmail: professionalMailID,
                    time: appointData.appointmentTime,
                }, (info) => {
                });
            }
            return res.json({
                success: true,
            })
        }).catch((error) => {
            console.log(error);
            return res.json({
                success: false,
            })
        })
        
        
    });
}

export default ProfessionalsController
