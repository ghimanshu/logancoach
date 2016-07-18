 -- exclusions
-- select count(*) from excludeitem where excluded in (select itemId from item where itemName = "Void");
delete from excludeitem where excluded in (select itemId from item where itemName = "Void");

-- estimates
-- select count(*) from estimates where itemid in (select itemId from item where itemName = "Void");
delete from estimates where itemid in (select itemId from item where itemName = "Void");

-- trailer config
-- select count(*) from itemcost where itemid in (select itemId from item where itemName = "Void") and standard = "false";
delete from itemcost where itemid in (select itemId from item where itemName = "Void") and standard = "false";

-- make Void not standard (by making none standard) so we can safely delete
-- select * from `itemcost` WHERE itemId in ( 9321, 10301, 15541, 16251, 18261, 22621, 25391, 25411, 25431, 25451, 27671, 29311 );
UPDATE `itemcost` SET `standard`="true" WHERE itemId in ( 9321, 10301, 15541, 16251, 18261, 22621, 25391, 25411, 25431, 25451, 27671, 29311 );

-- obtained from this query
-- select itemId from item where itemName = "None" and categoryId in (
--   select distinct category.categoryId
--   from item join category on item.categoryId = category.categoryId join itemcost on item.itemId = itemcost.itemId
--   where item.itemName = "Void" or item.itemName = "VOID" and categoryName <> "VOID" and standard = true
-- )

-- now that all of them are clean, start blowing out itemcost data
delete from itemcost where itemid in (select itemId from item where itemName = "Void");

-- items
-- select count(*) from item where itemName = "Void";
delete from item where itemName = "Void";

-- categories
-- select count(*) from category where categoryName = "Void";
delete from category where categoryName = "Void";
