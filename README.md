# CreatipJar - Decentralized Tipping dApp

A beautiful, fast, and secure tipping application for creatives built on Hedera Hashgraph. Send HBAR tips instantly with minimal fees using MetaMask wallet integration.

![CreatipJar](https://via.placeholder.com/800x400/00D4AA/ffffff?text=Hedera+TipJar)

## ✨ Features

- 🚀 **Lightning Fast**: 3-5 second transaction finality
- 💰 **Ultra Low Fees**: ~$0.0001 per transaction
- 🔒 **Secure**: Built on Hedera's secure hashgraph consensus
- 🌱 **Eco-Friendly**: Carbon negative network
- 📱 **Responsive**: Beautiful UI that works on all devices
- 🔗 **MetaMask Integration**: Easy wallet connection via JSON-RPC Relay
- 📊 **Real-time Analytics**: Live transaction tracking and statistics
- 🎯 **User-Friendly**: Simple 3-step tipping process

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Blockchain**: Hedera SDK + JSON-RPC Relay
- **Wallet**: MetaMask integration
- **API**: Hedera Mirror Node REST API
- **State Management**: React Query + React Hooks

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd hedera-tipjar
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment**
```bash
cp .env.example .env
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:8080`

## 📖 How to Use

### For Tippers

1. **Connect Wallet**: Click "Connect MetaMask" and approve the connection
2. **Enter Details**: Add recipient's Hedera account ID (format: 0.0.123456) and tip amount
3. **Send Tip**: Click "Send Tip" and confirm the transaction in MetaMask

### For Recipients

1. Share your Hedera account ID with supporters
2. Receive tips instantly with notifications
3. View transaction history in real-time

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Network configuration (testnet/mainnet)
VITE_HEDERA_NETWORK=testnet

# Optional: Custom endpoints
VITE_TESTNET_MIRROR_URL=https://testnet.mirrornode.hedera.com
VITE_MAINNET_MIRROR_URL=https://mainnet-public.mirrornode.hedera.com
```

### Network Switching

To switch from testnet to mainnet:

1. Update `VITE_HEDERA_NETWORK=mainnet` in `.env`
2. Update the network configuration in `src/lib/hedera.ts`
3. Restart the development server

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Testing
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── WalletConnect.tsx
│   ├── TipForm.tsx
│   ├── TransactionHistory.tsx
│   └── Analytics.tsx
├── hooks/              # Custom React hooks
│   ├── useWallet.ts
│   └── use-toast.ts
├── lib/                # Utility libraries
│   ├── hedera.ts       # Hedera SDK integration
│   ├── api.ts          # Mirror Node API
│   └── utils.ts
├── pages/              # Main application pages
│   ├── Landing.tsx
│   ├── TipApp.tsx
│   └── NotFound.tsx
└── App.tsx             # Main application component
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

2. **Set environment variables** in Vercel dashboard:
   - `VITE_HEDERA_NETWORK=mainnet` (for production)

### Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Environment variables**:
   - `VITE_HEDERA_NETWORK=mainnet`

### Custom Server

```bash
# Build the project
npm run build

# Serve the dist folder with any static file server
npx serve dist
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- WalletConnect.test.tsx
```

### Manual Testing

1. **Testnet Testing**: Use testnet HBAR from Hedera Portal faucet
2. **MetaMask Setup**: Add Hedera testnet to MetaMask
3. **Transaction Verification**: Check transactions on HashScan

## 🔐 Security

- ✅ Client-side wallet integration only
- ✅ No private keys stored in application
- ✅ All transactions signed by user's wallet
- ✅ Input validation and sanitization
- ✅ Secure communication with Hedera network

## 📊 Analytics & Monitoring

The app includes built-in analytics:

- **Total Tips**: All-time tip count
- **Total HBAR**: Total value tipped
- **Unique Tippers**: Number of different accounts
- **Recent Activity**: Last 24 hours statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m 'Add new feature'`
6. Push: `git push origin feature/new-feature`
7. Submit a pull request

## 📝 API Reference

### Hedera SDK Integration

```typescript
import { executeTransferWithWallet } from '@/lib/hedera'

// Send a tip
const result = await executeTransferWithWallet(
  fromAccountId,
  toAccountId,
  amount,
  window.ethereum
)
```

### Mirror Node API

```typescript
import { fetchRecentTransactions } from '@/lib/api'

// Get recent transactions
const transactions = await fetchRecentTransactions(accountId)
```

## 🐛 Troubleshooting

### Common Issues

**MetaMask not connecting**
- Ensure MetaMask is installed and unlocked
- Check that you're on the correct network
- Clear browser cache and try again

**Transaction failing**
- Verify account ID format (0.0.123456)
- Ensure sufficient HBAR balance
- Check network connectivity

**Mirror Node errors**
- Verify network configuration
- Check if Mirror Node is accessible
- Try refreshing the page

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'hedera-tipjar:*')
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hedera Hashgraph](https://hedera.com) for the amazing DLT platform
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [MetaMask](https://metamask.io) for wallet integration
- The Hedera developer community

## 📞 Support

- **Documentation**: [Hedera Docs](https://docs.hedera.com)
- **Discord**: [Hedera Discord](https://discord.com/invite/hedera)
- **Issues**: Create an issue in this repository

---

Built with ❤️ for the Hedera community. Happy tipping! 🎉
