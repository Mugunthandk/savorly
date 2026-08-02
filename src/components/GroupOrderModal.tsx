import React, { useState } from 'react';
import { Users, Copy, Check, MessageSquare, Send, Vote, ShoppingBag, Plus, Trash2, ArrowRight, X } from 'lucide-react';
import { GroupOrderState, User, MenuItem } from '../types';
import { RESTAURANTS, MENU_ITEMS } from '../data/mockData';

interface GroupOrderModalProps {
  user: User;
  groupOrder: GroupOrderState | null;
  onStartGroup: (restaurantId?: string) => void;
  onUpdateGroup: (updated: GroupOrderState) => void;
  onClose: () => void;
  onAddGroupItemToCart: (item: MenuItem, memberName: string) => void;
}

export const GroupOrderModal: React.FC<GroupOrderModalProps> = ({
  user,
  groupOrder,
  onStartGroup,
  onUpdateGroup,
  onClose,
  onAddGroupItemToCart
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://savorly.in/group/${groupOrder?.code || 'SVR-902'}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !groupOrder) return;
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: user.name,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onUpdateGroup({
      ...groupOrder,
      messages: [...groupOrder.messages, newMessage]
    });
    setChatInput('');
  };

  const handleVotePoll = (optionId: string) => {
    if (!groupOrder || !groupOrder.poll) return;

    const updatedOptions = groupOrder.poll.options.map(opt => {
      if (opt.id === optionId) {
        const hasVoted = opt.votes.includes(user.id);
        return {
          ...opt,
          votes: hasVoted ? opt.votes.filter(id => id !== user.id) : [...opt.votes, user.id]
        };
      }
      return opt;
    });

    onUpdateGroup({
      ...groupOrder,
      poll: {
        ...groupOrder.poll,
        options: updatedOptions
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181613] border border-white/15 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-[#211e19] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff6814] flex items-center justify-center text-white shadow-lg shadow-[#ff6814]/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800 uppercase tracking-wider">
                Social Order
              </span>
              <h2 className="font-serif font-bold text-xl text-white mt-0.5">
                Group Order & Split Bill
              </h2>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {groupOrder ? (
            <div className="space-y-6">
              
              {/* Active Group Code & Share Banner */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    Group Host: {groupOrder.hostName}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white">
                    Code: <strong className="font-mono text-[#ff6814]">{groupOrder.code}</strong>
                  </h3>
                  <p className="text-xs text-stone-400">
                    {groupOrder.members.length} members connected live
                  </p>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-[#ff6814] hover:bg-[#ee5703] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#ff6814]/20"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Share Invite Link'}</span>
                </button>
              </div>

              {/* Connected Members */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-300">Live Members in Group:</p>
                <div className="flex flex-wrap gap-2">
                  {groupOrder.members.map((m) => (
                    <div key={m.id} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-200">
                      <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-medium">{m.name}</span>
                      {m.isHost && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                          Host
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Group Poll Section */}
              {groupOrder.poll && (
                <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <Vote className="w-4 h-4" />
                    <span>Group Poll: {groupOrder.poll.title}</span>
                  </div>

                  <div className="space-y-2">
                    {groupOrder.poll.options.map((opt) => {
                      const userVoted = opt.votes.includes(user.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleVotePoll(opt.id)}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                            userVoted 
                              ? 'bg-[#ff6814]/20 border-[#ff6814] text-white' 
                              : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                          }`}
                        >
                          <span className="font-medium">{opt.restaurantName}</span>
                          <span className="font-bold text-[#ff6814]">
                            {opt.votes.length} Votes {userVoted ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chat Thread */}
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-white/10 space-y-3">
                <p className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#ff6814]" />
                  <span>Group Chat</span>
                </p>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                  {groupOrder.messages.map((msg) => (
                    <div key={msg.id} className="text-xs p-2 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex justify-between text-[10px] text-stone-400 mb-0.5">
                        <strong className="text-amber-300">{msg.sender}</strong>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-stone-200">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type message to group..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-stone-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6814]"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2.5 rounded-xl bg-[#ff6814] hover:bg-[#ee5703] text-white"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Start or Join Group Order */
            <div className="space-y-6">
              
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 to-stone-900 border border-amber-500/30 text-center space-y-3">
                <Users className="w-10 h-10 text-[#ff6814] mx-auto" />
                <h3 className="font-serif font-bold text-xl text-white">Create New Group Order</h3>
                <p className="text-xs text-stone-300 max-w-md mx-auto">
                  Invite friends to add items from their phones, run polls on where to order, and split the bill seamlessly!
                </p>
                <button
                  onClick={() => onStartGroup()}
                  className="px-6 py-3 rounded-full bg-[#ff6814] hover:bg-[#ee5703] text-white text-xs font-bold shadow-xl shadow-[#ff6814]/20"
                  id="start-group-order-btn"
                >
                  Start New Group Order
                </button>
              </div>

              {/* Join Existing Group */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 space-y-3">
                <p className="text-xs font-semibold text-stone-300">Join Group via Code:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code (e.g. SVR-902)"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-stone-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#ff6814]"
                  />
                  <button
                    onClick={() => onStartGroup()}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                  >
                    Join
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
