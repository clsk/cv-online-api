module.exports = function(sql, DataTypes) {
    var Template = sql.define("Template", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: DataTypes.STRING,
        html: DataTypes.TEXT,
        css: DataTypes.TEXT,
        mobile_html: DataTypes.TEXT,
        mobile_css: DataTypes.TEXT,
        preview_image_url: DataTypes.STRING,
        mobile_preview_image_url: DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
                Template.belongsTo(models.Users, {foreignKey: 'created_by'});
            },

            getUser: function(callback) {
                var Users = sql.import('User');
                Users.findById(self.user_db_id).then(function(user) {
                    callback(user);
                });
            }
        }
    });


    return Template;
};
