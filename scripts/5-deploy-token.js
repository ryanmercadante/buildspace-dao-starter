import sdk from './1-initialize-sdk.js'

// In order to deploy the new contract we need our old friend the app module again.
const app = sdk.getAppModule('0x27a17A7547B59924354f3371ba06174595795E5E')

;(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      // What's your token's name? Ex. "Ethereum"
      name: 'NYCDAO Governance Token',
      // What's your token's symbol? Ex. "ETH"
      symbol: 'NYC',
    })
    console.log(
      '✅ Successfully deployed token module, address:',
      tokenModule.address
    )
  } catch (err) {
    console.error('failed to deploy token module', err)
  }
})()
