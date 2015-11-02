module.exports = function(sql, DataTypes) {
    var CVEducation = sql.define("CVEducation", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        start_date: {type: DataTypes.DATE},
        end_date: {type: DataTypes.DATE},
        school: {type: DataTypes.STRING },
        degree: { type: DataTypes.STRING }
    }, {
        classMethods: {
            associate: function(models) {
                CVEducation.belongsTo(models.CVs, {foreignKey: 'cv_id'});
            }
        }
    });


    return CVEducation;
};
