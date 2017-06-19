module.exports = {
  env: {
    es6: true
  },

  extends: ['standard'],

  plugins: ['standard', 'promise'],

  rules: {
    'max-len': [2, { code: 80, ignoreComments: true }],
    'max-nested-callbacks': [2, { max: 3 }],
    'consistent-return': 2,
    'global-require': 2,

    'vars-on-top': 1,
    'complexity': [1, { max: 2 }],
    'max-depth': [1, { max: 3 }],
    'max-params': [1, { max: 3 }],
  }
}
