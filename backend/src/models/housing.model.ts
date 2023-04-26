interface IHousing {
    zip_code: number;
    property_type: string;
    period_begin: Date;
    period_end: Date;
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