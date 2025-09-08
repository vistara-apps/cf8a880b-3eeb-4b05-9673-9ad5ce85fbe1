'use client';

import { useState } from 'react';
import { X, HelpCircle, DollarSign, Users, Zap } from 'lucide-react';
import { PaymentButton } from './PaymentButton';

interface CommandHelperProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandSelect: (command: string) => void;
}

const commands = [
  {
    id: 'pay',
    icon: DollarSign,
    title: 'Send Payment',
    description: 'Send cryptocurrency to another user',
    syntax: '/pay @username amount ETH',
    example: '/pay @alice 0.01 ETH',
    color: 'text-accent',
  },
  {
    id: 'split',
    icon: Users,
    title: 'Split Bill',
    description: 'Split a bill among multiple users',
    syntax: '/split description amount @user1 @user2',
    example: '/split dinner 0.05 @alice @bob',
    color: 'text-primary',
  },
  {
    id: 'quick',
    icon: Zap,
    title: 'Quick Actions',
    description: 'Use the quick action buttons below the input',
    syntax: 'Click "Quick Pay" or "Split Bill"',
    example: 'Tap buttons for instant commands',
    color: 'text-warning',
  },
];

export function CommandHelper({ isOpen, onClose, onCommandSelect }: CommandHelperProps) {
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/30">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-heading">Payment Commands</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-hover rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="Close help"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-body text-text-secondary">
            PayChat makes it easy to send payments and split bills using simple commands:
          </p>

          {/* Commands */}
          <div className="space-y-3">
            {commands.map((command) => {
              const Icon = command.icon;
              const isSelected = selectedCommand === command.id;
              
              return (
                <div
                  key={command.id}
                  className={`glass-card p-4 cursor-pointer transition-all duration-200 hover:bg-surface-hover ${
                    isSelected ? 'ring-2 ring-primary/50 bg-surface-hover' : ''
                  }`}
                  onClick={() => setSelectedCommand(isSelected ? null : command.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCommand(isSelected ? null : command.id);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-surface ${command.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-subheading mb-1">{command.title}</h3>
                      <p className="text-caption text-text-secondary mb-2">
                        {command.description}
                      </p>
                      
                      {isSelected && (
                        <div className="space-y-3 animate-fade-in">
                          <div>
                            <h4 className="text-caption font-medium text-text mb-1">Syntax:</h4>
                            <code className="text-xs bg-bg px-2 py-1 rounded text-accent font-mono">
                              {command.syntax}
                            </code>
                          </div>
                          
                          <div>
                            <h4 className="text-caption font-medium text-text mb-1">Example:</h4>
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-bg px-2 py-1 rounded text-text-secondary font-mono flex-1">
                                {command.example}
                              </code>
                              <PaymentButton
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  onCommandSelect(command.example);
                                  onClose();
                                }}
                                aria-label={`Use ${command.title.toLowerCase()} example`}
                              >
                                Use
                              </PaymentButton>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="glass-card p-4 bg-primary/5 border-primary/20">
            <h3 className="text-subheading mb-2 text-primary">💡 Pro Tips</h3>
            <ul className="text-caption text-text-secondary space-y-1">
              <li>• Use @ to mention users (e.g., @alice)</li>
              <li>• Amounts are in ETH by default</li>
              <li>• Split bills are divided equally among participants</li>
              <li>• Commands are case-insensitive</li>
            </ul>
          </div>

          {/* Close button */}
          <PaymentButton
            variant="primary"
            onClick={onClose}
            className="w-full"
          >
            Got it!
          </PaymentButton>
        </div>
      </div>
    </div>
  );
}
