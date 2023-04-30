import { sqlQuery } from "../utils/sql.js";
import type IZipCode from "../models/zipcode.model.js";

const getAllZipCodes = async (city_name: string): Promise<IZipCode[]> => {
    const zipsRaw = await sqlQuery(`
        WITH mr AS (SELECT metro_region, metro_region_state_code
            FROM city
            WHERE city_name = ${city_name}),
        zips AS (SELECT zip_code
            FROM mr JOIN zip_code zc
                on mr.metro_region = zc.metro_region
                        AND mr.metro_region_state_code = zc.metro_region_state_code)
        SELECT h.zip_code AS zip_code, new_listings_yoy AS average_housing_market_growth, median_sale_price AS average_housing_price
        FROM housing_data h JOIN zips ON zips.zip_code = h.zip_code
        GROUP BY h.zip_code;
    `);
    return zipsRaw as IZipCode[];
};

const getBestGrowthZipCodes = async (city_name: string): Promise<IZipCode[]> => {
    const zipsRaw = await sqlQuery(`
        WITH mr AS (SELECT metro_region, metro_region_state_code
            FROM city
            WHERE city_name = ${city_name}),
        zips AS (SELECT zip_code
            FROM mr JOIN zip_code zc
                on mr.metro_region = zc.metro_region
                        AND mr.metro_region_state_code = zc.metro_region_state_code),
        housing AS (SELECT h.zip_code, new_listings_yoy, median_sale_price
                FROM housing_data h JOIN zips ON zips.zip_code = h.zip_code)
        SELECT zip_code, new_listings_yoy AS average_housing_market_growth, median_sale_price AS average_housing_price
        FROM housing
        ORDER BY new_listings_yoy DESC
        LIMIT 5;
    `);
    return zipsRaw as IZipCode[];
}

const getBestCostZipCodes = async (city_name: string): Promise<IZipCode[]> => {
    const zipsRaw = await sqlQuery(`
        WITH mr AS (SELECT metro_region, metro_region_state_code
            FROM city
            WHERE city_name = ${city_name}),
        zips AS (SELECT zip_code
            FROM mr JOIN zip_code zc
                on mr.metro_region = zc.metro_region
                        AND mr.metro_region_state_code = zc.metro_region_state_code),
        housing AS (SELECT h.zip_code, new_listings_yoy, median_sale_price
                FROM housing_data h JOIN zips ON zips.zip_code = h.zip_code)
        SELECT zip_code, new_listings_yoy AS average_housing_market_growth, median_sale_price AS average_housing_price
        FROM housing
        ORDER BY median_sale_price ASC
        LIMIT 5;
    `);
    return zipsRaw as IZipCode[];
}


export { getAllZipCodes, getBestGrowthZipCodes, getBestCostZipCodes };