module.exports = function(sql, DataTypes) {
    return sql.define("User", {
        fb_id: { type: DataTypes.STRING, primaryKey: true },
        email: { type: DataTypes.STRING, validate: { isEmail: true }},
        name: { type: DataTypes.STRING, allowNull: false },
        webpage: DataTypes.STRING,
        telephone: DataTypes.STRING,
        lastname: DataTypes.STRING,
        is_admin: DataTypes.BOOLEAN
    });
};
