import sdk from './1-initialize-sdk.js'

const bundleDrop = sdk.getBundleDropModule(
  '0x00b27d02cA5536904302Ee4d7aB47D62f3c95c73'
)

;(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory()
    // Specify conditions.
    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 50_000,
      maxQuantityPerTransaction: 1,
    })

    await bundleDrop.setClaimCondition(0, claimConditionFactory)
    console.log(
      '✅ Sucessfully set claim condition on bundle drop:',
      bundleDrop.address
    )
  } catch (err) {
    console.error('Failed to set claim condition', err)
  }
})()
