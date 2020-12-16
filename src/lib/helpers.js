const bcryptjs = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
    try {
        // Realizamos la comparación de un str comun y uno encriptado
        // Devolviendo un boolean 
        return await bcryptjs.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }
};


module.exports = helpers;