import Sequelize from 'sequelize'
import log from './modules/log'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite'
})

class Subscriptions extends Sequelize.Model {}
Subscriptions.init(
  {
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

class Servers extends Sequelize.Model {}
Servers.init(
  {
    serverId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    channelId: {
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
    log('LOG', 'DB connection successfully established.')
    Subscriptions.sync({ force: false }).then(() => {
      log('LOG', 'Synced subscription model with database.')
    })
  })
  .catch(err => {
    log('ERROR', err, '#ff0000')
  })

export { Subscriptions, Servers }
