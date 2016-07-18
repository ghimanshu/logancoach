-- create supercategories
DELETE FROM supercategory WHERE superId > 2;

INSERT INTO supercategory VALUES
(3, "Exterior Trim"),
(4, "Trailer Structure"),
(5, "Undercarriage"),
(6, "Tack Rooms"),
(7, "Tack Room Features"),
(8, "Towing Features"),
(9, "Stall Area Features"),
(10, "Electrical"),
(11, "Trailer Accessories"),
(12, "Living Quarter - Cowboy Package"),
(13, "Living Quarter - Silver Package"),
(14, "Living Quarter - Platinum Package"),
(15, "Living Quarter - Ultra Package"),
(16, "Living Quarter - General Features");

UPDATE supercategory SET superName = "Main Options" where superId = 1;
UPDATE supercategory SET superName = "Living Quarters" where superId = 2;

-- Exterior Trim
UPDATE category set superCategoryId = 3 WHERE categoryName IN (
"Exterior Aluminum Painted Sheets Coverage Area",
"Aluminum Exterior Wall Slats (Bottom Half of Wall) Coverage Area",
"Front Wrap Trim",
"Graphics"
);

-- Trailer Structure
UPDATE category set superCategoryId = 4 WHERE categoryName IN (
"Box Height - Standard Using & Stock Trailers",
"Box Height - Living Quarter 6' to 15' Short Wall Pkgs",
"Box Height - Living Quarter 16' to  20' Short Wall Pkgs",
"Box Width - Standard Using & Stock Trailers",
"Box Width - Living Quarter Trailers"
);

-- Undercarriage
UPDATE category set superCategoryId = 5 WHERE categoryName IN (
  "Axles",
  "Axles - Living Quarter Trailers (6' & 8' Short Wall Pkgs)",
  "Axles - Living Quarter Trailers (9' - 15' Short Wall Pkgs)",
  "Axles - Living Quarter Trailers (16' - 20' Short Wall Pkgs)",
  "Axles (Trailing Arm Angle)",
  "Tires - 2H BP Trailers",
  "Tires - BP Trailers",
  "Tires - GN Trailers",
  "Tires - GN Living Quarter Trailers",
  "Tires - Heavy Duty Trailers",
  "Tires - Living Quarter Trailers 16' to 20' Short Wall Pkgs",
  "Wheels - 2H BP & GN Trailers",
  "Wheels - BP Trailers",
  "Wheels - 2H GN",
  "Wheels - GN Trailers",
  "Wheels - GN Living Quarter Trailers",
  "Wheels - Heavy Duty Trailers",
  "Wheels - Living Quarter Trailers 16' to 20' Short Wall Pkgs",
  "Brakes"
);

-- Tack Rooms
UPDATE category set superCategoryId = 6 WHERE categoryName IN (
  "Front Tack Dimensions - Standard Using Trailers",
  "Front Tack Dimensions - Stock Combo",
  "Rear Tack Room",
  "Rear Tack Room - 7'3\" Wide Living Quarter Trailers",
  "Rear Tack Room - 8'0\" Wide Living Quarter Trailers",
  "Side Tack - Standard Using Trailers",
  "Trainer's Tack - Standard Using Trailers",
  "Mid Tacks",
  "Mid Tacks - Living Quarter Trailers"
);

-- Tack Room Features
UPDATE category set superCategoryId = 7 WHERE categoryName IN (
  "Front Tack Room Doors - Standard Using Trailers",
  "Storage on Tack Doors",
  "Storage on Tack Doors - Full Rear Tack",
  "Blanket Racks",
  "Bridle Hooks - Tack Area",
  "Bridle Hooks - Full Rear Tack",
  "Saddle Racks",
  "Saddle Racks - Full Rear Tack",
  "Corner Shelves in Front Tack Room",
  "Corner Shelves in Tack Room - Rear Tack Rooms",
  "Mid Tack Overhead Shelves",
  "Panel & Insulate  - BP Tack Room WALL",
  "Panel & Insulate - BP Tack Room CEILINGS",
  "Panel & Insulate  - GN Tack Room WALLS",
  "Panel & Insulate - GN Tack Room CEILINGS",
  "Carpeted Tack Room",
  "Water Storage Accessories",
  "Aluminum Clothes Rods",
  "Aluminum Clothes Rod - Living Quarter Trailers",
  "Mattress - Standard Using Trailer",
  "Drop Down Cots",
  "Boot Box / Tack Trunk",
  "Hat Holders",
  "Screen Doors",
  "Vents - Tack / Dressing Room",
  "Air Conditioner",
  "Furnace",
  "Converter"
);

-- Towing Features
UPDATE category set superCategoryId = 8 WHERE categoryName IN (
  "Bumper Pull Jacks",
  "GN Jacks",
  "LQ Jacks - Living Quarter Trailers",
  "Tongues / GN Decks",
  "Coupler ",
  "GN Front Enclosures",
  "Fender Choices - Stockman Trailers"
);

