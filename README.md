# PayChat - Base MiniApp

**Chat. Split. Pay. All in one.**

PayChat is a conversational payment app for Farcaster users to easily split bills and send payments within their social graph, built as a Base MiniApp.

## Features

- **In-Chat Payments**: Send cryptocurrency payments directly within conversations using commands like `/pay @user 0.01 ETH`
- **Group Payment Splitting**: Create group payment requests with `/split dinner $50 @user1 @user2 @user3`
- **Transaction History**: View and track all payments and outstanding debts
- **Base Network Integration**: Fast and low-cost transactions on Base L2

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Wallet Integration**: OnchainKit + MiniKit
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety throughout

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

- **Send Payment**: `/pay @username amount ETH`
  - Example: `/pay @alice 0.01 ETH`

- **Split Bill**: `/split description amount @user1 @user2`
  - Example: `/split dinner 0.05 @alice @bob`

### Features

1. **Chat Interface**: Natural conversation flow with payment commands
2. **Transaction History**: View all sent, received, and pending transactions
3. **Wallet Integration**: Connect your wallet to send real payments on Base
4. **Mobile-First Design**: Optimized for mobile Farcaster clients

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
