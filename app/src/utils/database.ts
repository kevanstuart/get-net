import pgPromise, { IHelpers } from 'pg-promise'

export const pgp = pgPromise({
  capSQL: true
})

const options = {
  host: 'db',
  port: 5432,
  database: 'whichisp',
  user: 'whichisp',
  password: 'whichisp',
}

export const database = pgp(options)
export const helpers: IHelpers = pgp.helpers