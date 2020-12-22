import { Plan, ConnectionType, PriceModel } from '../models/plan'
import { Provider } from '../models/provider'
import pgPromise from 'pg-promise'
import path from 'path'

const pg = pgPromise({
  capSQL: true
})

const options = {
  host: 'db',
  port: 5432,
  database: 'whichisp',
  user: 'whichisp',
  password: 'whichisp',
}

const database = pg(options)

const loadSql = (file: string) => {
  const full = path.join(__dirname, file)
  return new pg.QueryFile(full, { minify: true })
}

const schemaSql = loadSql('../schema.sql')
const clearSql = loadSql('../clear.sql')

database.query(clearSql)
  .then(async () => database.query(schemaSql))
  .then(async () => {
    await database.none(
      pg.helpers.insert(providerValues, providerColumns, 'providers')
    )

    await database.none(
      pg.helpers.insert(planValues, planColumns, 'plans-current')
    )

    await database.none(
      pg.helpers.insert(planValues, planColumns, 'plans'),
    )
  })
  .catch(e => {
    // eslint-disable-next-line no-console
    console.log(e)
  })

const providers: Provider[] = [
  {
    uuid: '149abeca-6724-4a6c-b8ba-14537eb71352',
    name: 'Ezecom',
    logo: new URL('http://localhost:3000/uploads/ezecom.png'),
    isDeleted: false
  },
  {
    uuid: 'b3f2b1a4-8c4b-40a8-818b-ac1f72bafaf0',
    name: 'Sinet',
    logo: new URL('http://localhost:3000/uploads/sinet.jpg'),
    isDeleted: false
  },
  {
    uuid: 'c78615e6-983d-4b7c-925d-58bec7eda58c',
    name: 'OpenNet',
    logo: new URL('http://localhost:3000/uploads/opennet.png'),
    isDeleted: false
  },
  {
    uuid: '135ae2a0-4b94-4acf-be04-37ceb3107450',
    name: 'SingMeng',
    logo: new URL('http://localhost:3000/uploads/singmeng.png'),
    isDeleted: false
  },
  {
    uuid: '9734fc3f-c934-4a06-ac33-9843dff0eec8',
    name: 'Kingtel',
    logo: new URL('http://localhost:3000/uploads/kingtel.png'),
    isDeleted: false
  }
]

