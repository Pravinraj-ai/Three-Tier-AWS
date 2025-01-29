import SENDMAIL from "../mail/sendMail.js";

const UserController = (app, client, jwt) => {

    app.post('/getActivityLog', async (req, res) => {
        const emailID = req.body.emailID;
        try {
            const userID = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({emailID: emailID});
            const activityLog = await client.db("Health_and_Fitness_Tracker").collection("fitnessRecord").find({userID: userID.userID}).toArray();
            return res.json({log: activityLog, success: true});

        } catch(error) {
            return res.json({success: false});
        }
        

    });

    app.post('/postLog', async (req, res) => {
        const {type, emailID, description, value, timestamp} = req.body.log;

        // console.log('Type:', type);
        // console.log('Email:', emailID);
        // console.log('Description:', description);
        // console.log('Value:', value);
        // console.log('Timestamp:', timestamp);

        const userData = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({emailID: emailID});

        let date_time = new Date();
        let date = ("0" + date_time.getDate()).slice(-2);
        let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
        let year = date_time.getFullYear();
        let hours = date_time.getHours();
        let minutes = date_time.getMinutes();
        let seconds = date_time.getSeconds();

        const createdAt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        const recordID = emailID + "_" + year + "-" + month + "-" + date + "_" + hours + "_" + minutes + "_" + seconds;


        try {
            await client.db("Health_and_Fitness_Tracker").collection("fitnessRecord").insertOne({
                recordID: recordID,
                userID: userData.userID,
                type: type,
                description: description,
                timestamp: timestamp,   
                value: value,
                createdAt: createdAt,
            });
            return res.json({
                success: true,
                logData: await client.db("Health_and_Fitness_Tracker").collection("fitnessRecord").find({userID: userData.userID}).toArray(),
            });

        } catch(error) {
            console.log(error);
            return res.json({success: false});
        }
    });

    const getAppointmentDataPast = async (userMail) => {
        const userData = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({emailID: userMail});
        const appointmentData = await client.db("Health_and_Fitness_Tracker").collection("appointments").find({
            userID: userData.userID
        }).sort({ status:-1}).toArray();

        for(let i = 0; i < appointmentData.length; i++) {
            if(appointmentData[i].professional === 'Doctor') {
                const doctorData = await client.db("Health_and_Fitness_Tracker").collection("Doctor").findOne({
                    doctorID: appointmentData[i].doctorID
                });
                appointmentData[i].assignedProfessional = doctorData.userName;
                appointmentData[i].type = 'Doctor';
                appointmentData[i].title = 'Doctor Consultation';
            } else if(appointmentData[i].professional === 'Trainer') {
                const trainerData = await client.db("Health_and_Fitness_Tracker").collection("Trainer").findOne({
                    trainerID: appointmentData[i].trainerID
                });
                appointmentData[i].assignedProfessional = trainerData.userName;
                appointmentData[i].type = 'Trainer';
                appointmentData[i].title = 'Trainer Session';
            }
            appointmentData[i].durations = 60;
            appointmentData[i].id = appointmentData[i].appointmentID;
            const year = appointmentData[i].appointmentDate.slice(0, 4);
            const month = appointmentData[i].appointmentDate.slice(5, 7);
            const date = appointmentData[i].appointmentDate.slice(8, 10);
            const startTime = appointmentData[i].appointmentTime.slice(0, 2);
            appointmentData[i].date = new Date(year, month-1, date, startTime, 0);
        }
    
        return appointmentData;
    }
    const getAppointmentData = async (userMail) => {
        const userData = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({emailID: userMail});
        const appointmentData = await client.db("Health_and_Fitness_Tracker").collection("appointments").find({
            userID: userData.userID,
            status:  { $ne: 'Canceled' }
        }).toArray();

        for(let i = 0; i < appointmentData.length; i++) {
            if(appointmentData[i].professional === 'Doctor') {
                const doctorData = await client.db("Health_and_Fitness_Tracker").collection("Doctor").findOne({
                    doctorID: appointmentData[i].doctorID
                });
                appointmentData[i].assignedProfessional = doctorData.userName;
                appointmentData[i].type = 'Doctor';
                appointmentData[i].title = 'Doctor Consultation';
            } else if(appointmentData[i].professional === 'Trainer') {
                const trainerData = await client.db("Health_and_Fitness_Tracker").collection("Trainer").findOne({
                    trainerID: appointmentData[i].trainerID
                });
                appointmentData[i].assignedProfessional = trainerData.userName;
                appointmentData[i].type = 'Trainer';
                appointmentData[i].title = 'Trainer Session';
            }
            appointmentData[i].durations = 60;
            appointmentData[i].id = appointmentData[i].appointmentID;
            const year = appointmentData[i].appointmentDate.slice(0, 4);
            const month = appointmentData[i].appointmentDate.slice(5, 7);
            const date = appointmentData[i].appointmentDate.slice(8, 10);
            const startTime = appointmentData[i].appointmentTime.slice(0, 2);
            appointmentData[i].date = new Date(year, month-1, date, startTime, 0);
        }
    
        return appointmentData;
    }

    app.post('/getUserAppointments', async (req, res) => {
        const userMail = req.body.emailID;
        const appointmentData = await getAppointmentData(userMail);
        return res.json({success: true, appointments: appointmentData});
    });

    app.post('/getPastUserAppointments', async (req, res) => {
        const userMail = req.body.emailID;
        const appointmentData = await getAppointmentDataPast(userMail);
        return res.json({success: true, appointments: appointmentData});
    });

    app.post('/bookAppointment', async (req, res) => {
        const userMail = req.body.emailID;
        const tempDate = req.body.date;
        const time = req.body.time;
        const professional = req.body.professional;
        const appointmentDate = tempDate.slice(0, 10);


        let date_time = new Date();
        let date = ("0" + date_time.getDate()).slice(-2);
        let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
        let year = date_time.getFullYear();
        let hours = date_time.getHours();
        let minutes = date_time.getMinutes();
        let seconds = date_time.getSeconds();

        const createdAt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        const appointmentID = userMail + "_" + year + "-" + month + "-" + date + "_" + hours + "_" + minutes + "_" + seconds;
        
        const userData = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({emailID: userMail});
        const handleData = await client.db("Health_and_Fitness_Tracker").collection("handleRecord").findOne({
            userID: userData.userID
        })

        const doctorData = await client.db("Health_and_Fitness_Tracker").collection("Doctor").findOne({
            doctorID: handleData.doctorID
        })
        const trainerData = await client.db("Health_and_Fitness_Tracker").collection("Trainer").findOne({
            trainerID: handleData.trainerID
        })
        const professionalName = professional === 'Doctor' ? doctorData.userName : trainerData.userName;
        const professionalMailID = professional === 'Doctor' ? doctorData.emailID : trainerData.emailID;
        try {
            await client.db("Health_and_Fitness_Tracker").collection("appointments").insertOne({
                appointmentID : appointmentID,
                userID: userData.userID,
                appointmentDate: appointmentDate,
                appointmentTime: time,
                professional: professional,
                doctorID : handleData.doctorID,
                doctorName : doctorData.userName,
                trainerID : handleData.trainerID, 
                trainerName : doctorData.userName,
                createdAt: createdAt,
                status: 'Booked',
                notes: '',
            });

            SENDMAIL("appointment-booked", professionalMailID, "Appointment Booked", "A appointment has been asked", {
                professionalName: professionalName,
                clientname: userData.userName,
                date: appointmentDate,
                time: time,
            }, (info) => {
            });
            const appointmentData = await getAppointmentData(userMail);
            return res.json({success: true, appointments: appointmentData});
        } catch(error) {
            console.log(error);
            return res.json({success: false});
        }
    });

    app.post('/cancelAppointment', async (req, res) => {
        const appointmentID = req.body.appointmentID;
        const userMail = req.body.emailID;
        
        try {
            await client.db("Health_and_Fitness_Tracker").collection("appointments").updateOne({
                appointmentID: appointmentID
            }, {
                $set: {
                    status: 'Canceled'
                }
            });
            const appointmentData = await getAppointmentData(userMail);
            return res.json({success: true, appointments: appointmentData});
        } catch(error) {
            console.log(error);
            return res.json({success: false});
        }
    });

    app.post('/getFitnessGoalClient', async (req, res) => {
        const userMailID = req.body.email;

        const userData = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({emailID: userMailID});
        return res.json({
            success: true,
            fitnessGoal: userData.fitnessGoals,
        });
    });

    app.post('/getProfileDetails', async (req, res) => {
        const userMailID = req.body.emailID;
        const userData = await client.db("Health_and_Fitness_Tracker").collection("User").findOne({emailID: userMailID});
        const handleData = await client.db("Health_and_Fitness_Tracker").collection("handleRecord").findOne({userID: userData.userID});
        const docData = await client.db("Health_and_Fitness_Tracker").collection("Doctor").findOne({doctorID: handleData.doctorID});
        const trainerData = await client.db("Health_and_Fitness_Tracker").collection("Trainer").findOne({trainerID: handleData.trainerID});
        const returnData = {
            doctorName : docData.userName,
            doctorMail : docData.emailID,
            doctorQualification : docData.qualification,
            trainerQualification : trainerData.qualification,
            doctorNumber : docData.contactNumber,
            trainerName : trainerData.userName,
            trainerNumber : trainerData.contactNumber,
            trainerMail : trainerData.emailID,
            doctorSpecialization : docData.specialization,
            trainerSpecialization : trainerData.specialization,
        };

        return res.json({
            success: true,
            profile: returnData,
        })
    });
}

export default UserController
