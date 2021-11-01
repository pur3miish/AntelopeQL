'use strict'

const http = require('http')
const SmartQL = require('../private/index.js')

const server = http
  .createServer(function (request, response) {
    request.on('data', chunk => {
      const body = JSON.parse(chunk.toString('ascii'))
      const { query } = body

      SmartQL({
        query,
        broadcast: true,
        rpc_url: 'https://jungle.relocke.io',
        // contracts: ['eosio', 'eosio.token', 'relocke'],
        contracts: ['4343kekistan', 'eosio.token']
      }).then(async data => {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(data), 'utf-8')
      })
    })
  })
  .listen(3002)

server.close()
