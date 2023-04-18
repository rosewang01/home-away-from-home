import mysql from "mysql";
import dotenv from "dotenv";
import * as util from "util";

dotenv.config();

function makeDb(): {
  query: (sql: string) => Promise<unknown>;
  close: () => Promise<void>;
} {
  const connection = mysql.createConnection({
    host: process.env.AWS_DB_ENDPOINT,
    port: Number(process.env.AWS_DB_PORT),
    user: process.env.AWS_DB_USERNAME,
    password: process.env.AWS_DB_PASSWORD,
  });
  return {
    async query(sql: string) {
      return await util.promisify(connection.query).call(connection, sql);
    },
    async close() {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      await util.promisify(connection.end).call(connection);
    },
  };
}

const connection = makeDb();

await connection.query("CREATE DATABASE IF NOT EXISTS home_away_from_home");
console.log("database created");

await connection.query("USE home_away_from_home");
console.log("database selected");

await connection.query(
  `
CREATE TABLE IF NOT EXISTS state
(
    state_code VARCHAR(2) NOT NULL,
    state_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (state_code),
    UNIQUE (state_name)
)
  `
);
console.log("table state created");

await connection.query(
  `
CREATE TABLE IF NOT EXISTS metro_region (
    region_name VARCHAR(255) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    PRIMARY KEY (state_code, region_name),
    FOREIGN KEY (state_code) REFERENCES state(state_code) ON DELETE CASCADE
)
    `
);
console.log("table metro_region created");

await connection.query(
  `
CREATE TABLE IF NOT EXISTS city (
    city_name VARCHAR(255) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    metro_region VARCHAR(255) NOT NULL,
    metro_region_state_code VARCHAR(2) NOT NULL,
    PRIMARY KEY (state_code, city_name),
    FOREIGN KEY (state_code) REFERENCES state(state_code) ON DELETE CASCADE,
    FOREIGN KEY (metro_region_state_code, metro_region) REFERENCES metro_region(state_code, region_name) ON DELETE CASCADE
)
    `
);
console.log("table city created");

await connection.query(
  `
CREATE TABLE IF NOT EXISTS h1b_case (
    case_id INT NOT NULL AUTO_INCREMENT,
    case_status VARCHAR(2) NOT NULL,
    emp_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    soc_code VARCHAR(20) NOT NULL,
    soc_name VARCHAR(255) NOT NULL,
    full_time_position TINYINT(1) NOT NULL,
    prevailing_yearly_wage DECIMAL(10, 2) NOT NULL,
    work_state VARCHAR(2) NOT NULL,
    work_city VARCHAR(255) NOT NULL,
    PRIMARY KEY (case_id),
    FOREIGN KEY (work_state, work_city) REFERENCES city(state_code, city_name) ON DELETE CASCADE
)
    `
);
console.log("table h1b_case created");

await connection.query(
  `
CREATE TABLE IF NOT EXISTS zip_code (
    zip_code INT NOT NULL,
    metro_region VARCHAR(255) NOT NULL,
    metro_region_state_code VARCHAR(2) NOT NULL,
    PRIMARY KEY (zip_code),
    FOREIGN KEY (metro_region_state_code, metro_region) REFERENCES metro_region(state_code, region_name) ON DELETE CASCADE
)
    `
);
console.log("table zip_code created");

