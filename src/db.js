import Sequelize from 'Sequelize'
import log from './modules/log'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite'
})

class Subscriptions extends Sequelize.Model {}
Subscriptions.init(
  {
    // attributes
    discordId: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'subscriptions'
  }
)

sequelize
  .authenticate()
  .then(() => {
    log('LOG', 'DB connection established successfully.')
    Subscriptions.sync({ force: false }).then(() => {
      log('LOG', 'Synced subscription model with database.')
    })
  })
  .catch(err => {
    log('ERROR', err, '#ff0000')
  })

export default Subscriptions
