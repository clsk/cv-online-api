module.exports = function(sql, DataTypes) {
    var CVWorkExperience = sql.define("CVWorkExperience", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        start_date: {type: DataTypes.DATE},
        end_date: {type: DataTypes.DATE},
        company: {type: DataTypes.STRING },
        position: { type: DataTypes.STRING }
    }, {
        classMethods: {
            associate: function(models) {
                CVWorkExperience.belongsTo(models.CVs, {foreignKey: 'cv_id', onDelete: 'cascade'});
            }
        }
    });


    return CVWorkExperience;
};
