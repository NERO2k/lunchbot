// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WebController {
  public async index ({ view }) {
    return view.render('menu')
  }
}
