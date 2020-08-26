// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ApiController {
  public async index ({ view }) {
    return view.render('api')
  }
  public async text ({ params }) {
    return [{ id: 1, username: 'virk' }]
  }
  public async json ({ params }) {
    return [{ id: 1, username: 'virk' }]
  }
  public async image ({ params }) {
    return [{ id: 1, username: 'virk' }]
  }
}
