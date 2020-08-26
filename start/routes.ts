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

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'MenuController.index')

Route.get('/api', 'ApiController.index')

Route.any('/api/image', 'ApiController.image')
Route.any('/api/text', 'ApiController.text')
Route.any('/api/json', 'ApiController.json')

Route.any('/debug/image', 'DebugController.image')
Route.any('/debug/fetch', 'DebugController.fetch')
Route.any('/debug/ocr', 'DebugController.ocr')
Route.any('/debug/parse', 'DebugController.parse')

