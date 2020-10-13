/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", "WebController.index");
Route.get("/calendar", "WebController.calendar");

Route.get("/api", "ApiController.index");

Route.any("/api/image", "ApiController.image");
Route.any("/api/image/ocr", "ApiController.ocr_image");
Route.any("/api/text", "ApiController.text");
Route.any("/api/text/markdown", "ApiController.markdown_text");
Route.any("/api/text/html", "ApiController.html_text");
Route.any("/api/text/raw", "ApiController.raw_text");
Route.any("/api/embed", "ApiController.embed");
Route.any("/api/json", "ApiController.json");
Route.any("/api/data/menu/available", "DataController.menus_available");
Route.any("/api/data/menu/details", "DataController.menu_details");
Route.any("/api/data/stats", "DataController.statistics");


Route.any("/assistant", "AssistantController.call");

Route.any("/test/eatery_website", "TestController.eatery_website").middleware("dev");

Route.any("/debug/dump", "DebugController.dump").middleware("debug");

Route.any("/debug/image", "DebugController.image").middleware("debug");
Route.any("/debug/fetch", "DebugController.fetch").middleware("debug");
Route.any("/debug/ocr", "DebugController.ocr").middleware("debug");
Route.any("/debug/parse", "DebugController.parse").middleware("debug");

Route.any("/debug/add_user", "DebugController.add_user").middleware("debug");
Route.any("/debug/add_server", "DebugController.add_server").middleware("debug");

Route.any("/debug/process", "DebugController.process").middleware("debug");
Route.any(
  "/debug/regenerate_calendar",
  "DebugController.regenerate_calendar"
).middleware("debug");
