import https from 'https'
import fs from 'fs'
import path from 'path'

const themePath = path.resolve(process.cwd(), 'src/styles/theme.scss')

async function fetchTheme() {
  if (fs.existsSync(themePath) && !process.env.force_fetch_theme) {
    console.log('theme file exists')
    return
  }

  const file = fs.createWriteStream(themePath)

  // https://design-tokens.hbdev.club/projx/master/tokens.less
  https.get(
    `https://design-tokens.hbdev.club/projx/${process.env.THEME_BRANCH || 'master'}/tokens.scss`,
    function (response) {
      // let data = ''

      // // 收集数据块
      // response.on('data', (chunk) => {
      //   data += chunk
      // })

      // // 数据接收完成
      // response.on('end', () => {
      //   console.log('Response content:')
      //   console.log(data) // 打印完整内容
      // })

      response.pipe(file)

      // after download completed close filestream
      file.on('finish', () => {
        file.close()
        console.log('Download Completed')
      })
    },
  )
}

fetchTheme()
