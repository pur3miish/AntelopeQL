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
        rpc_url: 'http://127.0.0.1:8888',
        // rpc_url: 'https://jungle.relocke.io',
        private_keys: [
          '5K7xR2C8mBzMo4aMPJyBPp7Njc3XvszeJSfTApa51rc2d54rrd3',
          '5JWuEZQHLpUw8na4g8Fr99ZnPiuhtQjrvJLn6xBwUBnQmYBF3Z2'
        ],
        contracts: ['nutrientjrnl']
      }).then(async data => {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(data), 'utf-8')
      })
    })
  })
  .listen(3002)

// server.close()
