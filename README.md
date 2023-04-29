# home-away-from-home
CIS 450/550 Final Project: web app built on Red Fin Housing and H-1B Visa data.

### Setup
Backend:
1. Install [redis](https://redis.io/docs/getting-started/)
2. Ensure the local redis instance is running
   1. On Mac/Linux run `sudo systemctl enable redis && sudo systemctl start redis`
3. Create a `.env` file in the `backend` directory with the following contents:
    ```
    AWS_DB_ENDPOINT=xxxxxxxxxxxxx.us-east-1.rds.amazonaws.com
    AWS_DB_PORT=3306
    AWS_DB_USERNAME=admin
    AWS_DB_PASSWORD=xxxxxxxxxxxxx
    DB_NAME=home_away_from_home
    ```
4. Run `cd backend && yarn install`
5. Run `yarn start`