await connection.query(
  `
CREATE TABLE IF NOT EXISTS housing_data (
    zip_code INT NOT NULL,
    property_type VARCHAR(255) NOT NULL,
    period_begin DATE NOT NULL,
    period_end DATE NOT NULL,
    median_sale_price DECIMAL(10, 2) NOT NULL,
    median_sale_price_yoy DECIMAL(10, 9) NOT NULL,
    median_list_price DECIMAL(10, 2) NOT NULL,
    median_list_price_yoy DECIMAL(10, 9) NOT NULL,
    median_ppsf DECIMAL(10, 2) NOT NULL,
    median_ppsf_yoy DECIMAL(10, 9) NOT NULL,
    median_list_ppsf DECIMAL(10, 2) NOT NULL,
    median_list_ppsf_yoy DECIMAL(10, 9) NOT NULL,
    homes_sold INT NOT NULL,
    homes_sold_yoy DECIMAL(10, 9) NOT NULL,
    new_listings INT NOT NULL,
    new_listings_yoy DECIMAL(10, 9) NOT NULL,
    inventory INT NOT NULL,
    inventory_yoy DECIMAL(10, 9) NOT NULL,
    median_dom DECIMAL(10, 2) NOT NULL,
    median_dom_yoy DECIMAL(10, 9) NOT NULL,
    avg_sale_to_list DECIMAL(10, 9) NOT NULL,
    avg_sale_to_list_yoy DECIMAL(10, 9) NOT NULL,
    PRIMARY KEY (zip_code, property_type, period_begin, period_end),
    FOREIGN KEY (zip_code) REFERENCES zip_code(zip_code) ON DELETE CASCADE
)
    `
);
console.log("table housing_data created");

await connection.query(
  `
INSERT IGNORE INTO state (state_code, state_name) VALUES
    ('AL', 'Alabama'),
    ('AK', 'Alaska'),
    ('AZ', 'Arizona'),
    ('AR', 'Arkansas'),
    ('CA', 'California'),
    ('CO', 'Colorado'),
    ('CT', 'Connecticut'),
    ('DE', 'Delaware'),
    ('DC', 'District of Columbia'),
    ('FL', 'Florida'),
    ('GA', 'Georgia'),
    ('HI', 'Hawaii'),
    ('ID', 'Idaho'),
    ('IL', 'Illinois'),
    ('IN', 'Indiana'),
    ('IA', 'Iowa'),
    ('KS', 'Kansas'),
    ('KY', 'Kentucky'),
    ('LA', 'Louisiana'),
    ('ME', 'Maine'),
    ('MD', 'Maryland'),
    ('MA', 'Massachusetts'),
    ('MI', 'Michigan'),
    ('MN', 'Minnesota'),
    ('MS', 'Mississippi'),
    ('MO', 'Missouri'),
    ('MT', 'Montana'),
    ('NE', 'Nebraska'),
    ('NV', 'Nevada'),
    ('NH', 'New Hampshire'),
    ('NJ', 'New Jersey'),
    ('NM', 'New Mexico'),
    ('NY', 'New York'),
    ('NC', 'North Carolina'),
    ('ND', 'North Dakota'),
    ('OH', 'Ohio'),
    ('OK', 'Oklahoma'),
    ('OR', 'Oregon'),
    ('PA', 'Pennsylvania'),
    ('RI', 'Rhode Island'),
    ('SC', 'South Carolina'),
    ('SD', 'South Dakota'),
    ('TN', 'Tennessee'),
    ('TX', 'Texas'),
    ('UT', 'Utah'),
    ('VT', 'Vermont'),
    ('VA', 'Virginia'),
    ('WA', 'Washington'),
    ('WV', 'West Virginia'),
    ('WI', 'Wisconsin'),
    ('WY', 'Wyoming')
    `
);
console.log("table state populated");

// const metroRegions: [{ parent_metro_region: string }] = (await connection.query(
//   `
// SELECT DISTINCT parent_metro_region FROM raw_housing_data
// `
// )) as [{ parent_metro_region: string }];
//
// for (let i = 0; i < metroRegions.length; i += 100) {
//   const partial = metroRegions.slice(i, i + 100);
//
//   await connection.query(
//     `
// INSERT IGNORE INTO metro_region (region_name, state_code) VALUES ${partial
//       .map((row) => {
//         const s = row.parent_metro_region.split(", ");
//         return "('" + s[0].replace("'", `\\'`) + "', '" + s[1] + "')";
//       })
//       .join(", ")}
//         `
//   );
// }

