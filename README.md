# Home Away From Home
Home Away from Home is a web application designed to address the challenges faced by H-1B visa holders when searching
for housing in the United States. With over 582,000 individuals living in the US on a H-1B visa and 85,000 new visas
being issued per year, there is a significant need for reliable and consolidated resources to help these individuals
find their next home.

The application aims to solve this problem by combining H-1B visa data with Redfin housing data to provide a
comprehensive solution. The application offers a searchable table of H-1B visa information and map visualizations of
the data to help users gain insights into where most H-1B visa holders are, who they are employed by, and more. Users
can hover over areas to bring up information about each city or area, and a filtered view allows them to search for
areas matching their employment and housing price criteria. We hope this project provides an intuitive and
user-friendly solution that addresses the needs of H-1B visa holders and helps them find their next home in the US.

### Public URL

Check out the site [here](http://ec2-34-230-151-76.compute-1.amazonaws.com/home)!
Note this url might no longer work due to our site being hosted using an AWS Learner account, which times out after 5 hours.

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

Frontend:
1. Run `cd frontend && yarn install`
2. Run `yarn start`

### Technical Overview
Frontend: ReactJS, Material UI, Mapbox (React MapGL)
Backend: NodeJS, Express
SQL Database: MySQL
Other: Docker, AWS

Our application is built on the React-Express-SQL stack. The front-end website is rendered in React, using Material-UI
to provide base components. We used the MapBox library to render an interactive map that displayed regions from the
housing data we collected. We retrieved geographical boundary information from GeoJSON and processed the coordinates
into polygons that we rendered on the displayed map.

Our backend is built using NodeJs and Express. Express routes each incoming query to a controller function, which
parses the input and calls an appropriate handler to retrieve data from the backend. To speed up query time for common
queries, we automatically cache data in a Redis cluster and attempt to retrieve data from the cache before querying the
SQL server.

We selected MySQL for our SQL server because of its compatibility and ease of setup. Our server is hosted on Amazon RDS
and the backend communicates with it by executing SQL queries, which the server responds to.

We have dockerized the entire application, published it to a container image repository and launched a container
instance on AWS. The dockerized application makes it much easier to scale up the application and move to a different
cloud provider if needed.

### Data Sources
[H1B Dataset](https://www.kaggle.com/datasets/thedevastator/h-1b-non-immigrant-labour-visa)
This dataset contains information about H1B Visas that US companies have obtained to hire foreign workers in
specialized positions such as engineers, scientists and software developers. More specifically, it provides information
on H1B Visa applications filed between 2011 and 2018, including employer identification, job title and salary, location
of work and employee qualifications.

Significant Statistics:
Number of columns: 25
Number of rows: 3,360,810
Storage Usage: 793 MB

[Redfin Home Prices Dataset](https://www.redfin.com/news/data-center/)
Our housing data set comes from the Redfin Home Prices Dataset. Redfin's dataset offers comprehensive and up-to-date
information on the US housing market, providing valuable insights into housing prices, inventory, sales activity, and
local factors. The dataset can be explored using tools that allow users to analyze trends at various levels of
granularity.

Significant Statistics:
Number of columns: 58
Number of rows: 2,053,652
Storage Usage: 3840 MB
