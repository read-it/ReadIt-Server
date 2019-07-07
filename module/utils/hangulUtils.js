var hangul = require('hangul-js');

const hangulUtil = (Str) => {

    return hangul.disassemble(Str).join('');	
};

module.exports = hangulUtil;