const plans: Plan[] = [
  {
    uuid: 'b11f1616-f6a0-4704-ab2c-ebfa7bdc5750',
    name: 'EZECOM Corporate 1mbps',
    providerUuid: '149abeca-6724-4a6c-b8ba-14537eb71352',
    downloadSpeed: 1,
    uploadSpeed: 1,
    connection: ConnectionType.adsl,
    price: 40.00,
    priceModel: PriceModel.perMonth,
    link: new URL('https://www.ezecom.com.kh/our-services'),
    updated_time: new Date(),
    isDeleted: false
  },
  {
    uuid: '8fc6e655-c0f1-4c1c-bea5-1779a775e5c3',
    name: 'EZECOM Corporate 2mbps',
    providerUuid: '149abeca-6724-4a6c-b8ba-14537eb71352',
    downloadSpeed: 2,
    uploadSpeed: 2,
    connection: ConnectionType.adsl,
    price: 80.00,
    priceModel: PriceModel.perMonth,
    link: new URL('https://www.ezecom.com.kh/our-services'),
    updated_time: new Date(),
    isDeleted: false
  },
  {
    uuid: 'bef051ec-c23b-4307-b248-eb4c656dae41',
    name: 'Fiber Edge',
    providerUuid: 'b3f2b1a4-8c4b-40a8-818b-ac1f72bafaf0',
    downloadSpeed: 10,
    uploadSpeed: 10,
    connection: ConnectionType.fiber,
    price: 40.00,
    priceModel: PriceModel.perMonth,
    link: new URL('https://www.sinet.com.kh/internet-solution/fiber-edge/'),
    updated_time: new Date(),
    isDeleted: false
  },
  {
    uuid: 'aa5f2ff3-2fb8-4f60-9a7d-25574cfd21d9',
    name: 'Fiber Edge+',
    providerUuid: 'b3f2b1a4-8c4b-40a8-818b-ac1f72bafaf0',
    downloadSpeed: 10,
    uploadSpeed: 10,
    connection: ConnectionType.fiber,
    price: 50.00,
    priceModel: PriceModel.perMonth,
    link: new URL('https://www.sinet.com.kh/internet-solution/fiber-edge/'),
    updated_time: new Date(),
    isDeleted: false
  },
  {
    uuid: 'f698f118-39c9-41ef-a944-97291bfc88d4',
    name: 'Fiber Plus',
    providerUuid: 'b3f2b1a4-8c4b-40a8-818b-ac1f72bafaf0',
    downloadSpeed: 20,
    uploadSpeed: 20,
    connection: ConnectionType.fiber,
    price: 660.00,
    priceModel: PriceModel.perYear,
    link: new URL('https://www.sinet.com.kh/internet-solution/fiber-plus/'),
    updated_time: new Date(),
    isDeleted: false
  },
  {
    uuid: '6d0951ae-aebb-4073-a238-0de3e94084fc',
    name: 'Home Lite',
    providerUuid: 'c78615e6-983d-4b7c-925d-58bec7eda58c',
    downloadSpeed: 6,
    uploadSpeed: 6,
    connection: ConnectionType.adsl,
    price: 12.00,
    priceModel: PriceModel.perMonth,
    link: new URL('https://www.opennet.com.kh/news/adsl/adsl-home-premium-for-phnompenh/'),
    updated_time: new Date(),
    isDeleted: false
  },
  {
    uuid: '30e417d8-5bae-479e-a658-7962096449d8',
    name: 'Internet 4mbps',
    providerUuid: '135ae2a0-4b94-4acf-be04-37ceb3107450',
    downloadSpeed: 4,
    uploadSpeed: 4,
    connection: ConnectionType.fiber,
    price: 12.00,
    priceModel: PriceModel.perMonth,
    link: new URL('http://smtelemedia.com/sign-up-ftth/?service-name=4+Mbps'),
    updated_time: new Date(),
    isDeleted: false
  },
  {
    uuid: 'd0262cfc-fa08-49c6-815e-a6da2fa74c3c',
    name: 'Tam Chet 3',
    providerUuid: '9734fc3f-c934-4a06-ac33-9843dff0eec8',
    downloadSpeed: 3,
    uploadSpeed: 3,
    connection: ConnectionType.lte,
    price: 9.99,
    priceModel: PriceModel.perMonth,
    link: new URL('http://www.kingtel.com.kh/unlimited-data-traffic.html'),
    updated_time: new Date(),
    isDeleted: false
  },
  {
    uuid: '64f78b47-ff1d-49c2-96ba-6b16cbddd928',
    name: 'Tam Chet 6',
    providerUuid: '9734fc3f-c934-4a06-ac33-9843dff0eec8',
    downloadSpeed: 6,
    uploadSpeed: 6,
    connection: ConnectionType.lte,
    price: 16.99,
    priceModel: PriceModel.perMonth,
    link: new URL('http://www.kingtel.com.kh/unlimited-data-traffic.html'),
    updated_time: new Date(),
    isDeleted: false
  },
  {
    uuid: 'fc318cea-a92d-4564-bf9c-0798064e0bf4',
    name: 'Tam Chet 10',
    providerUuid: '9734fc3f-c934-4a06-ac33-9843dff0eec8',
    downloadSpeed: 10,
    uploadSpeed: 10,
    connection: ConnectionType.lte,
    price: 24.99,
    priceModel: PriceModel.perMonth,
    link: new URL('http://www.kingtel.com.kh/unlimited-data-traffic.html'),
    updated_time: new Date(),
    isDeleted: false
  }
]

const providerColumns = new pg.helpers.ColumnSet(
  ['uuid', 'name', 'logo', 'is_deleted']
)

const providerValues = providers.map((provider: Provider) => ({
  uuid: provider.uuid,
  name: provider.name,
  logo: provider.logo,
  is_deleted: provider.isDeleted
}))

const planColumns = new pg.helpers.ColumnSet(
  [ 'uuid', 'name', 'provider_uuid', 'download_speed', 'upload_speed', 'connection',
    'price', 'price_model', 'link', 'notes', 'updated_time', 'is_deleted']
)

const planValues = plans.map((plan: Plan) => ({
  uuid: plan.uuid,
  name: plan.name,
  provider_uuid: plan.providerUuid,
  download_speed: plan.downloadSpeed,
  upload_speed: plan.uploadSpeed,
  connection: plan.connection,
  price: plan.price,
  price_model: plan.priceModel,
  link: plan.link,
  notes: plan.notes,
  updated_time: plan.updated_time,
  is_deleted: plan.isDeleted
}))
