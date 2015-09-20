module.exports = function(sql, DataTypes) {
    var Session = sql.define("Template", {
        id: { type: DataTypes.INTEGER, primaryKey: true},
        name: { type: DataTypes.STRING, allowNull: false },
        description: DataTypes.STRING,
        html: DataTypes.TEXT,
        css: DataTypes.TEXT,
        device: DataTypes.ENUM('mobile', 'web')
    }, {
        classMethods: {
            associate: function(models) {
                Session.belongsTo(models.Users, {foreignKey: 'created_by'});
            },

            getUser: function(callback) {
                var Users = sql.import('User');
                Users.findById(self.user_db_id).then(function(user) {
                    callback(user);
                });
            }
        }
    });


    return Session;
};
