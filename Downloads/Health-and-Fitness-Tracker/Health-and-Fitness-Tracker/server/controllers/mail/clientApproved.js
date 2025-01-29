const ClientApproved_TEMPLATE = (content) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Account Creation</title>
          <style>
            .container {
              width: 100%;
              height: 100%;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h1>Health and Fitness Tracker</h1>
              </div>    
              <div class="email-body">
                <p>Hi ${content.userName},</p>
                <br />
                We are delighted to welcome you to the Health and Fitness Tracker website. <br />
                Your request to join the Health and Fitness Tracker website has been approved by the admin. <br />  <br/>
                Your assigned doctor is <b>${content.doctorName}</b>. <br />
                Your assigned trainer is <b>${content.trainerName}</b>. <br />
                <br/>

                You can continue to login to the website using your credentials. <br />
 
              </div>
              <div class="email-footer">
                <p>This is is a auto generated mail.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  
  export default ClientApproved_TEMPLATE;