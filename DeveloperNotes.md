## Authentication Blocker

Login endpoint integration has been implemented according to the
Xpress authentication documentation.

POST /StoreFront/Login

Credentials are Base64 encoded as required by the API.

The QA credentials currently return:

responseCode: "10"
responseMessage: "Invalid email or password"

The request has been verified to:
- use the correct base URL
- use the correct endpoint
- Base64 encode email/password
- omit Authorization for login

Backend/QA verification is required for the supplied credentials.

Authenticated API development can continue using the temporary
development JWT supplied by the backend team.


