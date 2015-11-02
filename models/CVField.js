module.exports = function(sql, DataTypes) {
    var CVField = sql.define("CVField", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: {type: DataTypes.STRING },
        value: {type: DataTypes.STRING }
    }, {
        classMethods: {
            associate: function(models) {
                CVField.belongsTo(models.CVs, {foreignKey: 'cv_id'});
            }
        }
    });


    return CVField;
};
