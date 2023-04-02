import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.AWS_DB_ENDPOINT,
  port: Number(process.env.AWS_DB_PORT),
  user: process.env.AWS_DB_USERNAME,
  password: process.env.AWS_DB_PASSWORD,
});

connection.query("CREATE DATABASE IF NOT EXISTS home_away_from_home", (err) => {
  if (err != null) throw err;
  console.log("database created");
});

connection.query("USE home_away_from_home", (err) => {
  if (err != null) throw err;
  console.log("database selected");
});

connection.query(
  `
CREATE TABLE IF NOT EXISTS state (
    state_code VARCHAR(255) NOT NULL,
    state_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (state_code),
    UNIQUE (state_name)
)
    `,
  (err) => {
    if (err != null) throw err;
    console.log("table state created");
  }
);

connection.query(
  `
CREATE TABLE IF NOT EXISTS metro_region (
    region_name VARCHAR(255) NOT NULL,
    state_code VARCHAR(255) NOT NULL,
    PRIMARY KEY (state_code, region_name),
    FOREIGN KEY (state_code) REFERENCES state(state_code) ON DELETE CASCADE
)
    `,
  (err) => {
    if (err != null) throw err;
    console.log("table metro_region created");
  }
);

connection.query(
  `
CREATE TABLE IF NOT EXISTS city (
    city_name VARCHAR(255) NOT NULL,
    state_code VARCHAR(255) NOT NULL,
    metro_region VARCHAR(255) NOT NULL,
    metro_region_state_code VARCHAR(255) NOT NULL,
    PRIMARY KEY (state_code, city_name),
    FOREIGN KEY (state_code) REFERENCES state(state_code) ON DELETE CASCADE,
    FOREIGN KEY (metro_region_state_code, metro_region) REFERENCES metro_region(state_code, region_name) ON DELETE CASCADE
)
    `,
  (err) => {
    if (err != null) throw err;
    console.log("table city created");
  }
);

connection.query(
  `
CREATE TABLE IF NOT EXISTS h1b_case (
    case_id INT NOT NULL,
    case_status VARCHAR(255) NOT NULL,
    emp_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    soc_code VARCHAR(255) NOT NULL,
    soc_name VARCHAR(255) NOT NULL,
    full_time_position VARCHAR(255) NOT NULL,
    prevailing_yearly_wage INT NOT NULL,
    work_state VARCHAR(255) NOT NULL,
    work_city VARCHAR(255) NOT NULL,
    PRIMARY KEY (case_id),
    FOREIGN KEY (work_state, work_city) REFERENCES city(state_code, city_name) ON DELETE CASCADE
)
    `,
  (err) => {
    if (err != null) throw err;
    console.log("table h1b_case created");
  }
);

connection.query(
  `
CREATE TABLE IF NOT EXISTS zip_code (
    zip_code INT NOT NULL,
    metro_region VARCHAR(255) NOT NULL,
    metro_region_state_code VARCHAR(255) NOT NULL,
    PRIMARY KEY (zip_code),
    FOREIGN KEY (metro_region_state_code, metro_region) REFERENCES metro_region(state_code, region_name) ON DELETE CASCADE
)
    `,
  (err) => {
    if (err != null) throw err;
    console.log("table zip_code created");
  }
);

connection.query(
  `
CREATE TABLE IF NOT EXISTS housing_data (
    zip_code INT NOT NULL,
    property_type VARCHAR(255) NOT NULL,
    period_begin DATE NOT NULL,
    period_end DATE NOT NULL,
    median_sale_price INT NOT NULL,
    median_sale_price_yoy INT NOT NULL,
    median_list_price INT NOT NULL,
    median_list_price_yoy INT NOT NULL,
    median_ppsf INT NOT NULL,
    median_ppsf_yoy INT NOT NULL,
    median_list_ppsf INT NOT NULL,
    median_list_ppsf_yoy INT NOT NULL,
    homes_sold INT NOT NULL,
    homes_sold_yoy INT NOT NULL,
    new_listings INT NOT NULL,
    new_listings_yoy INT NOT NULL,
    PRIMARY KEY (zip_code, property_type, period_begin, period_end),
    FOREIGN KEY (zip_code) REFERENCES zip_code(zip_code) ON DELETE CASCADE
)
    `,
  (err) => {
    if (err != null) throw err;
    console.log("table housing_data created");
  }
);

// connection.query(
//   `
// INSERT IGNORE INTO state (state_code, state_name) VALUES
//     ('AL', 'Alabama'),
//     ('AK', 'Alaska'),
//     ('AZ', 'Arizona'),
//     ('AR', 'Arkansas'),
//     ('CA', 'California'),
//     ('CO', 'Colorado'),
//     ('CT', 'Connecticut'),
//     ('DE', 'Delaware'),
//     ('DC', 'District of Columbia'),
//     ('FL', 'Florida'),
//     ('GA', 'Georgia'),
//     ('HI', 'Hawaii'),
//     ('ID', 'Idaho'),
//     ('IL', 'Illinois'),
//     ('IN', 'Indiana'),
//     ('IA', 'Iowa'),
//     ('KS', 'Kansas'),
//     ('KY', 'Kentucky'),
//     ('LA', 'Louisiana'),
//     ('ME', 'Maine'),
//     ('MD', 'Maryland'),
//     ('MA', 'Massachusetts'),
//     ('MI', 'Michigan'),
//     ('MN', 'Minnesota'),
//     ('MS', 'Mississippi'),
//     ('MO', 'Missouri'),
//     ('MT', 'Montana'),
//     ('NE', 'Nebraska'),
//     ('NV', 'Nevada'),
//     ('NH', 'New Hampshire'),
//     ('NJ', 'New Jersey'),
//     ('NM', 'New Mexico'),
//     ('NY', 'New York'),
//     ('NC', 'North Carolina'),
//     ('ND', 'North Dakota'),
//     ('OH', 'Ohio'),
//     ('OK', 'Oklahoma'),
//     ('OR', 'Oregon'),
//     ('PA', 'Pennsylvania'),
//     ('RI', 'Rhode Island'),
//     ('SC', 'South Carolina'),
//     ('SD', 'South Dakota'),
//     ('TN', 'Tennessee'),
//     ('TX', 'Texas'),
//     ('UT', 'Utah'),
//     ('VT', 'Vermont'),
//     ('VA', 'Virginia'),
//     ('WA', 'Washington'),
//     ('WV', 'West Virginia'),
//     ('WI', 'Wisconsin'),
//     ('WY', 'Wyoming')
//     `,
//   (err) => {
//     if (err != null) throw err;
//     console.log("table state populated");
//   }
// );