// const parentMetroRegions = (await connection.query(
//   `
// SELECT DISTINCT region, parent_metro_region FROM raw_housing_data`
// )) as [{ region: string; parent_metro_region: string }];

// await connection.query(
//   `
// INSERT IGNORE INTO zip_code (zip_code, metro_region, metro_region_state_code) VALUES ${parentMetroRegions
//     .map((row) => {
//       const s = row.parent_metro_region.split(", ");
//       return (
//         "(" +
//         row.region.replace("Zip Code: ", "") +
//         ", '" +
//         s[0].replace("'", `\\'`) +
//         "', '" +
//         s[1] +
//         "')"
//       );
//     })
//     .join(", ")}
//         `
// );

console.log("table zip_code populated");

// const cities = (await connection.query(
//   `
// SELECT DISTINCT city, state_code, parent_metro_region FROM raw_city_data
// `
// )) as [{ city: string; state_code: string; parent_metro_region: string }];
//
// await connection.query(
//   `
//             INSERT IGNORE INTO city (city_name, state_code, metro_region, metro_region_state_code)
//             VALUES ${cities
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
// );

console.log("table city populated");

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function mysqlEscape(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case '"':
      case "'":
      case "\\":
      case "%":
        return "\\" + char; // prepends a backslash to backslash, percent,
      // and double/single quotes
      default:
        return char;
    }
  });
}

await connection.query(
  `
CREATE TABLE IF NOT EXISTS temp_h1b_data (
  case_id INT AUTO_INCREMENT,
  case_status VARCHAR(255),
  emp_name VARCHAR(255),
  job_title VARCHAR(255),
  soc_code VARCHAR(20),
  soc_name VARCHAR(255),
  full_time_position VARCHAR(2),
  prevailing_wage DECIMAL(10, 2),
  pw_unit VARCHAR(255),
  work_state VARCHAR(255),
  work_city VARCHAR(255),
  PRIMARY KEY (case_id)
)
  `
);
//
// await connection.query(
//   `
// INSERT INTO h1b_data (case_status, emp_name, job_title, soc_code, soc_name, full_time_position, prevailing_wage, pw_unit, work_state, work_city)
// SELECT case_status, emp_name, job_title, soc_code, soc_name, full_time_position, prevailing_wage, pw_unit, work_state, work_city
// FROM raw_h1b_data
//   `
// );

for (let i = 100000; i < 3360810; i += 10000) {
  console.log(`starting ${i}`);

  const result = await connection.query(
    `
SELECT * FROM temp_h1b_data
ORDER BY case_id
LIMIT ${i}, 10000
`
  );

  const data = result as [
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
  ];

  await connection.query(
    `
INSERT IGNORE INTO h1b_case (case_status, emp_name, job_title, soc_code, soc_name, full_time_position, prevailing_yearly_wage, work_state, work_city)
VALUES ${data
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
    '${mysqlEscape(row.emp_name)}',
    '${mysqlEscape(titleCase(row.job_title))}',
    '${row.soc_code}',
    '${mysqlEscape(titleCase(row.soc_name))}',
    '${row.full_time_position === "Y" ? 1 : 0}',
    '${yearlyWage}',
    '${row.work_state}',
    '${mysqlEscape(titleCase(row.work_city))}'
  )`;
      })
      .join(", ")}
`
  );
}

console.log("h1b data populated");

await connection.query(
  `
