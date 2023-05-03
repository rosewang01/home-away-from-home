import { sqlQuery } from "../utils/sql.js";
import type IZipCode from "../models/zipcode.model.js";
import {redisGet, redisSet} from "../utils/redis.js";
import { toTitleCase } from "../utils/titleCase.js";

/**
 * Gets all zip codes in the given state
 * @param city_name
 * @returns all summary statistics for each zip code
 * Summary Statistics: 
 * { zip_code, 
 *   average_housing_price, 
 *   average_housing_price_growth }
 */

const getAllZipCodes = async (city_name: string): Promise<IZipCode[]> => {
    const cached = await redisGet(`zipCodes/${toTitleCase(city_name)}/all`);
    if (cached != null) {
        return JSON.parse(cached) as IZipCode[];
    }

    const zipsRaw = await sqlQuery(`
        WITH mr AS (SELECT metro_region, metro_region_state_code
            FROM city
            WHERE city_name = ${toTitleCase(city_name)}),
        zips AS (SELECT zip_code
            FROM mr JOIN zip_code zc
                on mr.metro_region = zc.metro_region
                        AND mr.metro_region_state_code = zc.metro_region_state_code)
        SELECT h.zip_code AS zip_code, new_listings_yoy AS average_housing_market_growth, median_sale_price AS average_housing_price
        FROM housing_data h JOIN zips ON zips.zip_code = h.zip_code
        GROUP BY h.zip_code;
    `);

    await redisSet(`zipCodes/${toTitleCase(city_name)}/all`, JSON.stringify(zipsRaw));
    return zipsRaw as IZipCode[];
};

/**
 * Gets all zip codes in the given state, sorted by growth
 * @param city_name
 * @returns all summary statistics for each zip code
 * Summary Statistics: 
 * { zip_code, 
 *   average_housing_price, 
 *   average_housing_price_growth }
 */

const getBestGrowthZipCodes = async (city_name: string): Promise<IZipCode[]> => {
    const cached = await redisGet(`zipCodes/${city_name}/growth`);
    if (cached != null) {
        return JSON.parse(cached) as IZipCode[];
    }

    const zipsRaw = await sqlQuery(`
        WITH mr AS (SELECT metro_region, metro_region_state_code
            FROM city
            WHERE city_name = ${toTitleCase(city_name)}),
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

    await redisSet(`zipCodes/${toTitleCase(city_name)}/growth`, JSON.stringify(zipsRaw));
    return zipsRaw as IZipCode[];
}

/**
 * Gets all zip codes in the given state, sorted by cost
 * @param city_name
 * @returns all summary statistics for each zip code
 * Summary Statistics: 
 * { zip_code, 
 *   average_housing_price, 
 *   average_housing_price_growth }
 */

const getBestCostZipCodes = async (city_name: string): Promise<IZipCode[]> => {
    const cached = await redisGet(`zipCodes/${toTitleCase(city_name)}/cost`);
    if (cached != null) {
        return JSON.parse(cached) as IZipCode[];
    }

    const zipsRaw = await sqlQuery(`
        WITH mr AS (SELECT metro_region, metro_region_state_code
            FROM city
            WHERE city_name = ${toTitleCase(city_name)}),
        zips AS (SELECT zip_code
            FROM mr JOIN zip_code zc
                on mr.metro_region = zc.metro_region
                        AND mr.metro_region_state_code = zc.metro_region_state_code),
        housing AS (SELECT h.zip_code, new_listings_yoy, median_sale_price
                FROM housing_data h JOIN zips ON zips.zip_code = h.zip_code)
        SELECT zip_code, new_listings_yoy AS average_housing_market_growth, median_sale_price AS average_housing_price
        FROM housing
        ORDER BY median_sale_price
        LIMIT 5;
    `);

    await redisSet(`zipCodes/${toTitleCase(city_name)}/cost`, JSON.stringify(zipsRaw));
    return zipsRaw as IZipCode[];
}


export { getAllZipCodes, getBestGrowthZipCodes, getBestCostZipCodes };