module.exports = () => {
    const Sequelize = require('sequelize');
    db = new Sequelize("Teamwork","admin","Admin00*",{
        host: "127.0.0.1",
        dialect: "postgres"
    });
    
    
    return {
        db,
        User: db.define("User", { name: Sequelize.STRING}),
        init: function(){
            this.db.sync();
        }
    };
};