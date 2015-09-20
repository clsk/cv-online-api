module.exports = function(sql, DataTypes) {
    var Session = sql.define("Session", {
        id: { type: DataTypes.UUID, primaryKey: true },
        fb_id: { type: DataTypes.STRING, allowNull: false },
        fb_token: { type: DataTypes.STRING, allowNull: false }
    }, {
        classMethods: {
            associate: function(models) {
                Session.belongsTo(models.Users, {onDelete: 'cascade'});
            }
        }
    });


    return Session;
};
