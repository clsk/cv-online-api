module.exports = function(sql, DataTypes) {
    var CVWorkExperienceBulletPoint = sql.define("CVWorkExperienceBulletPoint", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        text: {type: DataTypes.STRING }
    }, {
        classMethods: {
            associate: function(models) {
                CVWorkExperienceBulletPoint.belongsTo(models.CVWorkExperience, {foreignKey: 'cv_work_experience_id'});
            }
        }
    });


    return CVWorkExperienceBulletPoint;
};
