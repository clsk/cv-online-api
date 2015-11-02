module.exports = function(sql, DataTypes) {
    var CVWorkExperienceBulletPoint = sql.define("CVWorkExperienceBulletPoint", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        text: {type: DataTypes.STRING }
    }, {
        classMethods: {
            associate: function(models) {
                CVWorkExperienceBulletPoint.belongsTo(models.CVWorkExperiences, {foreignKey: 'cv_work_experience_id', onDelete: 'cascade'});
            }
        }
    });


    return CVWorkExperienceBulletPoint;
};
