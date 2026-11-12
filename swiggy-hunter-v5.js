javascript:(async function(){'use strict';
/* Instamart Deal Hunter V5. Independent rewrite; active browser session only.
   Sequential requests with conservative pacing. Stops on HTTP 403/429. */
  const CFG = {
    itemsPerPage: 26,
    buildVersion: '2.363.0',
    pacing: { subMin: 1800, subMax: 2800 },
    sections: ['All', 'Featured', 'Fresh', 'Grocery', 'Snacks', 'Beauty', 'Household'],
    cats: {
    "The NOICE Store": {
        "cName": "The NOICE Store",
        "section": "Featured",
        "campaignType": "collection",
        "subs": [
            { "name": "Top Deals", "id": "408822", "isCollection": true },
            { "name": "Dairy, Bread Eggs & More", "id": "377503", "isCollection": true },
            { "name": "Chocolates & Ice Creams", "id": "377513", "isCollection": true },
            { "name": "Munchies", "id": "377515", "isCollection": true },
            { "name": "Atta & Ghee", "id": "395522", "isCollection": true },
            { "name": "Beverages", "id": "377517", "isCollection": true },
            { "name": "Spreads & Dips", "id": "377520", "isCollection": true },
            { "name": "Cakes & Cookies", "id": "377510", "isCollection": true },
            { "name": "Indian Sweets", "id": "377514", "isCollection": true },
            { "name": "Chocolates", "id": "377516", "isCollection": true },
            { "name": "Dry Fruits", "id": "365176", "isCollection": true },
            { "name": "Veg Frozen Food", "id": "377519", "isCollection": true },
            { "name": "Non Veg Frozen Food", "id": "285297", "isCollection": true },
            { "name": "Chutneys & Pickles", "id": "377521", "isCollection": true },
            { "name": "Coffee", "id": "359943", "isCollection": true },
            { "name": "Protein Bars", "id": "290645", "isCollection": true }
        ]
    },
    "Wednesday Bazaar": {
        "cName": "Wednesday Bazaar",
        "section": "Featured",
        "isCampaign": true,
        "campaignType": "collection",
        "collectionId": "397320",
        "layoutId": "32944",
        "subs": [
            {
                "name": "Milk, Butter & Curd",
                "id": "dairy"
            },
            {
                "name": "Paneer & Tofu",
                "id": "paneer"
            },
            {
                "name": "Fresh Eggs",
                "id": "eggs"
            },
            {
                "name": "Fresh Chutneys & Dips",
                "id": "chutney"
            },
            {
                "name": "Chapatis & Parotas",
                "id": "breads"
            },
            {
                "name": "Atta & Pink Salt",
                "id": "staples"
            }
        ]
    },
    "Fresh Vegetables": {
        "cName": "Fresh Vegetables",
        "tType": "Speciality taxonomy 1",
        "section": "Fresh",
        "subs": [
            {
                "name": "Fresh Vegetables",
                "id": "6822eeeded32000001e25aa2"
            },
            {
                "name": "Leafy and Seasonings",
                "id": "6822eeeded32000001e25aa3"
            },
            {
                "name": "Exotic Vegetables",
                "id": "6822eeeded32000001e25aa4"
            },
            {
                "name": "nectr",
                "id": "69380ea9945fd90001ca9e57"
            },
            {
                "name": "Premium Produce",
                "id": "6a950ffd114a1800015f6042"
            },
            {
                "name": "Pooja & Festive",
                "id": "6822eeeded32000001e25aa7"
            },
            {
                "name": "Certified Organics",
                "id": "6822eeeded32000001e25aa8"
            },
            {
                "name": "Frozen Vegetables",
                "id": "68243edc0c0f930001b2188d"
            },
            {
                "name": "Bouquet & Plants",
                "id": "6822eeeded32000001e25aaa"
            },
            {
                "name": "Cuts and sprouts",
                "id": "6822eeeded32000001e25aa6"
            },
            {
                "name": "Fresh Fruits",
                "id": "6822eeeded32000001e25aad"
            }
        ]
    },
    "Fresh Fruits": {
        "cName": "Fresh Fruits",
        "tType": "Speciality taxonomy 1",
        "section": "Fresh",
        "subs": [
            {
                "name": "Fresh Fruits",
                "id": "6822eeeded32000001e25aaf"
            },
            {
                "name": "Seasonal Fruits",
                "id": "6822eeeded32000001e25ab0"
            },
            {
                "name": "nectr",
                "id": "69380ea9945fd90001ca9e58"
            },
            {
                "name": "Premium Produce",
                "id": "6a950ffd114a1800015f6043"
            },
            {
                "name": "Exotic Fruits",
                "id": "6822eeeded32000001e25ab1"
            },
            {
                "name": "Cut Fruits and Juices",
                "id": "6822eeeded32000001e25ab2"
            },
            {
                "name": "Pooja & Festive",
                "id": "6822eeeded32000001e25ab3"
            },
            {
                "name": "Certified Organics",
                "id": "6822eeeded32000001e25ab6"
            },
            {
                "name": "Frozen Fruits",
                "id": "68b689ee4dd82b0001d869d1"
            },
            {
                "name": "Fresh Vegetables",
                "id": "6822eeeded32000001e25ab8"
            },
            {
                "name": "Bouquet & Plants",
                "id": "6822eeeded32000001e25ab4"
            },
            {
                "name": "Cuts and sprouts",
                "id": "6822eeeded32000001e25aba"
            }
        ]
    },
    "Dairy, Bread & Eggs": {
        "cName": "Dairy, Bread and Eggs",
        "tType": "Speciality taxonomy 1",
        "section": "Fresh",
        "subs": [
            {
                "name": "Milk",
                "id": "6822eeeded32000001e25abe"
            },
            {
                "name": "Bread and Buns",
                "id": "6822eeeded32000001e25abd"
            },
            {
                "name": "Paneer and Tofu",
                "id": "6822eeeded32000001e25ac2"
            },
            {
                "name": "Fresh Bakery",
                "id": "69e23025ed442900016e5d6f"
            },
            {
                "name": "Cheese",
                "id": "6822eeeded32000001e25ac3"
            },
            {
                "name": "Eggs",
                "id": "6822eeeded32000001e25abf"
            },
            {
                "name": "Top Deals",
                "id": "6966028b4f11730001f480a2"
            },
            {
                "name": "Curd and Yogurts",
                "id": "6822eeeded32000001e25ac0"
            },
            {
                "name": "Butter",
                "id": "6822eeeded32000001e25ac4"
            },
            {
                "name": "Batters and Chutneys",
                "id": "6822eeeded32000001e25ac5"
            },
            {
                "name": "Lassi and Buttermilk",
                "id": "6822eeeded32000001e25ac8"
            },
            {
                "name": "Indian Breads",
                "id": "6822eeeded32000001e25ac6"
            },
            {
                "name": "Cream and Condensed Milk",
                "id": "6970b6e9b6373a00010b3a9e"
            },
            {
                "name": "Dairy Alternatives",
                "id": "6822eeeded32000001e25ac7"
            },
            {
                "name": "Milkshakes and More",
                "id": "6822eeeded32000001e25ac9"
            }
        ]
    },
    "Meat & Seafood": {
        "cName": "Meat and Seafood",
        "tType": "Speciality taxonomy 1",
        "section": "Fresh",
        "subs": [
            {
                "name": "Fresh Chicken",
                "id": "6822eeeded32000001e25b3d"
            },
            {
                "name": "Fresh Seafood",
                "id": "6822eeeded32000001e25b3e"
            },
            {
                "name": "Fresh Mutton",
                "id": "6822eeeded32000001e25b3f"
            },
            {
                "name": "Top Deals",
                "id": "6a269334ff93a60001c16c42"
            },
            {
                "name": "Ready to Cook",
                "id": "692951068ff2590001fe7c7a"
            },
            {
                "name": "Meat Combos",
                "id": "6948edde195bc000019a3b03"
            },
            {
                "name": "Dry Fish",
                "id": "692951068ff2590001fe7c7b"
            },
            {
                "name": "Eggs",
                "id": "6822eeeded32000001e25b44"
            },
            {
                "name": "Frozen Food",
                "id": "6822eeeded32000001e25b42"
            },
            {
                "name": "Plant Based Meat",
                "id": "6822eeeded32000001e25b49"
            }
        ]
    },
    "Atta, Rice & Dal": {
        "cName": "Atta, Rice and Dal",
        "tType": "taxonomy 5",
        "section": "Grocery",
        "subs": [
            {
                "name": "Atta",
                "id": "6903b01ed2c61b000112ba2c"
            },
            {
                "name": "Rice",
                "id": "6903b01ed2c61b000112ba2d"
            },
            {
                "name": "Toor, Moong and Urad",
                "id": "6903b01ed2c61b000112ba31"
            },
            {
                "name": "High Protein Atta",
                "id": "6a105aa35f9ab700014de9e2"
            },
            {
                "name": "Top Deals",
                "id": "6a225b6a3c3eb20001d0f54f"
            },
            {
                "name": "Basmati Rice",
                "id": "6903b01ed2c61b000112ba2b"
            },
            {
                "name": "Besan, Sooji and Maida",
                "id": "6903b01ed2c61b000112ba2e"
            },
            {
                "name": "Rajma, Chola and Others",
                "id": "6903b01ed2c61b000112ba32"
            },
            {
                "name": "Poha & Puffed Rice",
                "id": "6903b01ed2c61b000112ba33"
            },
            {
                "name": "Premium Brands",
                "id": "6903b01ed2c61b000112ba2f"
            },
            {
                "name": "Soya Chunk & Badi",
                "id": "6903b01ed2c61b000112ba37"
            },
            {
                "name": "Other Flours",
                "id": "6903b01ed2c61b000112ba36"
            },
            {
                "name": "Millets & Daliya",
                "id": "6903b01ed2c61b000112ba35"
            },
            {
                "name": "Ready to Cook Flour Mix",
                "id": "6903b01ed2c61b000112ba34"
            }
        ]
    },
    "Masalas": {
        "cName": "Masalas",
        "tType": "taxonomy 5",
        "section": "Grocery",
        "subs": [
            {
                "name": "Powdered Spices",
                "id": "693ad23e53de7a00011ff894"
            },
            {
                "name": "Whole Spices",
                "id": "693ad23e53de7a00011ff898"
            },
            {
                "name": "Cold Grind",
                "id": "6a105aa35f9ab700014de9e3"
            },
            {
                "name": "Sugar and Jaggery",
                "id": "693ad23e53de7a00011ff897"
            },
            {
                "name": "Papad & Fryums",
                "id": "693a7ac953de7a00011ff892"
            },
            {
                "name": "Ready Masala",
                "id": "693ad23e53de7a00011ff895"
            },
            {
                "name": "Salt",
                "id": "693ad23e53de7a00011ff896"
            },
            {
                "name": "Paste and Puree",
                "id": "693a9dc1eb607300012621a5"
            },
            {
                "name": "Pickles & Chutney",
                "id": "693ad23e53de7a00011ff893"
            },
            {
                "name": "Herbs & Seasoning",
                "id": "693a7ac953de7a00011ff890"
            },
            {
                "name": "Coconut Milk & Powder",
                "id": "693981bf64f19a0001f8a5b3"
            },
            {
                "name": "Top Deals",
                "id": "6a225b6a3c3eb20001d0f550"
            }
        ]
    },
    "Oils & Ghee": {
        "cName": "Oils and Ghee",
        "tType": "taxonomy 5",
        "section": "Grocery",
        "subs": [
            {
                "name": "Sunflower & Other Oils",
                "id": "69394956ed899c0001b1aed8"
            },
            {
                "name": "Mustard Oils",
                "id": "69392fc99bd17b000135e3bd"
            },
            {
                "name": "Cold Pressed",
                "id": "6a105aa35f9ab700014de9e4"
            },
            {
                "name": "Ghee",
                "id": "69392fc99bd17b000135e3bb"
            },
            {
                "name": "Top Deals",
                "id": "6a225b6a3c3eb20001d0f551"
            },
            {
                "name": "Soyabean Oils",
                "id": "69394956ed899c0001b1aed7"
            },
            {
                "name": "Rice Bran Oils",
                "id": "69394956ed899c0001b1aed6"
            },
            {
                "name": "Sunflower Oils",
                "id": "69394956ed899c0001b1aed9"
            },
            {
                "name": "Blended Oils",
                "id": "69392fc99bd17b000135e3b9"
            },
            {
                "name": "Cold-pressed Oils",
                "id": "69392fc99bd17b000135e3ba"
            },
            {
                "name": "Olive Oils",
                "id": "69394956ed899c0001b1aed4"
            },
            {
                "name": "Premium Brands",
                "id": "69394956ed899c0001b1aed5"
            }
        ]
    },
    "Cereals & Breakfast": {
        "cName": "Cereals and Breakfast",
        "tType": "taxonomy 5",
        "section": "Grocery",
        "subs": [
            {
                "name": "Oats",
                "id": "69492faa195bc000019a3b0b"
            },
            {
                "name": "Energy Bars",
                "id": "69492faa195bc000019a3b10"
            },
            {
                "name": "Muesli & Granola",
                "id": "69492faa195bc000019a3b0a"
            },
            {
                "name": "High protein oats & museli",
                "id": "698d7038c63f8300011b530c"
            },
            {
                "name": "Regional Favourites",
                "id": "69492faa195bc000019a3b0e"
            },
            {
                "name": "Ready Mixes",
                "id": "69492faa195bc000019a3b11"
            },
            {
                "name": "Kids Cereals",
                "id": "69492faa195bc000019a3b0c"
            },
            {
                "name": "Flakes",
                "id": "69492faa195bc000019a3b0d"
            },
            {
                "name": "Batters",
                "id": "69492faa195bc000019a3b1c"
            },
            {
                "name": "Pancake Mixes",
                "id": "69492faa195bc000019a3b13"
            },
            {
                "name": "Peanut Butters",
                "id": "69492faa195bc000019a3b14"
            },
            {
                "name": "Chocolate Spreads",
                "id": "69492faa195bc000019a3b15"
            },
            {
                "name": "Masala Oats",
                "id": "698499a8e171b800015b5d68"
            },
            {
                "name": "Jams",
                "id": "69492faa195bc000019a3b1b"
            },
            {
                "name": "Juices & Fruit Drinks",
                "id": "69492faa195bc000019a3b1a"
            },
            {
                "name": "Mayo & Spreads",
                "id": "69492faa195bc000019a3b16"
            },
            {
                "name": "Hot Beverages",
                "id": "69492faa195bc000019a3b19"
            },
            {
                "name": "Seeds and trail Mixes",
                "id": "69492faa195bc000019a3b18"
            },
            {
                "name": "Crazy Deals",
                "id": "69492faa195bc000019a3b09"
            }
        ]
    },
    "Cold Drinks & Juices": {
        "cName": "Cold Drinks and Juices",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Soft Drinks",
                "id": "6903b0c295d8230001064c75"
            },
            {
                "name": "Juices and Fruit Drinks",
                "id": "6903b0c295d8230001064c76"
            },
            {
                "name": "Caffeinated Beverages",
                "id": "6903b0c295d8230001064c77"
            },
            {
                "name": "Hydration Drinks",
                "id": "6a6b063ad570db00013754da"
            },
            {
                "name": "Mango Drinks",
                "id": "6903b0c295d8230001064c7f"
            },
            {
                "name": "Coconut Water",
                "id": "6903b0c295d8230001064c80"
            },
            {
                "name": "Water and Ice Cubes",
                "id": "6903b0c295d8230001064c7d"
            },
            {
                "name": "Soda and Mixers",
                "id": "6903b0c295d8230001064c78"
            },
            {
                "name": "Ice Tea & Kombucha",
                "id": "6903b0c295d8230001064c7c"
            },
            {
                "name": "Diet Soft Drinks",
                "id": "6903b0c295d8230001064c7e"
            },
            {
                "name": "Non Alcoholic Beverages",
                "id": "6903b0c295d8230001064c7b"
            },
            {
                "name": "Chilled",
                "id": "692eadd0910d9f000100c2c0"
            },
            {
                "name": "Party Packs",
                "id": "69a17c7d5011b80001ede83c"
            },
            {
                "name": "Hydration",
                "id": "6903b0c295d8230001064c82"
            },
            {
                "name": "Fresh Juices",
                "id": "6903b0c295d8230001064c81"
            },
            {
                "name": "Instant Drink Mixes",
                "id": "6903b0c295d8230001064c83"
            },
            {
                "name": "Regional Favourites",
                "id": "6903b0c295d8230001064c79"
            },
            {
                "name": "Cold Coffee",
                "id": "6903b0c295d8230001064c85"
            },
            {
                "name": "Milk Based Drinks",
                "id": "6903b0c295d8230001064c84"
            }
        ]
    },
    "Ice Creams & Desserts": {
        "cName": "Ice Creams and Frozen Desserts",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Tubs & Party Packs",
                "id": "6903b0c295d8230001064c89"
            },
            {
                "name": "Cones",
                "id": "6903b0c295d8230001064c8a"
            },
            {
                "name": "Sticks",
                "id": "6903b0c295d8230001064c8b"
            },
            {
                "name": "Top Deals",
                "id": "6a5638416009fa0001dce711"
            },
            {
                "name": "Cups",
                "id": "6903b0c295d8230001064c91"
            },
            {
                "name": "Guiltfree",
                "id": "6903b0c295d8230001064c8d"
            },
            {
                "name": "Real Fruit",
                "id": "69b94cf4b6373a00010b3b3b"
            },
            {
                "name": "Gourmet",
                "id": "6903b0c295d8230001064c8c"
            },
            {
                "name": "Kulfi",
                "id": "6903b0c295d8230001064c8f"
            },
            {
                "name": "Cakes & Sandwiches",
                "id": "6903b0c295d8230001064c92"
            },
            {
                "name": "Rare Finds",
                "id": "6903b0c295d8230001064c88"
            },
            {
                "name": "Premium",
                "id": "6903b0c295d8230001064c90"
            },
            {
                "name": "Regional Favorites",
                "id": "6903b0c295d8230001064c93"
            },
            {
                "name": "Brownies & Cakes",
                "id": "6903b0c295d8230001064c94"
            },
            {
                "name": "Syrups",
                "id": "6903b0c295d8230001064c95"
            }
        ]
    },
    "Chips & Namkeens": {
        "cName": "Chips and Namkeens",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Chips and Crisps",
                "id": "6903b0c295d8230001064c99"
            },
            {
                "name": "Bhujia and Namkeens",
                "id": "6903b0c295d8230001064c9d"
            },
            {
                "name": "Palm Oil Free",
                "id": "6a1024275f9ab700014de9df"
            },
            {
                "name": "Indian Snacks",
                "id": "6903b0c295d8230001064c9e"
            },
            {
                "name": "Baked and Roasted",
                "id": "6a1024275f9ab700014de9e0"
            },
            {
                "name": "Nuts",
                "id": "6903b0c295d8230001064ca0"
            },
            {
                "name": "Puffs and Crunchies",
                "id": "6903b0c295d8230001064c9b"
            },
            {
                "name": "Makhana & Dry Fruits",
                "id": "6903b0c295d8230001064c9f"
            },
            {
                "name": "Healthy Snacking",
                "id": "6903b0c295d8230001064ca3"
            },
            {
                "name": "Nachos",
                "id": "6903b0c295d8230001064c9a"
            },
            {
                "name": "Popcorn",
                "id": "6903b0c295d8230001064ca1"
            },
            {
                "name": "Fasting Snacks",
                "id": "699428c05011b80001ede81d"
            },
            {
                "name": "Regional Favourites",
                "id": "6903b0c295d8230001064c9c"
            },
            {
                "name": "Party Packs",
                "id": "6903b0c295d8230001064ca6"
            },
            {
                "name": "Gift Hampers",
                "id": "6903b0c295d8230001064ca2"
            },
            {
                "name": "Sweet Treats",
                "id": "6903b0c295d8230001064ca7"
            }
        ]
    },
    "Chocolates": {
        "cName": "Chocolates",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Milk Chocolates",
                "id": "693d17b2c0e8870001d2d8fd"
            },
            {
                "name": "Dark Chocolates",
                "id": "693d17b2c0e8870001d2d8f8"
            },
            {
                "name": "Premium",
                "id": "693d1c2031a0de00019cd18b"
            },
            {
                "name": "Gift Boxes",
                "id": "693d17b2c0e8870001d2d8f9"
            },
            {
                "name": "Top Deals",
                "id": "6a5638416009fa0001dce712"
            },
            {
                "name": "Shared Packs",
                "id": "693d448b31a0de00019cd18c"
            },
            {
                "name": "Wafers",
                "id": "693d82725485ff0001d3ec20"
            },
            {
                "name": "Kunafa Chocolate",
                "id": "69c2674fb2f6170001b1dd3e"
            },
            {
                "name": "Gourmet collection",
                "id": "693d17b2c0e8870001d2d8fa"
            },
            {
                "name": "Candies & More",
                "id": "693d17b2c0e8870001d2d8f7"
            },
            {
                "name": "Gums & Mint",
                "id": "693d17b2c0e8870001d2d8fb"
            }
        ]
    },
    "Biscuits & Cakes": {
        "cName": "Biscuits and Cakes",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Cakes & Pies",
                "id": "693c23bd4df316000117b882"
            },
            {
                "name": "Cream Biscuits",
                "id": "693c23bd4df316000117b885"
            },
            {
                "name": "Cookies",
                "id": "693c23bd4df316000117b884"
            },
            {
                "name": "Marie & Digestive",
                "id": "693c23bd4df316000117b88b"
            },
            {
                "name": "Salted & Plain",
                "id": "693c23bd4df316000117b890"
            },
            {
                "name": "Wafers",
                "id": "693c23bd4df316000117b892"
            },
            {
                "name": "Regional Favourites",
                "id": "693c23bd4df316000117b88e"
            },
            {
                "name": "Healthy Snacking",
                "id": "693c23bd4df316000117b88a"
            },
            {
                "name": "Gift Boxes",
                "id": "693c23bd4df316000117b888"
            },
            {
                "name": "Baking Ingredients",
                "id": "693c23bd4df316000117b881"
            },
            {
                "name": "Gourmet collection",
                "id": "693c23bd4df316000117b889"
            },
            {
                "name": "Pancake Mixes",
                "id": "693c23bd4df316000117b88d"
            },
            {
                "name": "Fresh Bakery",
                "id": "69e23de6e473890001fbb7c7"
            },
            {
                "name": "Rusk",
                "id": "693c23bd4df316000117b88f"
            },
            {
                "name": "Dessert Mixes",
                "id": "693c23bd4df316000117b886"
            }
        ]
    },
    "Tea, Coffee & Drinks": {
        "cName": "Tea, Coffee and Milk drinks",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Tea",
                "id": "6903b0c295d8230001064cfa"
            },
            {
                "name": "Instant Coffee",
                "id": "6903b0c295d8230001064cfb"
            },
            {
                "name": "Filter & Ground Coffee",
                "id": "6903b0c295d8230001064cfc"
            },
            {
                "name": "Drink Mixes",
                "id": "6903b0c295d8230001064d01"
            },
            {
                "name": "Green & Herbal Tea",
                "id": "6903b0c295d8230001064cfd"
            },
            {
                "name": "Cold Coffee",
                "id": "6903b0c295d8230001064d00"
            },
            {
                "name": "Regional Favourites",
                "id": "6903b0c295d8230001064cfe"
            },
            {
                "name": "Syrups & Mixes",
                "id": "69b17a805011b80001ede85d"
            },
            {
                "name": "Milkshake & Smoothie",
                "id": "6903b0c295d8230001064d04"
            },
            {
                "name": "Cookies and Rusks",
                "id": "6903b0c295d8230001064d07"
            },
            {
                "name": "Premixes",
                "id": "6903b0c295d8230001064d06"
            },
            {
                "name": "Adult Nutrition",
                "id": "6903b0c295d8230001064d03"
            },
            {
                "name": "Top Deals",
                "id": "69662b2901da4f00010080db"
            },
            {
                "name": "Imported",
                "id": "696e372795eb7700017f9a2b"
            }
        ]
    },
    "Sauces & Spreads": {
        "cName": "Sauces and Spreads",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Chocolate Spreads",
                "id": "6903b0c295d8230001064ced"
            },
            {
                "name": "Tomato Ketchup",
                "id": "6903b0c295d8230001064cf0"
            },
            {
                "name": "Peanut Butters",
                "id": "6903b0c295d8230001064cec"
            },
            {
                "name": "Jams",
                "id": "6903b0c295d8230001064cf7"
            },
            {
                "name": "Mayo & Spreads",
                "id": "6903b0c295d8230001064cef"
            },
            {
                "name": "Dips & Dressing",
                "id": "6903b0c295d8230001064cf6"
            },
            {
                "name": "Cooking Sauces",
                "id": "6903b0c295d8230001064cf4"
            },
            {
                "name": "Asian Sauces",
                "id": "6903b0c295d8230001064cf3"
            },
            {
                "name": "Honey and Cider Vineger",
                "id": "6903b0c295d8230001064cee"
            },
            {
                "name": "Regional Favourites",
                "id": "6903b0c295d8230001064cf1"
            }
        ]
    },
    "Sweet Corner": {
        "cName": "Sweet Corner",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Kaju Katli & Barfi",
                "id": "693f772b01a77200013e2a09"
            },
            {
                "name": "Cakes and Pies",
                "id": "693f772b01a77200013e2a0e"
            },
            {
                "name": "Gulab Jamun",
                "id": "693f772b01a77200013e2a0c"
            },
            {
                "name": "Top Deals",
                "id": "6a5638416009fa0001dce713"
            },
            {
                "name": "Cream Biscuits",
                "id": "69eb43c5a51c5400018ac258"
            },
            {
                "name": "Mysore Pak",
                "id": "693f772b01a77200013e2a10"
            },
            {
                "name": "Chocofills",
                "id": "69eb43c5a51c5400018ac259"
            },
            {
                "name": "Ladoos",
                "id": "693f772b01a77200013e2a11"
            },
            {
                "name": "Pedhas",
                "id": "693f772b01a77200013e2a12"
            },
            {
                "name": "Rasgulla",
                "id": "693f772b01a77200013e2a0b"
            },
            {
                "name": "Dry Fruit Sweets",
                "id": "693f772b01a77200013e2a0a"
            },
            {
                "name": "Chikki",
                "id": "693fab2c01a77200013e2a13"
            },
            {
                "name": "Rasmalai",
                "id": "693fab2c01a77200013e2a14"
            },
            {
                "name": "Gulkand & Paan",
                "id": "693fab2c01a77200013e2a15"
            },
            {
                "name": "Dessert Mixes",
                "id": "693f772b01a77200013e2a0d"
            }
        ]
    },
    "Noodles, Pasta & Vermicelli": {
        "cName": "Noodles, Pasta, Vermicelli",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Instant Noodles",
                "id": "693f772b01a77200013e29fc"
            },
            {
                "name": "Korean Noodles",
                "id": "693f772b01a77200013e29fe"
            },
            {
                "name": "Cup Noodles",
                "id": "693f772b01a77200013e29fd"
            },
            {
                "name": "Instant Pasta",
                "id": "693f772b01a77200013e2a02"
            },
            {
                "name": "Vermicelli",
                "id": "693f772b01a77200013e2a03"
            },
            {
                "name": "Cooking Pasta",
                "id": "693f772b01a77200013e2a01"
            },
            {
                "name": "Hakka Noodles",
                "id": "693f772b01a77200013e29ff"
            },
            {
                "name": "Ready to eat",
                "id": "693f772b01a77200013e2a05"
            },
            {
                "name": "Soups",
                "id": "693f772b01a77200013e2a04"
            }
        ]
    },
    "Frozen Food": {
        "cName": "Frozen Food",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Veg Frozen Snacks",
                "id": "693d82725485ff0001d3ec2e"
            },
            {
                "name": "Non Veg Frozen Snacks",
                "id": "693d82725485ff0001d3ec29"
            },
            {
                "name": "Cold Cuts",
                "id": "693d82725485ff0001d3ec23"
            },
            {
                "name": "Frozen Vegetables",
                "id": "693d82725485ff0001d3ec24"
            },
            {
                "name": "Momos & Baos",
                "id": "693d82725485ff0001d3ec27"
            },
            {
                "name": "Kebabs",
                "id": "693d82725485ff0001d3ec26"
            },
            {
                "name": "Roti, Paranthas & Sheets",
                "id": "693d82725485ff0001d3ec2c"
            },
            {
                "name": "Seafood",
                "id": "693d82725485ff0001d3ec2d"
            },
            {
                "name": "Raw Frozen",
                "id": "693d82725485ff0001d3ec2a"
            },
            {
                "name": "Regional Favourites",
                "id": "693d82725485ff0001d3ec2b"
            }
        ]
    },
    "Dry Fruits & Seeds Mix": {
        "cName": "Dry Fruits and Seeds Mix",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Dryfruits Gift Boxes",
                "id": "6a8ff3fb479ae600017590a6"
            },
            {
                "name": "Cashews",
                "id": "69492e33cfaac00001f0780f"
            },
            {
                "name": "Mixed Dry Fruits",
                "id": "6949160474f4c20001b6bdff"
            },
            {
                "name": "Almonds",
                "id": "6949160474f4c20001b6be00"
            },
            {
                "name": "Dates",
                "id": "69492e33cfaac00001f07810"
            },
            {
                "name": "Top Deals",
                "id": "6a22540b25164200017a8659"
            },
            {
                "name": "Pista & Walnuts",
                "id": "69492e33cfaac00001f07812"
            },
            {
                "name": "Makhana and Seeds",
                "id": "69492e33cfaac00001f07813"
            },
            {
                "name": "Nuts and Seeds Mix",
                "id": "69492e33cfaac00001f07815"
            },
            {
                "name": "Dried Fruits and Berries",
                "id": "69492e33cfaac00001f07814"
            },
            {
                "name": "Premium dry Fruits",
                "id": "6970b51fb9ed3d00010081ee"
            }
        ]
    },
    "Paan Corner": {
        "cName": "Paan Corner",
        "tType": "taxonomy 10",
        "section": "Snacks",
        "subs": [
            {
                "name": "Regular Cigarettes",
                "id": "6903b0c295d8230001064cdf"
            },
            {
                "name": "Rolling Tobacco",
                "id": "6a1024275f9ab700014de9e1"
            },
            {
                "name": "Lighters",
                "id": "6985e16a35d7fd0001bf0db7"
            },
            {
                "name": "Flavour Cigarettes",
                "id": "6903b0c295d8230001064ce0"
            },
            {
                "name": "Ashtray",
                "id": "6985e16a35d7fd0001bf0db8"
            },
            {
                "name": "Smoking Accessories",
                "id": "6903b0c295d8230001064ce1"
            },
            {
                "name": "Hookah Needs",
                "id": "6903b0c295d8230001064ce2"
            },
            {
                "name": "Nicotine Alternatives",
                "id": "6903b0c295d8230001064ce3"
            },
            {
                "name": "Gum and Mint",
                "id": "6903b0c295d8230001064ce5"
            },
            {
                "name": "Paan and Mouth Fresheners",
                "id": "6903b0c295d8230001064ce7"
            }
        ]
    },
    "Bath & Body": {
        "cName": "Bath and Body",
        "tType": "taxonomy 14",
        "section": "Beauty",
        "subs": [
            {
                "name": "Soaps",
                "id": "6903b10bd2c61b000112ba93"
            },
            {
                "name": "Shower gel",
                "id": "6903b10bd2c61b000112baa4"
            },
            {
                "name": "Oral care",
                "id": "6903b10bd2c61b000112baa0"
            },
            {
                "name": "Handwash",
                "id": "6903b10bd2c61b000112ba94"
            },
            {
                "name": "Fragrance & Talc",
                "id": "6903b10bd2c61b000112ba9c"
            },
            {
                "name": "Value Pack",
                "id": "6aa954d1114a1800015f6063"
            },
            {
                "name": "Body Lotion & Oils",
                "id": "6903b10bd2c61b000112ba9b"
            },
            {
                "name": "Mens Perfume",
                "id": "6903b10bd2c61b000112ba9e"
            },
            {
                "name": "Womens Perfume",
                "id": "6903b10bd2c61b000112baa7"
            },
            {
                "name": "Shaving Foam and Cartridges",
                "id": "6903b10bd2c61b000112baa3"
            },
            {
                "name": "Shaving brush and Kit",
                "id": "6903b10bd2c61b000112baa2"
            },
            {
                "name": "Shampoo",
                "id": "6903b10bd2c61b000112ba96"
            },
            {
                "name": "Conditioner",
                "id": "6903b10bd2c61b000112ba97"
            },
            {
                "name": "Face Care",
                "id": "6903b10bd2c61b000112ba95"
            },
            {
                "name": "Bath Accessories",
                "id": "6903b10bd2c61b000112ba98"
            },
            {
                "name": "Bath & Beauty gifts",
                "id": "6903b10bd2c61b000112ba9a"
            },
            {
                "name": "Men Trimmers & Razors",
                "id": "6903b10bd2c61b000112baa9"
            },
            {
                "name": "Mens Deos",
                "id": "6903b10bd2c61b000112ba9d"
            },
            {
                "name": "Womens Deos",
                "id": "6903b10bd2c61b000112baa6"
            },
            {
                "name": "Women Hair Removal cream",
                "id": "6903b10bd2c61b000112baa5"
            },
            {
                "name": "Roll on",
                "id": "6903b10bd2c61b000112baa1"
            },
            {
                "name": "Women Trimmers & Razors",
                "id": "6903b10bd2c61b000112baa8"
            },
            {
                "name": "Lip care",
                "id": "6903b10bd2c61b000112baaa"
            },
            {
                "name": "Multi groomers",
                "id": "6903b10bd2c61b000112ba9f"
            },
            {
                "name": "After Shave",
                "id": "6903b10bd2c61b000112ba99"
            }
        ]
    },
    "Hair Care": {
        "cName": "Hair Care",
        "tType": "taxonomy 14",
        "section": "Beauty",
        "subs": [
            {
                "name": "Hair Oils and Serums",
                "id": "6903b10bd2c61b000112baad"
            },
            {
                "name": "Shampoo",
                "id": "6903b10bd2c61b000112baae"
            },
            {
                "name": "Conditioners & Masks",
                "id": "6903b10bd2c61b000112baaf"
            },
            {
                "name": "Hair Colour",
                "id": "6903b10bd2c61b000112bab0"
            },
            {
                "name": "Premium Brands",
                "id": "6903b10bd2c61b000112bab1"
            },
            {
                "name": "Hair Styling Gels & Creams",
                "id": "6903b10bd2c61b000112bab3"
            },
            {
                "name": "Combs & Brushes",
                "id": "6903b10bd2c61b000112bab4"
            },
            {
                "name": "Hair Dryers and Stylers",
                "id": "6903b10bd2c61b000112bab5"
            },
            {
                "name": "Hair Supplements",
                "id": "6903b10bd2c61b000112bab6"
            }
        ]
    },
    "Skincare": {
        "cName": "Skincare",
        "tType": "taxonomy 14",
        "section": "Beauty",
        "subs": [
            {
                "name": "Face wash and scrubs",
                "id": "6903b10bd2c61b000112bab8"
            },
            {
                "name": "Masks & Cleansers",
                "id": "6903b10bd2c61b000112bab9"
            },
            {
                "name": "Serums, Toners",
                "id": "6903b10bd2c61b000112baba"
            },
            {
                "name": "Creams & Moisturizers",
                "id": "6903b10bd2c61b000112babb"
            },
            {
                "name": "Sunscreen",
                "id": "6903b10bd2c61b000112babc"
            },
            {
                "name": "Body Lotions",
                "id": "6903b10bd2c61b000112babe"
            },
            {
                "name": "Beauty Supplements",
                "id": "6903b10bd2c61b000112babf"
            }
        ]
    },
    "Makeup": {
        "cName": "Makeup",
        "tType": "taxonomy 14",
        "section": "Beauty",
        "subs": [
            {
                "name": "Lips",
                "id": "6903b10bd2c61b000112bac2"
            },
            {
                "name": "Eyes",
                "id": "6903b10bd2c61b000112bac3"
            },
            {
                "name": "Face",
                "id": "6903b10bd2c61b000112bac5"
            },
            {
                "name": "Nails",
                "id": "6903b10bd2c61b000112bac7"
            },
            {
                "name": "Tools & Brushes",
                "id": "6903b10bd2c61b000112bac8"
            },
            {
                "name": "Beauty Supplements",
                "id": "6903b10bd2c61b000112bac9"
            }
        ]
    },
    "Feminine Hygiene": {
        "cName": "Feminine Hygiene",
        "tType": "taxonomy 14",
        "section": "Beauty",
        "subs": [
            {
                "name": "Sanitary Pads",
                "id": "6903b10bd2c61b000112bacc"
            },
            {
                "name": "Period Panties and Liners",
                "id": "6903b10bd2c61b000112bacd"
            },
            {
                "name": "Hair Removal",
                "id": "6903b10bd2c61b000112bace"
            },
            {
                "name": "Menstrual Cups and Tampons",
                "id": "6903b10bd2c61b000112bacf"
            },
            {
                "name": "Intimate Wipes and Wash",
                "id": "6903b10bd2c61b000112bad1"
            },
            {
                "name": "Disposal Bags and Cramp Relief",
                "id": "6903b10bd2c61b000112bad2"
            }
        ]
    },
    "Sexual Wellness": {
        "cName": "Sexual Wellness",
        "tType": "taxonomy 14",
        "section": "Beauty",
        "subs": [
            {
                "name": "Condoms",
                "id": "6903b10bd2c61b000112bad4"
            },
            {
                "name": "Lubricants",
                "id": "6903b10bd2c61b000112bad5"
            },
            {
                "name": "Massagers",
                "id": "6903b10bd2c61b000112bad6"
            },
            {
                "name": "Enhancers",
                "id": "6903b10bd2c61b000112bad7"
            },
            {
                "name": "Gift Kits",
                "id": "6903b10bd2c61b000112bad8"
            }
        ]
    },
    "Health & Pharma": {
        "cName": "Health and Pharma",
        "tType": "taxonomy 14",
        "section": "Beauty",
        "subs": [
            {
                "name": "Masks & Sanitizers",
                "id": "6a57570521b41f0001ef459d"
            },
            {
                "name": "Protein & Sports Nutrition",
                "id": "6a574e8421b41f0001ef459a"
            },
            {
                "name": "Immunity & Energy Boosters",
                "id": "6a57570521b41f0001ef459c"
            },
            {
                "name": "Gummies",
                "id": "6a57570521b41f0001ef459e"
            },
            {
                "name": "Weight Management",
                "id": "6a57570521b41f0001ef459b"
            },
            {
                "name": "Superfoods",
                "id": "6a57570521b41f0001ef459f"
            }
        ]
    },
    "Baby Care": {
        "cName": "Baby Care",
        "tType": "taxonomy 14",
        "section": "Beauty",
        "subs": [
            {
                "name": "Baby Diapers",
                "id": "6903b10bd2c61b000112baef"
            },
            {
                "name": "Baby Food and Formula",
                "id": "6903b10bd2c61b000112baf0"
            },
            {
                "name": "Baby Bathing",
                "id": "6903b10bd2c61b000112baf1"
            },
            {
                "name": "Baby Wipes",
                "id": "6903b10bd2c61b000112baf2"
            },
            {
                "name": "Baby Cream & Lotions",
                "id": "6903b10bd2c61b000112baf4"
            },
            {
                "name": "Gifts & More",
                "id": "6903b10bd2c61b000112bafc"
            },
            {
                "name": "Feeding and Teething Needs",
                "id": "6903b10bd2c61b000112baf8"
            },
            {
                "name": "Baby Oil and Talc",
                "id": "6903b10bd2c61b000112baf6"
            },
            {
                "name": "Baby Hygiene",
                "id": "6903b10bd2c61b000112bafa"
            },
            {
                "name": "Books and Toys",
                "id": "6903b10bd2c61b000112baf9"
            },
            {
                "name": "Baby Oral Care",
                "id": "6903b10bd2c61b000112baf5"
            },
            {
                "name": "Travel Needs & Baby Gears",
                "id": "6903b10bd2c61b000112bafe"
            },
            {
                "name": "Baby Pharma",
                "id": "6903b10bd2c61b000112baf7"
            },
            {
                "name": "Clothes & Accessories",
                "id": "6903b10bd2c61b000112bafb"
            },
            {
                "name": "Mom Care",
                "id": "6903b10bd2c61b000112bafd"
            }
        ]
    },
    "Home & Kitchen": {
        "cName": "Home and Kitchen",
        "tType": "IM Meatsy",
        "section": "Household",
        "subs": [
            {
                "name": "Non Toxic Cookware",
                "id": "69a6853c8ec23b0001d51dcb"
            },
            {
                "name": "Premium Storage Brands",
                "id": "6a107175f653f400014e56af"
            },
            {
                "name": "Home decor",
                "id": "6903b179fe6d7500013a0d13"
            },
            {
                "name": "304 Stainless Steel",
                "id": "6a107175f653f400014e56ae"
            },
            {
                "name": "Linen & Furnishing",
                "id": "6903b179fe6d7500013a0d14"
            },
            {
                "name": "Kitchen Tools",
                "id": "6903b179fe6d7500013a0d0c"
            },
            {
                "name": "Jars & Containers",
                "id": "6903b179fe6d7500013a0d09"
            },
            {
                "name": "Bottles, Flask and Tumblers",
                "id": "6903b179fe6d7500013a0d0a"
            },
            {
                "name": "Tiffins & Lunch Bag",
                "id": "6a27ff73600211000131660a"
            },
            {
                "name": "Bath and laundry",
                "id": "6903b179fe6d7500013a0d0e"
            },
            {
                "name": "Serveware & Crockery",
                "id": "6903b179fe6d7500013a0d16"
            },
            {
                "name": "Cookware",
                "id": "6903b179fe6d7500013a0d07"
            },
            {
                "name": "Tissues & Disposables",
                "id": "6903b179fe6d7500013a0d18"
            },
            {
                "name": "Home Utility",
                "id": "6a27ff73600211000131660b"
            },
            {
                "name": "Storage Organizers & Utility",
                "id": "6903b179fe6d7500013a0d17"
            },
            {
                "name": "cups and mugs",
                "id": "6903b179fe6d7500013a0d10"
            },
            {
                "name": "Gardening",
                "id": "6903b179fe6d7500013a0d11"
            },
            {
                "name": "Glasses & Barware",
                "id": "6903b179fe6d7500013a0d12"
            },
            {
                "name": "Air Freshners",
                "id": "6903b179fe6d7500013a0d0d"
            },
            {
                "name": "Bakeware & BBQ",
                "id": "6903b179fe6d7500013a0d0b"
            },
            {
                "name": "Vehicale care & Accessories",
                "id": "6903b179fe6d7500013a0d19"
            },
            {
                "name": "Party Planning",
                "id": "6903b179fe6d7500013a0d15"
            },
            {
                "name": "Cleaning tools",
                "id": "6903b179fe6d7500013a0d0f"
            }
        ]
    },
    "Puja Store": {
        "cName": "Puja Store",
        "tType": "IM Meatsy",
        "section": "Household",
        "subs": [
            {
                "name": "Idols & Books",
                "id": "6903b179fe6d7500013a0d1f"
            },
            {
                "name": "Diya & Baati",
                "id": "6903b179fe6d7500013a0d20"
            },
            {
                "name": "Agarbatti & Stand",
                "id": "6903b179fe6d7500013a0d21"
            },
            {
                "name": "Dhoop",
                "id": "6903b179fe6d7500013a0d22"
            },
            {
                "name": "Hawan Needs",
                "id": "6903b179fe6d7500013a0d23"
            },
            {
                "name": "Tika, Thread & Mala",
                "id": "6903b179fe6d7500013a0d24"
            },
            {
                "name": "Kalash & Gangajal",
                "id": "6903b179fe6d7500013a0d25"
            },
            {
                "name": "Camphor & Matchbox",
                "id": "6903b179fe6d7500013a0d26"
            },
            {
                "name": "Sambrani Cups",
                "id": "6903b179fe6d7500013a0d27"
            },
            {
                "name": "Flowers & Betel Leaves",
                "id": "6903b179fe6d7500013a0d28"
            },
            {
                "name": "Ghee & Oil",
                "id": "6903b179fe6d7500013a0d29"
            },
            {
                "name": "Puja Thali",
                "id": "6903b179fe6d7500013a0d2a"
            },
            {
                "name": "Puja Cloth",
                "id": "6903b179fe6d7500013a0d2b"
            },
            {
                "name": "Mandir Decor",
                "id": "6903b179fe6d7500013a0d2c"
            },
            {
                "name": "Fresh Fruits",
                "id": "6903b179fe6d7500013a0d2e"
            },
            {
                "name": "Dry Fruits",
                "id": "6903b179fe6d7500013a0d2f"
            },
            {
                "name": "Sweets",
                "id": "6903b179fe6d7500013a0d30"
            }
        ]
    },
    "Cleaners & Repellents": {
        "cName": "Cleaners and Repellents",
        "tType": "IM Meatsy",
        "section": "Household",
        "subs": [
            {
                "name": "Liquid Detergents",
                "id": "6903b179fe6d7500013a0d33"
            },
            {
                "name": "Repellent",
                "id": "6903b179fe6d7500013a0d42"
            },
            {
                "name": "Mosquito Refills",
                "id": "6903b179fe6d7500013a0d3e"
            },
            {
                "name": "Detergent Powders",
                "id": "6903b179fe6d7500013a0d32"
            },
            {
                "name": "Racquets",
                "id": "6903b179fe6d7500013a0d3f"
            },
            {
                "name": "Laundry Additives",
                "id": "6903b179fe6d7500013a0d3d"
            },
            {
                "name": "Cockroach & Crawling insect killer",
                "id": "6903b179fe6d7500013a0d3b"
            },
            {
                "name": "Tissues & Disposables",
                "id": "6a3a643a60f2a90001f51437"
            },
            {
                "name": "Dishwash Gel",
                "id": "6903b179fe6d7500013a0d3c"
            },
            {
                "name": "Toilet Cleaners",
                "id": "6903b179fe6d7500013a0d38"
            },
            {
                "name": "Mosquito Repellent",
                "id": "6903b179fe6d7500013a0d43"
            },
            {
                "name": "Surface Disinfectants",
                "id": "6903b179fe6d7500013a0d41"
            },
            {
                "name": "Top Deals",
                "id": "69706f26a176a40001054615"
            },
            {
                "name": "Rat Repellent",
                "id": "6903b179fe6d7500013a0d40"
            },
            {
                "name": "Brooms & Mops",
                "id": "6903b179fe6d7500013a0d34"
            },
            {
                "name": "Dustbins & Pans",
                "id": "6903b179fe6d7500013a0d36"
            },
            {
                "name": "Wipes & Scrubs",
                "id": "6903b179fe6d7500013a0d3a"
            },
            {
                "name": "Kitchen Cleaning",
                "id": "6903b179fe6d7500013a0d37"
            },
            {
                "name": "Bathroom Cleaning",
                "id": "6903b179fe6d7500013a0d39"
            },
            {
                "name": "Floor Cleaners",
                "id": "6903b179fe6d7500013a0d35"
            }
        ]
    },
    "Toys & Stationery": {
        "cName": "Toys and Stationery",
        "tType": "IM Meatsy",
        "section": "Household",
        "subs": [
            {
                "name": "Die-cast cars",
                "id": "69bcff6db56c7a0001b3e7a8"
            },
            {
                "name": "Safe play toys",
                "id": "69bcff6db56c7a0001b3e7a7"
            },
            {
                "name": "Screen Time Replacement",
                "id": "6a181a584ad6960001549a59"
            },
            {
                "name": "Pen,Pencils and markers",
                "id": "6903b179fe6d7500013a0d54"
            },
            {
                "name": "Toy cars and guns",
                "id": "6903b179fe6d7500013a0d47"
            },
            {
                "name": "Notebooks and Diaries",
                "id": "6903b179fe6d7500013a0d52"
            },
            {
                "name": "Card and Board Games",
                "id": "6903b179fe6d7500013a0d45"
            },
            {
                "name": "School supplies",
                "id": "6903b179fe6d7500013a0d55"
            },
            {
                "name": "Soft Toys",
                "id": "6903b179fe6d7500013a0d56"
            },
            {
                "name": "Office stationery",
                "id": "6903b179fe6d7500013a0d53"
            },
            {
                "name": "Dolls & pretend kits",
                "id": "6903b179fe6d7500013a0d51"
            },
            {
                "name": "Colouring Supplies",
                "id": "6903b179fe6d7500013a0d50"
            },
            {
                "name": "Action Figurines",
                "id": "6903b179fe6d7500013a0d4a"
            },
            {
                "name": "Building Blocks, Puzzles & More",
                "id": "6903b179fe6d7500013a0d48"
            },
            {
                "name": "Art & Craft",
                "id": "6903b179fe6d7500013a0d49"
            },
            {
                "name": "Baby & Musical toys",
                "id": "6903b179fe6d7500013a0d4d"
            },
            {
                "name": "Outdoor Toys",
                "id": "6903b179fe6d7500013a0d4b"
            },
            {
                "name": "Tiffin & Lunch boxes",
                "id": "6903b179fe6d7500013a0d57"
            },
            {
                "name": "STEM & Learning",
                "id": "6903b179fe6d7500013a0d46"
            },
            {
                "name": "Scooters and Ride ons",
                "id": "6903b179fe6d7500013a0d4c"
            },
            {
                "name": "Bags",
                "id": "6903b179fe6d7500013a0d4e"
            },
            {
                "name": "Books",
                "id": "6903b179fe6d7500013a0d4f"
            }
        ]
    },
    "Electronics & Appliances": {
        "cName": "Electronics and Appliances",
        "tType": "IM Meatsy",
        "section": "Household",
        "subs": [
            {
                "name": "Earphones & headsets",
                "id": "6903b179fe6d7500013a0d61"
            },
            {
                "name": "Mobiles",
                "id": "6903b179fe6d7500013a0d67"
            },
            {
                "name": "Kitchen Appliances",
                "id": "6903b179fe6d7500013a0d64"
            },
            {
                "name": "Speakers & Soundbars",
                "id": "6903b179fe6d7500013a0d6b"
            },
            {
                "name": "Laptops, Tablets and Monitors",
                "id": "6903b179fe6d7500013a0d65"
            },
            {
                "name": "Personal Care Appliances",
                "id": "69b7c133958236000180ec1d"
            },
            {
                "name": "Home Appliances",
                "id": "6903b179fe6d7500013a0d63"
            },
            {
                "name": "Powerbanks Chargers Cables",
                "id": "6903b179fe6d7500013a0d68"
            },
            {
                "name": "Smartwatches",
                "id": "6903b179fe6d7500013a0d6a"
            },
            {
                "name": "Health Care Appliances",
                "id": "6903b179fe6d7500013a0d62"
            },
            {
                "name": "Lights & Bulbs",
                "id": "6903b179fe6d7500013a0d66"
            },
            {
                "name": "Energy Saver Fans",
                "id": "69b92d8c91ebf20001c1496f"
            },
            {
                "name": "Batteries & Extensions",
                "id": "6903b179fe6d7500013a0d5f"
            },
            {
                "name": "Computer Accessories",
                "id": "6903b179fe6d7500013a0d60"
            },
            {
                "name": "Top Deals",
                "id": "69706f26a176a40001054616"
            },
            {
                "name": "Electric Kettles",
                "id": "6903b179fe6d7500013a0d5c"
            },
            {
                "name": "Smart & Streaming Devices",
                "id": "6903b179fe6d7500013a0d69"
            }
        ]
    },
    "Fashion": {
        "cName": "Fashion",
        "tType": "IM Meatsy",
        "section": "Household",
        "subs": [
            {
                "name": "Men's Innerwear",
                "id": "6903b179fe6d7500013a0d6d"
            },
            {
                "name": "Women's Innerwear",
                "id": "6903b179fe6d7500013a0d7d"
            },
            {
                "name": "T- Shirt",
                "id": "6903b179fe6d7500013a0d7c"
            },
            {
                "name": "Menswear",
                "id": "6903b179fe6d7500013a0d77"
            },
            {
                "name": "Womenswear",
                "id": "6903b179fe6d7500013a0d7b"
            },
            {
                "name": "Belts & Wallets",
                "id": "6903b179fe6d7500013a0d70"
            },
            {
                "name": "Footwear",
                "id": "6903b179fe6d7500013a0d7f"
            },
            {
                "name": "Watches",
                "id": "6903b179fe6d7500013a0d7e"
            },
            {
                "name": "Hair Accessories",
                "id": "6903b179fe6d7500013a0d73"
            },
            {
                "name": "Sunglasses",
                "id": "6903b179fe6d7500013a0d79"
            },
            {
                "name": "Chains & Necklace",
                "id": "6903b179fe6d7500013a0d71"
            },
            {
                "name": "Bangles & Bracelets",
                "id": "6903b179fe6d7500013a0d6f"
            },
            {
                "name": "Handbags & Purses",
                "id": "6903b179fe6d7500013a0d74"
            },
            {
                "name": "Earrings",
                "id": "6903b179fe6d7500013a0d72"
            },
            {
                "name": "Precious coins & Articles",
                "id": "6903b179fe6d7500013a0d78"
            },
            {
                "name": "Trolley & Backpacks",
                "id": "6903b179fe6d7500013a0d7a"
            },
            {
                "name": "Anklets, Rings & More",
                "id": "6903b179fe6d7500013a0d6e"
            },
            {
                "name": "Kids Accessories",
                "id": "6903b179fe6d7500013a0d75"
            },
            {
                "name": "Kidswear",
                "id": "6903b179fe6d7500013a0d76"
            }
        ]
    }
}
  }
