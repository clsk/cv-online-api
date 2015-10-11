module.exports = function(sql, DataTypes) {
    var Session = sql.define("Session", {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        fb_token: { type: DataTypes.STRING, allowNull: false }
    }, {
        classMethods: {
            associate: function(models) {
                Session.belongsTo(models.Users, {onDelete: 'cascade'});
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
