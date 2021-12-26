import { readFileSync } from 'fs'
import sdk from './1-initialize-sdk.js'

const bundleDrop = sdk.getBundleDropModule(
  '0x00b27d02cA5536904302Ee4d7aB47D62f3c95c73'
)

;(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: 'Empire State Building',
        description: 'This NFT will give you access to NYCDAO',
        image: readFileSync('scripts/assets/empire.png'),
      },
    ])
    console.log('✅ Successfully created a new NFT in the drop!')
  } catch (err) {
    console.error('failed to create the new NFT', err)
  }
})()
