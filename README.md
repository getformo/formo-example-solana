# Formo Solana Example

An example Solana dApp demonstrating the [Formo Analytics SDK](https://github.com/getformo/sdk) integration with Solana wallet adapter.

This app tests the Solana support added in [PR #157](https://github.com/getformo/sdk/pull/157).

## Features

- **Wallet Connection**: Connect/disconnect with Phantom, Solflare, Torus, or Ledger
- **Message Signing**: Sign arbitrary messages with your wallet
- **Transaction Sending**: Send SOL transfers with transaction lifecycle tracking
- **Event Logging**: Real-time visualization of Formo analytics events
- **Devnet Airdrop**: Request test SOL for experimentation

## Formo SDK Events Tracked

The Formo SDK automatically tracks these Solana events:

| Event Type | Trigger |
|------------|---------|
| `wallet_connect` | Wallet successfully connected |
| `wallet_disconnect` | Wallet disconnected |
| `signature_requested` | Message/transaction signing initiated |
| `signature_confirmed` | User approved signature |
| `signature_rejected` | User rejected signature |
| `transaction_started` | Transaction creation initiated |
| `transaction_broadcasted` | Transaction submitted to network |
| `transaction_confirmed` | Transaction confirmed on-chain |
| `transaction_reverted` | Transaction failed on-chain |

## Quick Start

### Prerequisites

- Node.js 18+
- A Solana wallet browser extension (Phantom recommended)
- Formo write key from [app.formo.so](https://app.formo.so)

### Installation

```bash
# Clone the repository
git clone https://github.com/getformo/formo-example-solana.git
cd formo-example-solana

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Formo write key
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

Create a `.env` file with the following variables:

```env
# Required: Your Formo Analytics write key
NEXT_PUBLIC_FORMO_WRITE_KEY=your_write_key_here

# Optional: Custom Solana RPC endpoint (defaults to public devnet)
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Optional: Solana cluster (devnet, testnet, mainnet-beta)
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
```

## Testing with Local SDK

To test with a local development version of the Formo SDK:

```bash
# In the SDK directory
cd /path/to/formo-sdk
npm run build
npm link

# In this example app directory
cd /path/to/formo-example-solana
npm link @formo/analytics

# Run the app
npm run dev
```

## Testing Checklist

Use this checklist to verify Formo SDK Solana integration:

### Wallet Events
- [ ] Connect wallet → verify `wallet_connect` event fires
- [ ] Disconnect wallet → verify `wallet_disconnect` event fires
- [ ] Switch wallets → verify connect/disconnect events fire correctly

### Signature Events
- [ ] Sign a message → verify `signature_requested` event fires
- [ ] Approve signature → verify `signature_confirmed` event fires
- [ ] Reject signature → verify `signature_rejected` event fires

### Transaction Events
- [ ] Initiate transaction → verify `transaction_started` event fires
- [ ] Transaction broadcast → verify `transaction_broadcasted` event fires
- [ ] Transaction confirmed → verify `transaction_confirmed` event fires
- [ ] Send to invalid address → verify error handling

### Edge Cases
- [ ] Rapid connect/disconnect cycles
- [ ] Multiple signatures in sequence
- [ ] Transaction timeout handling
- [ ] Network switching (devnet ↔ testnet)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Main demo page
│   └── globals.css     # Global styles
├── components/
│   ├── WalletConnect.tsx    # Wallet connection UI
│   ├── SignMessageDemo.tsx  # Message signing demo
│   ├── TransactionDemo.tsx  # SOL transfer demo
│   ├── EventLog.tsx         # Real-time event viewer
│   └── FormoStatus.tsx      # SDK connection status
└── providers/
    ├── SolanaProviders.tsx  # Solana wallet adapter setup
    └── FormoProvider.tsx    # Formo SDK initialization
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana (devnet by default)
- **Wallet Adapter**: @solana/wallet-adapter-react
- **Analytics**: @formo/analytics

## Related Links

- [Formo SDK Repository](https://github.com/getformo/sdk)
- [Solana Support PR #157](https://github.com/getformo/sdk/pull/157)
- [Solana Wallet Adapter Docs](https://github.com/solana-labs/wallet-adapter)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)

## License

MIT
