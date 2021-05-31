 // 这是项目发布阶段需要
const prodPlugins = []
module.exports = {

    'presets': [
      '@vue/app'
    ],
    'plugins': [
      [
        'component',
        {
          'libraryName': 'element-ui',
          'styleLibraryName': 'theme-chalk'
        }
      ],
      'transform-remove-console'
    ]
  }
  