-- Stall Area Features
UPDATE category set superCategoryId = 9 WHERE categoryName IN (
  "Flooring",
  "First Stall Width - Divider Pin Settings",
  "Second Stall Width - Divider Pin Settings",
  "Third Stall Width - Divider Pin Settings",
  "Fourth Stall Width - Divider Pin Settings",
  "Fifth Stall Width - Divider Pin Settings",
  "Sixth Stall Width - Divider Pin Settings",
  "Seventh Stall Width - Divider Pin Settings",
  "Eighth Stall Width - Divider Pin Settings",
  "First Divider",
  "Second Divider",
  "Third Divider",
  "Fourth Divider",
  "Fifth Divider",
  "Sixth Divider",
  "Seventh Divider",
  "Stockman Center Gate Placement",
  "Stockman Center Gates",
  "Stockman Divider Pin Setting",
  "Stock Combo First Divider",
  "Stock Combo Second Divider",
  "Stock Combo Third Divider",
  "Stock Combo Fourth Divider",
  "Stock Combo Fifth Divider",
  "Stock Combo Sixth Divider",
  "Stock Combo Seventh Divider",
  "Head Side Wall Door/Window Layout - ALL STALLS",
  "Plexiglass - Headside (Includes Both Air Gaps)",
  "Tail Side Wall - ALL STALLS",
  "Plexigass - Tailside (Includes Both Air Gaps)",
  "Tail Side Wall Door/Window Layout - First Stall",
  "Tail Side Wall Door/Window Layout - Second Stall",
  "Tail Side Wall Door/Window Layout - Third Stall",
  "Tail Side Wall Door/Window Layout - Fourth Stall",
  "Tail Side Wall Door/Window Layout - Fifth Stall",
  "Tail Side Wall Door/Window Layout - Sixth Stall",
  "Tail Side Wall Door/Window Layout - Seventh Stall",
  "Tail Side Wall Door/Window Layout - Eighth Stall",
  "Stall Entry Doors",
  "Stall Entry Doors - Living Quarter Trailers",
  "Stall Entry Doors - Stockman",
  "Stall Entry Doors - Full Rear Tack",
  "Rear Ramps",
  "Side Ramps",
  "Side Ramps - Full Rear Tack",
  "First Stall Escape Doors",
  "First Stall Escape Door - Living Quarter Trailers",
  "First Stall Feed Manger",
  "Second Stall Feed Manger",
  "Third Stall Feed Manger",
  "Fourth Stall Feed Manger",
  "Fifth Stall Feed Manger",
  "Sixth Stall Feed Manger",
  "Seventh Stall Feed Manger",
  "Eighth Stall Feed Manger",
  "First Stall Feed Manger - Living Quarter Trailers",
  "Second Stall Feed Manger - Living Quarter Trailers",
  "Third Stall Feed Manger - Living Quarter Trailers",
  "Fourth Stall Feed Manger - Living Quarter Trailers",
  "Fifth Stall Feed Manger - Living Quarter Trailers",
  "Sixth Stall Feed Manger - Living Quarter Trailers",
  "Seventh Stall Feed Manger - Living Quarter Trailers",
  "Eighth Stall Feed Manger - Living Quarter Trailers",
  "First Stall Locker - All Using Trailers",
  "Pass Through Door - Standard Using Trailers",
  "Pass Through Door - Living Quarter Trailers",
  "Pop Up Vents",
  "Pop-Up Vents - Stockman Trailers",
  "Breast Bar",
  "Butt Bar",
  "Stall Fan - Stall #1",
  "Stall Fan - Stall #2",
  "Stall Fan - Stall #3",
  "Stall Fan - Stall #4",
  "Stall Fan - Stall #5",
  "Stall Fan - Stall #6",
  "Stall Fan - Stall #7",
  "Kick Wall Pads",
  "Tie Straps (Stall Area)",
  "Tie Ring (Stall Area) - Slant Load Horse Trailers",
  "Tie Ring (Exterior) - Slant Load Horse Trailers",
  "Tie Ring (Stall Area) - Stockman Trailers",
  "Tie Ring (Exterior) - Stockman Trailers"
);

-- Electrical
UPDATE category set superCategoryId = 10 WHERE categoryName IN (
  "Lights - Tack Room",
  "Lights - Stall Area",
  "Lights - Driver Side Exterior Flood",
  "Lights - Passenger Side Exterior Flood",
  "Lights - Rear Gate Exterior Flood",
  "Lights - GN Deck Exterior Flood",
  "Lights - Marker",
  "Lights - Reverse / Backup",
  "Lights - Incandescent",
  "Lights - Fluorescent Lights",
  "Lights - Versa Brite Strip Lights",
  "Lights - 110 Volt Receptacle"
);

-- Trailer Accessories
UPDATE category set superCategoryId = 11 WHERE categoryName IN (
  "Hay Racks",
  "Roof Pods",
  "Generator Platforms",
  "Generator Platform - Living Quarter Trailers",
  "Ladders",
  "Grab Handle",
  "Propane Tank Brackets",
  "Tire Jack ",
  "Fold Up Step - 8'0\" Wide & 8'6\" Wide Models ONLY",
  "Shaving Fork",
  "Combination Locks",
  "Latches",
  "Hinges"
);

-- -- Living Quarter - Cowboy Package
-- UPDATE category set superCategoryId = 12 WHERE categoryName IN (
--
-- );
--
-- -- Living Quarter - Silver Package
-- UPDATE category set superCategoryId = 13 WHERE categoryName IN (
--
-- );
--
-- -- Living Quarter - Platinum Package
-- UPDATE category set superCategoryId = 14 WHERE categoryName IN (
--
-- );
--
-- -- Living Quarter - Ultra Package
-- UPDATE category set superCategoryId = 15 WHERE categoryName IN (
--
-- );
--
-- -- Living Quarter - General Feature
-- UPDATE category set superCategoryId = 16 WHERE categoryName IN (
--
-- );