// connection.query(
//   `
// SELECT DISTINCT parent_metro_region FROM raw_housing_data
// `,
//   (err, result: [{ parent_metro_region: string }]) => {
//     if (err != null) throw err;
//     for (let i = 0; i < result.length; i += 100) {
//       const partial = result.slice(i, i + 100);
//
//       connection.query(
//         `
// INSERT IGNORE INTO metro_region (region_name, state_code) VALUES ${partial
//           .map((row) => {
//             const s = row.parent_metro_region.split(", ");
//             return "('" + s[0].replace("'", `\\'`) + "', '" + s[1] + "')";
//           })
//           .join(", ")}
//         `
//       );
//     }
//
//     console.log("table metro_region populated");
//   }
// );

// connection.query(
//   `
// SELECT DISTINCT region, parent_metro_region FROM raw_housing_data`,
//   (err, result: [{ region: string; parent_metro_region: string }]) => {
//     if (err != null) throw err;
//
//     connection.query(
//       `
// INSERT IGNORE INTO zip_code (zip_code, metro_region, metro_region_state_code) VALUES ${result
//         .map((row) => {
//           const s = row.parent_metro_region.split(", ");
//           return (
//             "(" +
//             row.region.replace("Zip Code: ", "") +
//             ", '" +
//             s[0].replace("'", `\\'`) +
//             "', '" +
//             s[1] +
//             "')"
//           );
//         })
//         .join(", ")}
//         `
//     );
//
//     console.log("table zip_code populated");
//   }
// );

// connection.query(
//   `
// SELECT DISTINCT city, state_code, parent_metro_region FROM raw_city_data
// `,
//   (
//     err,
//     result: [{ city: string; state_code: string; parent_metro_region: string }]
//   ) => {
//     if (err != null) throw err;
//
//     connection.query(
//       `
//             INSERT IGNORE INTO city (city_name, state_code, metro_region, metro_region_state_code)
//             VALUES ${result
//               .map((row) => {
//                 const s = row.parent_metro_region.split(", ");
//                 return (
//                   "('" +
//                   row.city.replace(/'/g, `\\'`) +
//                   "', '" +
//                   row.state_code +
//                   "', '" +
//                   s[0].replace(/'/g, `\\'`) +
//                   "', '" +
//                   s[1] +
//                   "')"
//                 );
//               })
//               .join(", ")}
//         `
//     );
//
//     console.log("table city populated");
//   }
// );

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

for (let i = 0; i < 3360810; i += 1000) {
  connection.query(
    `
SELECT case_status, emp_name, job_title, soc_code, soc_name, full_time_position, prevailing_wage, pw_unit, work_state, work_city FROM raw_h1b_data
ORDER BY job_title, emp_name, work_city, work_state
LIMIT ${i}, 1000
`,
    (
      err,
      result: [
        {
          case_status: string;
          emp_name: string;
          job_title: string;
          soc_code: string;
          soc_name: string;
          full_time_position: string;
          prevailing_wage: string;
          pw_unit: string;
          work_state: string;
          work_city: string;
        }
      ]
    ) => {
      if (err != null) throw err;

      connection.query(
        `
INSERT IGNORE INTO h1b_case (case_status, emp_name, job_title, soc_code, soc_name, full_time_position, prevailing_yearly_wage, work_state, work_city)
VALUES ${result
          .map((row) => {
            let yearlyWage = 0;
            switch (row.pw_unit) {
              case "Y":
                yearlyWage = Number(row.prevailing_wage);
                break;
              case "H":
                yearlyWage = Number(row.prevailing_wage) * 2080;
                break;
              case "W":
                yearlyWage = Number(row.prevailing_wage) * 52;
                break;
              case "M":
                yearlyWage = Number(row.prevailing_wage) * 12;
                break;
              case "BW":
                yearlyWage = Number(row.prevailing_wage) * 26;
                break;
              case "NA":
                return "('A', 'A', 'A', 'A', 'A', 0, 0, 'A', 'A')";
            }

            return `(
    '${row.case_status}',
    '${row.emp_name.replace(/'/g, `\\'`)}',
    '${titleCase(row.job_title.replace(/'/g, `\\'`))}',
    '${row.soc_code}',
    '${titleCase(row.soc_name.replace(/'/g, `\\'`))}',
    '${row.full_time_position === "Y" ? 1 : 0}',
    '${yearlyWage}',
    '${row.work_state}',
    '${titleCase(row.work_city.replace(/'/g, `\\'`))}'
  )`;
          })
          .join(", ")}
`,
        (err, result: { affectedRows: number }) => {
          if (err != null) throw err;

          console.log(`Query ${i} changed ${result.affectedRows} rows`);
        }
      );
    }
  );
}

console.log("h1b data populated");
