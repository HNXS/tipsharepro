'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLocations, createLocation, updateLocation, OrgLocation } from '@/lib/api/locations';
import { MapPin, Plus, Pencil, Check, X, Loader2 } from 'lucide-react';

export default function LocationManagement() {
  const [locations, setLocations] = useState<OrgLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNumber, setEditNumber] = useState('');

  const loadLocations = useCallback(async () => {
    try {
      setLoading(true);
      const locs = await getLocations();
      setLocations(locs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadLocations(); }, [loadLocations]);

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      setAdding(true);
      const loc = await createLocation({ name, number: newNumber.trim() || undefined });
      setLocations(prev => [...prev, loc]);
      setNewName('');
      setNewNumber('');
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create location');
    } finally {
      setAdding(false);
    }
  };

  const handleStartEdit = (loc: OrgLocation) => {
    setEditingId(loc.id);
    setEditName(loc.name);
    setEditNumber(loc.number || '');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    try {
      const updated = await updateLocation(editingId, {
        name: editName.trim(),
        number: editNumber.trim() || null,
      });
      setLocations(prev => prev.map(l => l.id === editingId ? updated : l));
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
    }
  };

  const handleToggleStatus = async (loc: OrgLocation) => {
    const newStatus = loc.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const updated = await updateLocation(loc.id, { status: newStatus });
      setLocations(prev => prev.map(l => l.id === loc.id ? updated : l));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
    }
  };

  if (loading) {
    return (
      <div className="location-mgmt">
        <div className="location-mgmt-header">
          <h4 className="location-mgmt-title"><MapPin size={16} /> Locations</h4>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <Loader2 size={20} className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="location-mgmt">
      <div className="location-mgmt-header">
        <h4 className="location-mgmt-title">
          <MapPin size={16} />
          Locations ({locations.length})
        </h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(true)}>
          <Plus size={14} />
          Add Location
        </button>
      </div>

      {error && <p className="text-error" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p>}

      {/* Add form */}
      {showAddForm && (
        <div className="location-add-form">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Location name (e.g. Main St)"
            className="form-input"
            autoFocus
          />
          <input
            type="text"
            value={newNumber}
            onChange={e => setNewNumber(e.target.value)}
            placeholder="Store # (optional)"
            className="form-input location-number-input"
          />
          <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={adding || !newName.trim()}>
            {adding ? <Loader2 size={14} className="loading-spinner" /> : <Check size={14} />}
            Save
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => { setShowAddForm(false); setNewName(''); setNewNumber(''); }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Location list */}
      <div className="location-list">
        {locations.map(loc => (
          <div key={loc.id} className={`location-row ${loc.status === 'INACTIVE' ? 'location-row-inactive' : ''}`}>
            {editingId === loc.id ? (
              <div className="location-edit-row">
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
                  className="form-input"
                  autoFocus
                />
                <input
                  type="text"
                  value={editNumber}
                  onChange={e => setEditNumber(e.target.value)}
                  placeholder="Store #"
                  className="form-input location-number-input"
                />
                <button className="btn btn-primary btn-sm" onClick={handleSaveEdit}>
                  <Check size={14} />
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="location-row-info">
                  <span className="location-row-name">{loc.name}</span>
                  {loc.number && <span className="location-row-number">#{loc.number}</span>}
                  <span className={`badge badge-sm ${loc.status === 'ACTIVE' ? 'badge-success' : 'badge-muted'}`}>
                    {loc.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="location-row-meta">
                  <span>{loc.employeeCount} employees</span>
                  <span>{loc.userCount} users</span>
                </div>
                <div className="location-row-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => handleStartEdit(loc)} title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button
                    className={`btn btn-sm ${loc.status === 'ACTIVE' ? 'btn-outline' : 'btn-primary'}`}
                    onClick={() => handleToggleStatus(loc)}
                    title={loc.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  >
                    {loc.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