CREATE TABLE IF NOT EXISTS temp_housing_data (
  id INT AUTO_INCREMENT,
  region VARCHAR(255),
  property_type VARCHAR(255),
  period_begin VARCHAR(255),
  period_end VARCHAR(255),
  median_sale_price DECIMAL(10, 2),
  median_sale_price_yoy DECIMAL(10, 9),
  median_list_price DECIMAL(10, 2),
  median_list_price_yoy DECIMAL(10, 9),
  median_ppsf DECIMAL(10, 2),
  median_ppsf_yoy DECIMAL(10, 9),
  median_list_ppsf DECIMAL(10, 2),
  median_list_ppsf_yoy DECIMAL(10, 9),
  homes_sold INT,
  homes_sold_yoy DECIMAL(10, 9),
  new_listings INT,
  new_listings_yoy DECIMAL(10, 9),
  inventory INT,
  inventory_yoy DECIMAL(10, 9),
  median_dom decimal(10, 2),
  median_dom_yoy DECIMAL(10, 9),
  avg_sale_to_list DECIMAL(10, 9),
  avg_sale_to_list_yoy DECIMAL(10, 9),
  PRIMARY KEY (id)
)
  `
);

// await connection.query(
//   `
// INSERT INTO temp_housing_data (region, property_type, period_begin, period_end, median_sale_price, median_sale_price_yoy, median_list_price, median_list_price_yoy, median_ppsf, median_ppsf_yoy, median_list_ppsf, median_list_ppsf_yoy, homes_sold, homes_sold_yoy, new_listings, new_listings_yoy, inventory, inventory_yoy, median_dom, median_dom_yoy, avg_sale_to_list, avg_sale_to_list_yoy)
// SELECT region, property_type, period_begin, period_end, median_sale_price, median_sale_price_yoy, median_list_price, median_list_price_yoy, median_ppsf, median_ppsf_yoy, median_list_ppsf, median_list_ppsf_yoy, homes_sold, homes_sold_yoy, new_listings, new_listings_yoy, inventory, inventory_yoy, median_dom, median_dom_yoy, avg_sale_to_list, avg_sale_to_list_yoy
// FROM raw_housing_data
//   `
// );

for (let i = 100000; i < 5301382; i += 10000) {
  console.log(`starting ${i}`);

  const result = await connection.query(
    `
SELECT * FROM temp_housing_data
ORDER BY id
LIMIT ${i}, 10000
`
  );

  const data = result as [
    {
      region: string;
      property_type: string;
      period_begin: string;
      period_end: string;
      median_sale_price: number;
      median_sale_price_yoy: number;
      median_list_price: number;
      median_list_price_yoy: number;
      median_ppsf: number;
      median_ppsf_yoy: number;
      median_list_ppsf: number;
      median_list_ppsf_yoy: number;
      homes_sold: number;
      homes_sold_yoy: number;
      new_listings: number;
      new_listings_yoy: number;
      inventory: number;
      inventory_yoy: number;
      median_dom: number;
      median_dom_yoy: number;
      avg_sale_to_list: number;
      avg_sale_to_list_yoy: number;
    }
  ];

  await connection.query(
    `
INSERT IGNORE INTO housing_data (zip_code, property_type, period_begin, period_end, median_sale_price, median_sale_price_yoy, median_list_price, median_list_price_yoy, median_ppsf, median_ppsf_yoy, median_list_ppsf, median_list_ppsf_yoy, homes_sold, homes_sold_yoy, new_listings, new_listings_yoy, inventory, inventory_yoy, median_dom, median_dom_yoy, avg_sale_to_list, avg_sale_to_list_yoy)
    VALUES ${data
      .map((row) => {
        return `(
      '${row.region.replace("Zip Code: ", "")}',
      '${row.property_type}',
      '${row.period_begin}',
      '${row.period_end}',
      '${row.median_sale_price}',
      '${row.median_sale_price_yoy}',
      '${row.median_list_price}',
      '${row.median_list_price_yoy}',
      '${row.median_ppsf}',
      '${row.median_ppsf_yoy}',
      '${row.median_list_ppsf}',
      '${row.median_list_ppsf_yoy}',
      '${row.homes_sold}',
      '${row.homes_sold_yoy}',
      '${row.new_listings}',
      '${row.new_listings_yoy}',
      '${row.inventory}',
      '${row.inventory_yoy}',
      '${row.median_dom}',
      '${row.median_dom_yoy}',
      '${row.avg_sale_to_list}',
      '${row.avg_sale_to_list_yoy}'
    )`;
      })
      .join(", ")}
  `
  );
}
