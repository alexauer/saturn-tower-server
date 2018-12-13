var winston = require('winston');

winston.loggers.add('sensor',{
  console:{
    json:false,
    timestamp:true,
    colorize: true
  },
  file: {
    filename: __dirname + '/logfiles/sensor.log',
    json: false,
    maxsize:'10000000'
  }
});

winston.loggers.add('portal',{
  console:{
    json:false,
    timestamp:true,
    colorize: true
  },
  file: {
    filename: __dirname + '/logfiles/portal.log',
    json: false,
    maxsize:'10000000'
  }
});

module.exports = winston;