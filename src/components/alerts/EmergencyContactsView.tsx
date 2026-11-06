import React, { useState } from 'react';
import { PhoneCall, Plus, Search, Trash2, Edit3, X, CheckCircle2, Shield } from 'lucide-react';
import { EmergencyContactItem } from '../../types/alerts';
import { INITIAL_EMERGENCY_CONTACTS } from '../../services/alertsService';
import { ALL_DISTRICTS } from '../../data/districtClimate';

export const EmergencyContactsView: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContactItem[]>(INITIAL_EMERGENCY_CONTACTS);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Contact State
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('');
  const [district, setDistrict] = useState('Hyderabad');
  const [mobile, setMobile] = useState('+91 9');
  const [email, setEmail] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [priority, setPriority] = useState<'P1' | 'P2' | 'P3'>('P1');

  const filtered = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.organization.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase());
    const matchesDist = districtFilter === 'all' || c.district.toLowerCase().includes(districtFilter.toLowerCase());
    return matchesSearch && matchesDist;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this emergency contact?')) {
      setContacts(contacts.filter((c) => c.id !== id));
    }
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newContact: EmergencyContactItem = {
      id: `CONT-${Date.now().toString().slice(-3)}`,
      name: name.trim(),
      organization: org.trim() || 'Telangana District Administration',
      role: role.trim() || 'Emergency Officer',
      district,
      mobile,
      email: email || 'officer@telangana.gov.in',
      responsibility: responsibility || 'Disaster management response',
      priority,
      supportedChannels: ['SMS', 'Email', 'App Push'],
      active: true,
    };

    setContacts([newContact, ...contacts]);
    setIsModalOpen(false);
    setName('');
    setOrg('');
    setRole('');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#030914] p-3 space-y-3 overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/15">
        <div>
          <h2 className="text-white text-sm font-bold tracking-wider font-mono uppercase flex items-center space-x-2">
            <PhoneCall className="w-4 h-4 text-[#00f0ff]" />
            <span>EMERGENCY CONTACTS DIRECTORY ({contacts.length} OFFICIALS)</span>
          </h2>
          <p className="text-[10.5px] text-slate-400">
            Designated disaster focal points across state ministries, SDRF, NDRF, and district collectorates
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#071322] border border-[#00f0ff]/20 rounded pl-7 pr-2.5 py-1 text-slate-200 text-xs focus:outline-none"
            />
          </div>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-[#071322] border border-[#00f0ff]/20 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          >
            <option value="all">All Districts</option>
            {ALL_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded bg-gradient-to-r from-[#00d9f5] to-[#00f0ff] hover:from-[#00c5df] text-[#020810] font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Contacts List Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2.5 pr-1 custom-scrollbar">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-[#061220] border border-white/[0.08] hover:border-[#00f0ff]/30 p-3 rounded flex flex-col justify-between transition-colors text-xs"
          >
            <div>
              <div className="flex items-start justify-between pb-1.5 border-b border-white/[0.05]">
                <div>
                  <div className="text-white font-bold text-[12px]">{c.name}</div>
                  <div className="text-[#00f0ff] text-[10.5px] font-medium">{c.role}</div>
                  <div className="text-slate-400 text-[10px]">{c.organization}</div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold ${
                      c.priority === 'P1'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {c.priority}
                  </span>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1 rounded text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 pt-2 text-[10.5px] text-slate-300">
                <div>
                  <span className="text-slate-500">Jurisdiction:</span> {c.district}
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>{' '}
                  <span className="font-mono text-slate-200">{c.mobile}</span> •{' '}
                  <span className="text-slate-500">Email:</span> {c.email}
                </div>
                <div>
                  <span className="text-slate-500">Emergency Scope:</span> {c.responsibility}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] mt-2 text-[9.5px]">
              <span className="text-slate-400">Channels: {c.supportedChannels.join(', ')}</span>
              <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active Duty</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#030914] border border-[#00f0ff]/40 rounded-lg w-full max-w-lg p-5 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#00f0ff]/20 mb-3">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider font-mono">
                REGISTER EMERGENCY CONTACT
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">Organization *</label>
                  <input
                    type="text"
                    required
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">Official Role *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">District *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2 py-1.5 text-white"
                  >
                    <option value="Statewide (HQ)">Statewide (HQ)</option>
                    {ALL_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">
                  Disaster Mandate / Responsibility *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reservoir gates & downstream canal evacuations"
                  value={responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                  className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#00f0ff] hover:bg-[#00c5df] text-black font-bold text-xs"
                >
                  Save Emergency Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