var KEY='instamart_deal_hunter_v5_history',delay=function(ms){return new Promise(function(r){setTimeout(r,ms);});};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
var money=function(n){return '₹'+Number(n||0).toFixed(2);};
function getPod(){var sid='',sec='';function scan(x){if(!x)return;var t=String(x),a=t.match(/(?:primaryStoreId|storeId|primary_store_id|store_id)[=:]["']?(\d{4,})/i),b=t.match(/(?:secondaryStoreId|secondary_store_id)[=:]["']?(\d{4,})/i);if(a&&!sid)sid=a[1];if(b&&!sec)sec=b[1];}scan(location.href);try{performance.getEntries().slice(-250).reverse().forEach(function(e){scan(e.name);});}catch(e){}['__SWIGGY_GLOBAL__','__INITIAL_STATE__','__PRELOADED_STATE__'].forEach(function(k){try{scan(JSON.stringify(window[k]||''));}catch(e){}});try{[localStorage,sessionStorage].forEach(function(st){for(var i=0;i<st.length;i++)scan(st.getItem(st.key(i)));});}catch(e){}return sid?{sid:sid,pid:sid,secid:sec}:null;}
function collect(n,out,parent){if(!n||typeof n!=='object')return;var p={productId:n.productId||parent.productId,parentProductId:n.parentProductId||parent.parentProductId,displayName:n.displayName||parent.displayName};if(Array.isArray(n.variations))n.variations.forEach(function(v){out.push(Object.assign({},v,{_parent:p}));});else if(n.displayName&&(n.price||n.offerPrice))out.push(Object.assign({},n,{_parent:p}));else Object.keys(n).forEach(function(k){collect(n[k],out,p);});}
function amount(x){if(x&&typeof x==='object')x=x.units||x.value||x.amount;var n=parseFloat(String(x==null?'':x).replace(/,/g,''));return isFinite(n)?n:0;}
function packInfo(t){t=String(t||'').toLowerCase();var m=t.match(/(\d+(?:\.\d+)?)\s*(kg|g|gm|gms|grams?|l|ml|litres?|liters?)/i);if(!m)return null;var q=Number(m[1]),u=m[2].toLowerCase();if(u==='kg')return {base:q*1000,dim:'mass',label:'₹/kg'};if(['g','gm','gms','gram','grams'].indexOf(u)>=0)return {base:q,dim:'mass',label:'₹/kg'};if(['l','litre','litres','liter','liters'].indexOf(u)>=0)return {base:q*1000,dim:'volume',label:'₹/L'};return {base:q,dim:'volume',label:'₹/L'};}
var history={};try{history=JSON.parse(localStorage.getItem(KEY)||'{}');}catch(e){}
function normalize(v,cat,sub){if(v.inventory&&v.inventory.inStock===false)return null;var name=v.displayName;if(!name)return null;var price=amount(v.price&&v.price.offerPrice||v.offerPrice),mrp=amount(v.price&&v.price.mrp||v.mrp);if(!(price>0))return null;var key=String(v.skuId||v.spinId||v._parent.parentProductId||v.productId||name).toLowerCase(),pack=v.quantityDescription||'',measure=packInfo(pack),h=history[key]||{points:[]},prev=h.points.length?h.points[h.points.length-1]:null,drop=prev&&prev.price>price?(prev.price-price)*100/prev.price:0,pts=(h.points||[]).filter(function(p){return Date.now()-p.at<90*86400000;});if(!pts.length||pts[pts.length-1].price!==price)pts.push({price:price,at:Date.now()});history[key]={name:name,points:pts.slice(-40)};var image=v.imageIds&&v.imageIds[0]||v.imageId||'';return {key:key,name:name,brand:v.brandName||v.brand||'Unknown',pack:pack,price:price,mrp:mrp,discount:mrp>price?Math.round((mrp-price)*100/mrp):0,category:cat,subCategory:sub,unitPrice:measure?price*1000/measure.base:null,unitLabel:measure?measure.label:'',drop:drop,image:image?'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_360,h_360,c_fit/'+image:'',url:'https://www.swiggy.com/instamart/search?custom_back=true&query='+encodeURIComponent(name)};}
function rank(p){var score=0,reasons=[];if(p.drop>=20){score+=40;reasons.push('Price down '+p.drop.toFixed(0)+'% since last scan');}else if(p.drop>=8){score+=25;reasons.push('Recent price drop');}if(p.discount>=50){score+=15;reasons.push('High advertised discount');}if(p.discount===0){score+=10;reasons.push('No advertised discount');}if(p.unitPrice!==null){score+=8;reasons.push('Unit price available');}p.score=Math.min(100,score);p.reasons=reasons;p.kind=p.drop>=8?'PRICE DROP':p.discount>=40?'ADVERTISED DEAL':p.unitPrice!==null?'VALUE FIND':'UNADVERTISED';return p;}
var old=document.getElementById('instamart-hunter-v5');if(old)old.remove();
var root=document.createElement('div');root.id='instamart-hunter-v5';
root.innerHTML='<style>#instamart-hunter-v5{position:fixed;inset:0;z-index:2147483647;font:13px/1.45 system-ui;color:#172033}#instamart-hunter-v5 *{box-sizing:border-box}#idh5{position:absolute;inset:14px 14px 14px auto;width:min(1120px,calc(100vw - 28px));background:#f8fafc;border:1px solid #dbe3ee;border-radius:15px;box-shadow:0 18px 70px #0f172a55;display:flex;flex-direction:column;overflow:hidden}#idh5 header{background:#111827;color:white;padding:14px 18px;display:flex;justify-content:space-between}#idh5 header b{font-size:17px}#idh5 .controls{padding:12px;display:flex;gap:8px;flex-wrap:wrap;background:white}#idh5 input,#idh5 select{padding:9px;border:1px solid #cbd5e1;border-radius:8px;min-width:145px}#idh5 button{padding:9px 13px;border:0;border-radius:8px;background:#fc8019;color:white;font-weight:700;cursor:pointer}#idh5 button.alt{background:#e2e8f0;color:#172033}#idh5-status{padding:9px 13px;background:#f1f5f9;color:#475569}#idh5-results{padding:12px;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:10px}.idh5-card{background:white;border:1px solid #e2e8f0;border-radius:11px;padding:10px;display:flex;flex-direction:column;gap:5px;min-height:225px}.idh5-card img{width:100%;height:105px;object-fit:contain}.idh5-tag{font-size:10px;font-weight:800;color:#166534;background:#dcfce7;border-radius:5px;padding:3px 6px;align-self:flex-start}.idh5-price{font-size:17px;font-weight:800}.idh5-muted{color:#64748b;font-size:11px}.idh5-card a{margin-top:auto;color:#ea580c;font-weight:700;text-decoration:none}@media(max-width:600px){#idh5{inset:0;width:100%;border-radius:0}#idh5-results{grid-template-columns:repeat(2,minmax(0,1fr))}}</style><div id="idh5"><header><div><b>🛒 Instamart Deal Hunter V5</b><br><small>Hidden deals · Price intelligence · Value ranking</small></div><button id="idh5-close" class="alt">✕</button></header><div class="controls"><select id="idh5-cat"><option value="">Choose category</option></select><button id="idh5-all" class="alt">Select all aisles</button><button id="idh5-scan">Scan selected</button><input id="idh5-search" placeholder="Search products / brands"><select id="idh5-sort"><option value="score">Smart deal score</option><option value="unit">Lowest unit price</option><option value="drop">Price drop</option><option value="discount">Discount %</option><option value="price">Price low to high</option></select><button id="idh5-export" class="alt">Export CSV</button></div><div id="idh5-status">Detecting your active store…</div><div id="idh5-results"></div></div>';
document.body.appendChild(root);var $=function(id){return root.querySelector('#'+id);};$('idh5-close').onclick=function(){root.remove();};
var pod=getPod(),selected=[],items=[],cats=Object.entries(CFG.cats);cats.forEach(function(pair){var o=document.createElement('option');o.value=pair[0];o.textContent=pair[1].cName||pair[0];$('idh5-cat').appendChild(o);});
$('idh5-cat').onchange=function(){var c=CFG.cats[$('idh5-cat').value];selected=(c&&c.subs||[]).slice();$('idh5-status').textContent=selected.length+' aisles selected';};
$('idh5-all').onclick=function(){var c=CFG.cats[$('idh5-cat').value];selected=(c&&c.subs||[]).slice();$('idh5-status').textContent=selected.length+' aisles selected';};
function render(){var q=$('idh5-search').value.toLowerCase(),mode=$('idh5-sort').value,list=items.filter(function(p){return (p.name+' '+p.brand+' '+p.category+' '+p.subCategory).toLowerCase().indexOf(q)>=0;});list.sort(function(a,b){if(mode==='unit')return (a.unitPrice||Infinity)-(b.unitPrice||Infinity);if(mode==='drop')return b.drop-a.drop;if(mode==='discount')return b.discount-a.discount;if(mode==='price')return a.price-b.price;return b.score-a.score;});$('idh5-results').innerHTML=list.map(function(p){return '<div class="idh5-card"><span class="idh5-tag">'+esc(p.kind)+' · '+p.score+'/100</span>'+(p.image?'<img src="'+esc(p.image)+'">':'<div style="height:105px"></div>')+'<b>'+esc(p.name)+'</b><span class="idh5-muted">'+esc(p.brand)+' · '+esc(p.pack)+'</span><div class="idh5-price">'+money(p.price)+' <del class="idh5-muted">'+(p.mrp?money(p.mrp):'')+'</del></div><span class="idh5-muted">'+p.discount+'% off · '+(p.unitPrice!==null?money(p.unitPrice)+' '+p.unitLabel:'')+'</span><span class="idh5-muted">'+esc(p.reasons.join(' · '))+'</span><a target="_blank" rel="noopener" href="'+esc(p.url)+'">Find on Instamart ↗</a></div>';}).join('');}
$('idh5-search').oninput=render;$('idh5-sort').onchange=render;
async function api(url,method,body){var res=await fetch(url,{method:method,headers:{accept:'*/*','content-type':'application/json','x-build-version':window.__BUILD_VERSION__||'2.363.0','x-device-id':'instamart-deal-hunter-v5'},credentials:'include',body:body?JSON.stringify(body):undefined});if(res.status===429||res.status===403)throw new Error('Swiggy returned HTTP '+res.status+'. Scan stopped to respect rate limits.');if(!res.ok)return null;var j=await res.json();return j&&j.data?j:null;}
async function scan(){if(!location.hostname.endsWith('swiggy.com')){alert('Open swiggy.com/instamart first.');return;}if(!pod)pod=getPod();if(!pod){alert('Could not detect store pod. Open an Instamart category once and retry.');return;}if(!selected.length){alert('Choose a category first.');return;}items=[];var map=new Map(),cat=CFG.cats[$('idh5-cat').value];$('idh5-scan').disabled=true;try{for(var i=0;i<selected.length;i++){var sub=selected[i];$('idh5-status').textContent='Scanning '+(i+1)+'/'+selected.length+': '+sub.name+' · '+map.size+' products';var coll=!!(sub.isCollection||cat.campaignType==='collection'),method=coll||!sub.id?'GET':'POST',offset=0,page=0,more=true;while(more&&page<5){if(page>0)await delay(2400+Math.random()*800);var url,body=null;if(coll)url='/api/instamart/collection/items?collectionId='+sub.id+'&isMonetised=true&storeId='+pod.sid+'&primaryStoreId='+pod.pid+'&secondaryStoreId='+pod.secid+'&offset='+offset+'&serviceLine=INSTAMART';else if(sub.id){url='/api/instamart/category-listing/filter/v2?storeId='+pod.sid+'&primaryStoreId='+pod.pid+'&secondaryStoreId='+pod.secid+'&pageNo='+page+'&offset='+offset+'&page_name=category_listing_filter';body={categoryName:cat.cName,filterName:sub.name,filterId:sub.id,taxonomyType:cat.tType||'taxonomy 5',items_offset:String(offset),facets:[],sortAttribute:'discountPercentHighToLow'};}else url='/api/instamart/category-listing/v2?categoryName='+encodeURIComponent(cat.cName)+'&taxonomyType='+encodeURIComponent(cat.tType||'taxonomy 5')+'&offset='+offset+'&storeId='+pod.sid+'&primaryStoreId='+pod.pid+'&secondaryStoreId='+pod.secid;var json=await api(url,method,body);if(!json)break;var raw=[];collect(json.data,raw,{});raw.forEach(function(v){var p=normalize(v,cat.cName,sub.name);if(p){var old=map.get(p.key);if(!old||p.price<old.price)map.set(p.key,p);}});var next=json.data.pageOffset&&json.data.pageOffset.nextOffset;if(next!==undefined&&next!==null&&next!==''&&Number(next)>Number(offset)){offset=Number(next);page++;}else more=false;}await delay(2400+Math.random()*800);}items=Array.from(map.values()).map(rank);try{localStorage.setItem(KEY,JSON.stringify(history));}catch(e){}render();$('idh5-status').textContent='Complete: '+items.length+' unique products. Price history saved locally. '+(items.some(function(p){return p.drop>0;})?'Price changes detected.':'Keep scanning over time to build price history.');}catch(e){items=Array.from(map.values()).map(rank);render();$('idh5-status').textContent=e.message+' Partial results: '+items.length;}finally{$('idh5-scan').disabled=false;}}
$('idh5-scan').onclick=scan;
$('idh5-export').onclick=function(){var rows=[['Name','Brand','Pack','Price','MRP','Discount','Unit price','Score','Type','Category'],...items.map(function(p){return [p.name,p.brand,p.pack,p.price,p.mrp,p.discount,p.unitPrice||'',p.score,p.kind,p.category];})];var csv=rows.map(function(r){return r.map(function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='instamart-deals-v5.csv';a.click();URL.revokeObjectURL(a.href);};
$('idh5-status').textContent=pod?'Store pod detected: '+pod.sid+'. Choose a category to begin.':'Open an Instamart category once to detect your store pod.';
})();