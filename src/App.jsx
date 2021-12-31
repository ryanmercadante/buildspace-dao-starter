import { useEffect, useMemo, useState } from 'react'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { ethers } from 'ethers'

// Instantiate the SDK on Rinkeby.
const sdk = new ThirdwebSDK('rinkeby')

// Grab a reference to our ERC-1155 contract.
const bundleDropModule = sdk.getBundleDropModule(
  '0x00b27d02cA5536904302Ee4d7aB47D62f3c95c73'
)

// This is the address to our ERC-20 token contract.
const tokenModule = sdk.getTokenModule(
  '0xFB1F01936CeaBC2218A7Fa95088cb24Ec125348E'
)

const App = () => {
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  // Holds the amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({})
  // The array holding all of our members addresses
  const [memberAddresses, setMemberAddresses] = useState([])

  // Use the connectWallet hook thirdweb gives us.
  const { connectWallet, address, error, provider } = useWeb3()
  console.log('👋 Address:', address)

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = useMemo(() => {
    if (provider) return provider.getSigner()
    return undefined
  }, [provider])

  // Shorten someones wallet address. No need to show the whole thing.
  const shortenAddress = (addr) =>
    addr.substring(0, 6) + '...' + addr.substring(addr.length - 4)

  const mintNft = async () => {
    setIsClaiming(true)

    try {
      await bundleDropModule.claim('0', 1)
      setHasClaimedNFT(true)
      // Show user their fancy new NFT!
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      )
    } catch (err) {
      console.error('failed to claim NFT', err)
    } finally {
      setIsClaiming(false)
    }
  }

  const memberList = useMemo(
    () =>
      memberAddresses.map((address) => ({
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means
          // they don't hold any of our token.
          memberTokenAmounts[address] || 0,
          18
        ),
      })),
    [memberAddresses, memberTokenAmounts]
  )

  useEffect(() => {
    if (signer) {
      sdk.setProviderOrSigner(signer)
    }
  }, [signer])

  useEffect(() => {
    if (!address) {
      return
    }

    // Check if the user has the NFT by using bundleDropModule.balanceOf
    bundleDropModule
      .balanceOf(address, '0')
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true)
          console.log('🌟 this user has a membership NFT!')
        } else {
          setHasClaimedNFT(false)
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((err) => {
        setHasClaimedNFT(false)
        console.error('failed to find NFT balance', err)
      })
  }, [address])

  // Grab the users who hold our NFT with tokenId 0.
  useEffect(() => {
    if (!hasClaimedNFT) return

    bundleDropModule
      .getAllClaimerAddresses('0')
      .then((addresses) => {
        console.log('🚀 Members addresses', addresses)
        setMemberAddresses(addresses)
      })
      .catch((err) => console.error('failed to get member list', err))
  }, [hasClaimedNFT])

  // Grabs the number of tokens each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    // Grab all the balances
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log('👜 Amounts', amounts)
        setMemberTokenAmounts(amounts)
      })
      .catch((err) => console.error('failed to get token amounts', err))
  }, [hasClaimedNFT])

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className='landing'>
        <h1>Welcome to NYCDAO</h1>
        <button onClick={() => connectWallet('injected')} className='btn-hero'>
          Connect your wallet
        </button>
      </div>
    )
  }

  if (hasClaimedNFT) {
    return (
      <div className='member-page'>
        <h1>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    )
  }

  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
  return (
    <div className='mint-nft'>
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? 'Minting...' : 'Mint your nft (FREE)'}
      </button>
    </div>
  )
}

export default App
