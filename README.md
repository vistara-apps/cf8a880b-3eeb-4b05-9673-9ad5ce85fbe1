# PayChat - Base Mini App

A conversational payment app for Farcaster users to easily split bills and send payments within their social graph.

## Features

- **x402 Payment Protocol**: Integrated x402-axios for secure, efficient payments on Base
- **In-Chat Payments**: Send cryptocurrency payments directly within conversations using commands like `/pay @user 0.01 USDC`
- **Group Payment Splitting**: Create group payment requests with `/split dinner $50 @user1 @user2 @user3`
- **Transaction History**: View and track all payments with real transaction confirmations
- **Base Network Integration**: Fast and low-cost transactions on Base L2 with USDC support
- **Real-time Transaction Monitoring**: Live transaction status updates and confirmations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Payment Protocol**: x402-axios for secure payment processing
- **Wallet Integration**: Wagmi + OnchainKit + MiniKit
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety throughout
- **State Management**: React Query for async state

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.local` and update with your API keys:
   ```bash
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
   NEXT_PUBLIC_URL=your_app_url_here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Payment Commands

- **Send Payment**: `/pay @username amount USDC`
  - Example: `/pay @alice 0.01 USDC`
  - Supports both USDC and ETH on Base

- **Split Bill**: `/split description amount @user1 @user2`
  - Example: `/split dinner 0.05 @alice @bob`

### Features

1. **Chat Interface**: Natural conversation flow with payment commands
2. **x402 Payment Processing**: Secure, efficient payments using x402 protocol
3. **Transaction History**: View all sent, received, and pending transactions with real confirmations
4. **Wallet Integration**: Connect your wallet to send real USDC/ETH payments on Base
5. **Mobile-First Design**: Optimized for mobile Farcaster clients
6. **Real-time Updates**: Live transaction status and confirmation monitoring

## x402 Integration

PayChat uses the x402 payment protocol for secure, efficient transactions on Base:

### Key Features
- **Wagmi Integration**: Uses `useWalletClient` hook for wallet connectivity
- **USDC Support**: Native USDC payments on Base (contract: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
- **Transaction Verification**: Real-time transaction confirmation monitoring
- **Error Handling**: Comprehensive error handling for payment failures
- **Base Network**: Optimized for Base L2 with low fees and fast confirmations

### Payment Flow
1. User initiates payment through chat or test button
2. x402-axios creates secure payment request
3. Wallet client processes transaction on Base
4. Real-time monitoring of transaction status
5. Confirmation and history update

### Testing
- Connect wallet in the app
- Use "Test x402 Payment" button in wallet tab
- Monitor transaction on BaseScan
- Verify payment appears in transaction history

## Architecture

### Components

- `AppShell`: Main app layout with navigation
- `AgentChat`: Conversational interface for payments
- `TransactionHistory`: List and filter transaction history
- `PaymentModal`: Confirmation modal for payments
- `UserAvatar`: User profile pictures
- `PaymentButton`: Styled payment action buttons
- `TransactionItem`: Individual transaction display

### Data Models

- **User**: Farcaster ID, wallet address, display name, avatar
- **Transaction**: Payment details, status, participants
- **PaymentRequest**: Group payment splitting information
- **ChatMessage**: Conversation messages with payment data

## Deployment

This app is designed to be deployed as a Farcaster Frame and Base Mini App:

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform**
3. **Configure Frame metadata** in `app/layout.tsx`
4. **Test in Farcaster clients**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
