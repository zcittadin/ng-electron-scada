function LogService(knex) {
  this.insertLog = function(log) {
    console.log(log);
    return knex('logs').insert(log);
  };
}

module.exports = LogService;
