import axios from 'axios'

const wallet = Wallet.fromPhrase(process.env.TESTING_MNEMONIC);

const api = axios.create({
  baseURL: 'https://api-testnet.eldorado.io/api', headers: {
    'Content-Type': 'application/json',
  }
})

async function CreatePaymentRequest(req, res) {
  const { item } = req.body;

  const params = { amount: (item.quantity * item.price).toFixed(8), cryptoCurrencyId: 'TRON-USDT', description: item.description }
  console.log('params', params)

  const message = getMessage(wallet, Date.now().toString())
  console.log(`**${message.toMessage()}**`)
  const signature = await wallet.signMessage(message.toMessage())
  console.log(signature)

  console.log('SignatureOK?', await message.verify({ signature }))

  const login = await api.post('/auth/login', {
    message: message.toMessage(),
    signature: signature
  })
  console.log('login response', login)
  if (!login.data.ok || !login.data.cookie) return res.status(500).json({ message: "Could not establish communciation with payment provider" })
  const cookies = login.data.cookie

  console.log('login ok')

  const paymentRequest = await api.post('/requests', params, {
    headers: {
      'Cookies': cookies,
    },
  }).then(x=>x.data.request)
  console.log('paymentRequest', paymentRequest)

  res.json({
    id: paymentRequest.requestId,
    href: `https://development-app.eldorado.io/payment-request/${paymentRequest.requestId}`
  });
}

export default CreatePaymentRequest;


import { SiweMessage } from "siwe";
import { Wallet } from "ethers";

function getMessage(wallet, nonce) {
  return new SiweMessage({
    address: wallet.address,
    domain: "api-testnet.eldorado.io",
    statement: "This is a test statement",
    uri: "https://api-testnet.eldorado.io",
    version: "1",
    nonce: nonce,
    issuedAt: new Date().toISOString(),
    chainId: 1,
    expirationTime: new Date(Date.now() + 1000 * 60 * 60).toISOString()
  });
}