module.exports = function(sql, DataTypes) {
    var CV = sql.define("CV", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: true },
    }, {
        classMethods: {
            associate: function(models) {
                CV.belongsTo(models.Users, {foreignKey: 'created_by'});
                CV.belongsTo(models.Templates, {foreignKey: 'template_id'});
            },

            getUser: function(callback) {
                var Users = sql.import('User');
                Users.findById(self.user_db_id).then(function(user) {
                    callback(user);
                });
            }
        }
    });

    return CV;
};
