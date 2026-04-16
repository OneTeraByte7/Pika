import { useState } from 'react';

export default function EditProfile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');

  const handleSave = (e: any) => {
    e.preventDefault();
    // Placeholder: save via backend later
    alert('Profile saved (placeholder)');
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-black text-white mb-6">Edit Dating Profile</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-white/70">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 p-3 rounded bg-white/5 border border-white/10 text-white" />
        </div>
        <div>
          <label className="block text-white/70">Age</label>
          <input value={age} onChange={(e) => setAge(e.target.value)} className="w-full mt-2 p-3 rounded bg-white/5 border border-white/10 text-white" />
        </div>
        <div>
          <label className="block text-white/70">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full mt-2 p-3 rounded bg-white/5 border border-white/10 text-white" rows={4} />
        </div>
        <button type="submit" className="px-6 py-3 bg-electric-blue text-black rounded font-bold">Save</button>
      </form>
    </div>
  );
}
