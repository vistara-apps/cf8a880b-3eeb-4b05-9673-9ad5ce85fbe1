'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import { parsePaymentCommand, generateTransactionId } from '@/lib/utils';
import { UserAvatar } from './UserAvatar';
import { PaymentButton } from './PaymentButton';
import { CommandHelper } from './CommandHelper';
import { Send, DollarSign, Users, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentChatProps {
  variant?: 'compact' | 'full';
  currentUserId: string;
  onPaymentInitiated?: (paymentData: any) => void;
  onSplitInitiated?: (splitData: any) => void;
}

export function AgentChat({
  variant = 'full',
  currentUserId,
  onPaymentInitiated,
  onSplitInitiated,
}: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'system',
      content: 'Welcome to PayChat! You can send payments with /pay @user amount ETH or split bills with /split description amount @user1 @user2',
      timestamp: new Date(),
      type: 'message',
    },
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCommandHelper, setShowCommandHelper] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const command = parsePaymentCommand(inputValue);
    const messageId = Date.now().toString();

    // Add user message
    const userMessage: ChatMessage = {
      id: messageId,
      userId: currentUserId,
      content: inputValue,
      timestamp: new Date(),
      type: command.type || 'message',
      paymentData: command.type ? {
        amount: command.amount || '0',
        currency: command.currency || 'ETH',
        recipient: command.recipient,
        participants: command.participants,
      } : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Process command
    if (command.type === 'pay' && command.recipient && command.amount) {
      // Simulate payment processing
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          userId: 'system',
          content: `Payment request created! Sending ${command.amount} ${command.currency} to @${command.recipient}`,
          timestamp: new Date(),
          type: 'payment',
          paymentData: {
            amount: command.amount,
            currency: command.currency || 'ETH',
            recipient: command.recipient,
          },
        };
        setMessages(prev => [...prev, responseMessage]);
        setIsProcessing(false);
        
        onPaymentInitiated?.({
          transactionId: generateTransactionId(),
          recipient: command.recipient,
          amount: command.amount,
          currency: command.currency,
        });
      }, 1000);
    } else if (command.type === 'split' && command.participants && command.amount) {
      // Simulate split processing
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          userId: 'system',
          content: `Split request created! ${command.participants.length} participants will each pay ${(parseFloat(command.amount) / command.participants.length).toFixed(3)} ETH`,
          timestamp: new Date(),
          type: 'split',
          paymentData: {
            amount: command.amount,
            currency: 'ETH',
            participants: command.participants,
          },
        };
        setMessages(prev => [...prev, responseMessage]);
        setIsProcessing(false);
        
        onSplitInitiated?.({
          requestId: generateTransactionId(),
          description: command.description,
          totalAmount: command.amount,
          participants: command.participants,
        });
      }, 1000);
    } else if (command.type) {
      // Invalid command
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          userId: 'system',
          content: 'Invalid command format. Use /pay @user amount ETH or /split description amount @user1 @user2',
          timestamp: new Date(),
          type: 'message',
        };
        setMessages(prev => [...prev, responseMessage]);
        setIsProcessing(false);
      }, 500);
    } else {
      // Regular message
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          userId: 'system',
          content: 'I can help you with payments! Try /pay @user amount ETH or /split description amount @user1 @user2',
          timestamp: new Date(),
          type: 'message',
        };
        setMessages(prev => [...prev, responseMessage]);
        setIsProcessing(false);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      'flex flex-col bg-bg',
      variant === 'compact' ? 'h-96' : 'h-full'
    )}>
      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {isProcessing && (
          <div className="flex justify-start">
            <div className="chat-bubble received">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-caption text-text-secondary">PayChat is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3 animate-fade-in',
              message.userId === currentUserId ? 'justify-end' : 'justify-start'
            )}
            role="article"
            aria-label={`Message from ${message.userId === currentUserId ? 'you' : message.userId === 'system' ? 'PayChat' : message.userId}`}
          >
            {message.userId !== currentUserId && message.userId !== 'system' && (
              <UserAvatar
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userId}`}
                alt={`${message.userId} avatar`}
                size="small"
              />
            )}
            
            <div className={cn(
              'chat-bubble max-w-xs interactive-element',
              message.userId === currentUserId ? 'sent' : 'received',
              message.userId === 'system' && 'bg-surface/60 text-text-secondary mx-auto text-center text-sm border border-gray-700/30'
            )}>
              <p className="text-body">{message.content}</p>
              
              {message.type === 'payment' && message.paymentData && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">Payment Request</span>
                  </div>
                  <PaymentButton
                    variant="primary"
                    className="w-full text-sm"
                    onClick={() => onPaymentInitiated?.(message.paymentData)}
                  >
                    Send {message.paymentData.amount} {message.paymentData.currency}
                  </PaymentButton>
                </div>
              )}
              
              {message.type === 'split' && message.paymentData && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Split Request</span>
                  </div>
                  <PaymentButton
                    variant="primary"
                    className="w-full text-sm"
                    onClick={() => onSplitInitiated?.(message.paymentData)}
                  >
                    View Split Details
                  </PaymentButton>
                </div>
              )}
              
              <p className="text-xs text-gray-400 mt-2">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            
            {message.userId === currentUserId && (
              <UserAvatar
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userId}`}
                alt={message.userId}
                size="small"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700/30" role="region" aria-label="Message input">
        <div className="flex gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Type a message or payment command
          </label>
          <input
            id="chat-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message or /pay @user amount ETH"
            className="input-field flex-1"
            disabled={isProcessing}
            aria-describedby="input-help"
            autoComplete="off"
          />
          <PaymentButton
            variant="primary"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            loading={isProcessing}
            className="px-3"
            aria-label={isProcessing ? "Sending message..." : "Send message"}
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </PaymentButton>
        </div>
        
        <div className="flex gap-2 mt-2" role="group" aria-label="Quick actions">
          <button
            onClick={() => setInputValue('/pay @alice 0.01 ETH')}
            className="text-xs bg-surface px-2 py-1 rounded text-text-secondary hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-200"
            aria-label="Insert quick pay command"
          >
            Quick Pay
          </button>
          <button
            onClick={() => setInputValue('/split dinner 0.05 @alice @bob')}
            className="text-xs bg-surface px-2 py-1 rounded text-text-secondary hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-200"
            aria-label="Insert split bill command"
          >
            Split Bill
          </button>
          <button
            onClick={() => setShowCommandHelper(true)}
            className="text-xs bg-surface px-2 py-1 rounded text-text-secondary hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-200 flex items-center gap-1"
            aria-label="Show command help"
          >
            <HelpCircle className="w-3 h-3" />
            Help
          </button>
        </div>
        
        <div id="input-help" className="sr-only">
          Use /pay @username amount ETH to send payments, or /split description amount @user1 @user2 to split bills
        </div>
      </div>

      {/* Command Helper Modal */}
      <CommandHelper
        isOpen={showCommandHelper}
        onClose={() => setShowCommandHelper(false)}
        onCommandSelect={(command) => setInputValue(command)}
      />
    </div>
  );
}
