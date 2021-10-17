'use strict'

const http = require('http')
const { SmartQL } = require('../public/index.js')

const server = http
  .createServer(function (request, response) {
    request.on('data', chunk => {
      const body = JSON.parse(chunk.toString('ascii'))
      const { query } = body

      SmartQL({
        query,
        broadcast: false,
        rpc_url: 'https://jungle.relocke.io',
        contract: 'eosio.token',
        private_keys: ['5K7xR2C8mBzMo4aMPJyBPp7Njc3XvszeJSfTApa51rc2d54rrd3']
      }).then(async data => {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(data), 'utf-8')
      })
    })
  })
  .listen(3001)

// server.close()
