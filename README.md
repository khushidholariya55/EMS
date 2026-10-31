# PeopleDesk Employee Management

PeopleDesk is a starter employee management workspace with email and password sign-in for administrator and employee accounts. The server checks the account role and returns a role-scoped session.

## Run locally

1. Install Node.js and start MongoDB, or create a MongoDB Atlas database.
2. Copy `backend/.env.example` to `backend/.env` and set the MongoDB connection, a long random `JWT_SECRET`, and the admin name, email, and password.
3. In `backend`, run `npm install`, then `npm run seed:admin` once to create the configured administrator account. Run `npm run dev` to start the API.
4. In `frontend`, run `npm install`, then `npm run dev` and open the local address shown by Vite.
5. Sign in with the admin email and password configured in `backend/.env`.

To add an employee account, set `EMPLOYEE_NAME`, `EMPLOYEE_EMAIL`, `EMPLOYEE_PASSWORD`, and optionally `EMPLOYEE_ID` in `backend/.env`, then run `npm run seed:employee` from `backend`. Both seed commands hash passwords before saving them. They create the `ems` database and `users` collection automatically when using the example local MongoDB URI. Connect MongoDB Compass using the same `MONGO_URI` from `backend/.env` to view the records. The current server does not expose public registration.

The signed-in workspace currently uses sample dashboard figures and employee activity. Replace those examples with database-backed employee, attendance, and leave data as those features are added.

## MongoDB Atlas connection trouble

If Node reports `querySrv ECONNREFUSED`, set `DNS_SERVERS` in `backend/.env` to a DNS resolver that supports SRV lookups. This project supports a comma-separated list; remove the setting to use the operating system defaults.

If DNS resolves but Atlas still times out or reports a TLS connection error, add the current machine's public IP to the Atlas project's **Network Access** IP access list, then restart the backend. Atlas only accepts client connections from addresses on that list. See the [Atlas connection troubleshooting guide](https://www.mongodb.com/docs/atlas/troubleshoot-connection/) and [IP access list guide](https://www.mongodb.com/docs/atlas/security/ip-access-list/).
