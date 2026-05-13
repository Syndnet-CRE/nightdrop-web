'use client'

import { useState, useCallback } from 'react';
import { useDeals } from '@/components/providers/deals-provider';
import { useToast } from '@/components/providers/toast-provider';
import { buildPayload } from '@/lib/wizard-helpers';
import {
  ASSET_CLASSES, SCHEDULE_DAYS, ALL_DAYS, DISTRESS_SIGNAL_OPTIONS,
  OWNER_TYPE_OPTIONS, US_STATES, MAJOR_METROS, getAssetClass,
} from '@/lib/buy-box-taxonomy';
import { I } from './icons';
import '@/styles/buy-box-edit-modal.css';

const EMPTY_FORM = {
  label: '',
  geoMode: 'state',
  geo_states: [], geo_cities: [], geo_zips: [],
  geo_radius_address: '', geo_radius_miles: 25,
  geo_radius_lat: null, geo_radius_lng: null,
  asset_class: '', asset_use_codes: [],
  sf_min: '', sf_max: '',
  acres_min: '', acres_max: '',
  value_min: '', value_max: '',
  year_built_min: '', year_built_max: '',
  min_hold_yrs: '',
  owner_types: [],
  absentee_only: false,
  out_of_state_only: false,
  distress_signals: [],
  distress_only: false,
  distress_match_mode: 'any',
  notes: '',
  run_schedule: { days: [...ALL_DAYS] },
};

function detectGeoMode(box) {
  if (box.geo_cities?.length) return 'metro';
  if (box.geo_zips?.length) return 'zip';
  if (box.geo_radius_address) return 'radius';
  return 'state';
}

function fromBox(box) {
  return {
    ...EMPTY_FORM,
    label: box.label || '',
    geoMode: detectGeoMode(box),
    geo_states: box.geo_states || [],
    geo_cities: box.geo_cities || [],
    geo_zips: box.geo_zips || [],
    geo_radius_address: box.geo_radius_address || '',
    geo_radius_miles: box.geo_radius_miles || 25,
    geo_radius_lat: box.geo_radius_lat ?? null,
    geo_radius_lng: box.geo_radius_lng ?? null,
    asset_class: box.asset_class || '',
    asset_use_codes: box.asset_use_codes || [],
    sf_min: box.sf_min ?? '',
    sf_max: box.sf_max ?? '',
    acres_min: box.acres_min ?? '',
    acres_max: box.acres_max ?? '',
    value_min: box.value_min ?? '',
    value_max: box.value_max ?? '',
    year_built_min: box.year_built_min ?? '',
    year_built_max: box.year_built_max ?? '',
    min_hold_yrs: box.min_hold_yrs ?? '',
    owner_types: box.owner_types || [],
    absentee_only: box.absentee_only || false,
    out_of_state_only: box.out_of_state_only || false,
    distress_signals: box.distress_signals || [],
    distress_only: box.distress_only || false,
    distress_match_mode: box.distress_match_mode || 'any',
    notes: box.notes || '',
    run_schedule: box.run_schedule || { days: [...ALL_DAYS] },
  };
}

function toggleArr(arr, val) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

export function BuyBoxEditModal({ box, onClose }) {
  const { patchBuyBox, deleteBuyBox } = useDeals();
  const addToast = useToast();
  const [form, setForm] = useState(() => fromBox(box));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState(null);
  const [zipInput, setZipInput] = useState('');
  const [metroSearch, setMetroSearch] = useState('');

  const set = useCallback((key, val) => setForm(f => ({ ...f, [key]: val })), []);

  const statusNorm = (box.status || '').toLowerCase();
  const statusIntent = statusNorm === 'active' ? 'green'
    : statusNorm === 'pending' ? 'amber'
    : statusNorm.includes('failed') ? 'red'
    : 'gray';

  async function handleSave() {
    if (!form.label.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      await patchBuyBox(box.id, buildPayload(form));
      addToast('Buy box updated.');
      onClose();
    } catch (err) {
      setError(err?.message || 'Save failed. Please try again.');
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteBuyBox(box.id);
      addToast('Buy box deleted.');
      onClose();
    } catch (err) {
      setError(err?.message || 'Delete failed. Please try again.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const currentAssetClass = getAssetClass(form.asset_class);
  const days = form.run_schedule?.days || [];
  const busy = saving || deleting;

  return (
    <div className="bbem-backdrop" onClick={onClose}>
      <div className={`bbem${busy ? ' bbem-saving' : ''}`} onClick={e => e.stopPropagation()}>

        <div className="bbem-head">
          <div className="bbem-title-row">
            <div className="bbem-title">{box.label || box.name || 'Buy Box'}</div>
            <span className={`bbem-status ${statusIntent}`}>{box.status}</span>
          </div>
          <button className="bbem-close" onClick={onClose} aria-label="Close"><I.Close size={16}/></button>
        </div>

        <div className="bbem-body">
          {error && <div className="bbem-error">{error}</div>}

          {/* Name */}
          <div className="bbem-sec">
            <div className="bbem-sec-label">Name</div>
            <input
              className="bbem-input"
              value={form.label}
              onChange={e => set('label', e.target.value)}
              placeholder="Buy box name"
            />
          </div>

          {/* Geography */}
          <div className="bbem-sec">
            <div className="bbem-sec-label">Geography</div>
            <div className="bbem-geo-tabs">
              {[
                { id: 'state',  label: 'State' },
                { id: 'metro',  label: 'Metro' },
                { id: 'zip',    label: 'ZIP' },
                { id: 'radius', label: 'Radius' },
              ].map(t => (
                <button
                  key={t.id}
                  className={`bbem-geo-tab${form.geoMode === t.id ? ' active' : ''}`}
                  onClick={() => set('geoMode', t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {form.geoMode === 'state' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <select
                  className="bbem-select"
                  value=""
                  onChange={e => {
                    if (e.target.value && !form.geo_states.includes(e.target.value)) {
                      set('geo_states', [...form.geo_states, e.target.value]);
                    }
                  }}
                >
                  <option value="">Add a state...</option>
                  {US_STATES.map(([abbr, name]) => (
                    <option key={abbr} value={abbr}>{name}</option>
                  ))}
                </select>
                {form.geo_states.length > 0 && (
                  <div className="bbem-tag-input-area">
                    {form.geo_states.map(s => (
                      <span key={s} className="bbem-tag">
                        {s}
                        <button className="bbem-tag-x" onClick={() => set('geo_states', form.geo_states.filter(x => x !== s))}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {form.geoMode === 'metro' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <input
                  className="bbem-input"
                  placeholder="Search metros..."
                  value={metroSearch}
                  onChange={e => setMetroSearch(e.target.value)}
                />
                {metroSearch.trim() && (
                  <div className="bbem-metro-list">
                    {MAJOR_METROS
                      .filter(m => m.toLowerCase().includes(metroSearch.toLowerCase()) && !form.geo_cities.includes(m))
                      .slice(0, 8)
                      .map(m => (
                        <div
                          key={m}
                          className="bbem-metro-item"
                          onClick={() => { set('geo_cities', [...form.geo_cities, m]); setMetroSearch(''); }}
                        >
                          {m}
                        </div>
                      ))}
                  </div>
                )}
                {form.geo_cities.length > 0 && (
                  <div className="bbem-tag-input-area">
                    {form.geo_cities.map(c => (
                      <span key={c} className="bbem-tag">
                        {c}
                        <button className="bbem-tag-x" onClick={() => set('geo_cities', form.geo_cities.filter(x => x !== c))}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {form.geoMode === 'zip' && (
              <div className="bbem-tag-input-area">
                {form.geo_zips.map(z => (
                  <span key={z} className="bbem-tag">
                    {z}
                    <button className="bbem-tag-x" onClick={() => set('geo_zips', form.geo_zips.filter(x => x !== z))}>×</button>
                  </span>
                ))}
                <input
                  className="bbem-tag-bare-input"
                  value={zipInput}
                  onChange={e => setZipInput(e.target.value)}
                  placeholder="Type ZIP and press Enter"
                  onKeyDown={e => {
                    if ((e.key === 'Enter' || e.key === ',') && zipInput.trim()) {
                      e.preventDefault();
                      const z = zipInput.trim().replace(',', '');
                      if (z && !form.geo_zips.includes(z)) set('geo_zips', [...form.geo_zips, z]);
                      setZipInput('');
                    }
                  }}
                />
              </div>
            )}

            {form.geoMode === 'radius' && (
              <div className="bbem-range-grid">
                <div className="bbem-range-pair">
                  <div className="bbem-range-label">Address</div>
                  <input
                    className="bbem-input"
                    value={form.geo_radius_address}
                    onChange={e => set('geo_radius_address', e.target.value)}
                    placeholder="Enter address"
                  />
                </div>
                <div className="bbem-range-pair">
                  <div className="bbem-range-label">Radius (miles)</div>
                  <input
                    className="bbem-input"
                    type="number"
                    value={form.geo_radius_miles}
                    onChange={e => set('geo_radius_miles', e.target.value)}
                    placeholder="25"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Asset Class */}
          <div className="bbem-sec">
            <div className="bbem-sec-label">Asset Class</div>
            <div className="bbem-asset-grid">
              {ASSET_CLASSES.map(cls => (
                <button
                  key={cls.id}
                  className={`bbem-asset-btn${form.asset_class === cls.id ? ' active' : ''}`}
                  onClick={() => { set('asset_class', cls.id); set('asset_use_codes', []); }}
                >
                  {cls.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-types */}
          {currentAssetClass && (
            <div className="bbem-sec">
              <div className="bbem-sec-label">Sub-Types</div>
              <div className="bbem-check-grid">
                {currentAssetClass.subtypes.map(st => {
                  const checked = form.asset_use_codes.includes(st.code);
                  return (
                    <div
                      key={st.code}
                      className={`bbem-check-item${checked ? ' checked' : ''}`}
                      onClick={() => set('asset_use_codes', toggleArr(form.asset_use_codes, st.code))}
                    >
                      <div className="bbem-check-dot">{checked && <I.Check size={9}/>}</div>
                      {st.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Criteria */}
          <div className="bbem-sec">
            <div className="bbem-sec-label">Criteria</div>
            <div className="bbem-criteria-grid">
              <div className="bbem-criteria-item">
                <div className="bbem-criteria-title">Sq Ft</div>
                <div className="bbem-range-grid">
                  <div className="bbem-range-pair">
                    <div className="bbem-range-label">Min</div>
                    <input className="bbem-input" type="number" value={form.sf_min} onChange={e => set('sf_min', e.target.value)} placeholder="—"/>
                  </div>
                  <div className="bbem-range-pair">
                    <div className="bbem-range-label">Max</div>
                    <input className="bbem-input" type="number" value={form.sf_max} onChange={e => set('sf_max', e.target.value)} placeholder="—"/>
                  </div>
                </div>
              </div>
              <div className="bbem-criteria-item">
                <div className="bbem-criteria-title">Acres</div>
                <div className="bbem-range-grid">
                  <div className="bbem-range-pair">
                    <div className="bbem-range-label">Min</div>
                    <input className="bbem-input" type="number" value={form.acres_min} onChange={e => set('acres_min', e.target.value)} placeholder="—"/>
                  </div>
                  <div className="bbem-range-pair">
                    <div className="bbem-range-label">Max</div>
                    <input className="bbem-input" type="number" value={form.acres_max} onChange={e => set('acres_max', e.target.value)} placeholder="—"/>
                  </div>
                </div>
              </div>
              <div className="bbem-criteria-item">
                <div className="bbem-criteria-title">Value ($)</div>
                <div className="bbem-range-grid">
                  <div className="bbem-range-pair">
                    <div className="bbem-range-label">Min</div>
                    <input className="bbem-input" type="number" value={form.value_min} onChange={e => set('value_min', e.target.value)} placeholder="—"/>
                  </div>
                  <div className="bbem-range-pair">
                    <div className="bbem-range-label">Max</div>
                    <input className="bbem-input" type="number" value={form.value_max} onChange={e => set('value_max', e.target.value)} placeholder="—"/>
                  </div>
                </div>
              </div>
              <div className="bbem-criteria-item">
                <div className="bbem-criteria-title">Year Built</div>
                <div className="bbem-range-grid">
                  <div className="bbem-range-pair">
                    <div className="bbem-range-label">Min</div>
                    <input className="bbem-input" type="number" value={form.year_built_min} onChange={e => set('year_built_min', e.target.value)} placeholder="—"/>
                  </div>
                  <div className="bbem-range-pair">
                    <div className="bbem-range-label">Max</div>
                    <input className="bbem-input" type="number" value={form.year_built_max} onChange={e => set('year_built_max', e.target.value)} placeholder="—"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ownership */}
          <div className="bbem-sec">
            <div className="bbem-sec-label">Ownership</div>
            <div className="bbem-range-grid" style={{ marginBottom: 2 }}>
              <div className="bbem-range-pair">
                <div className="bbem-range-label">Min Hold Years</div>
                <input
                  className="bbem-input"
                  type="number"
                  value={form.min_hold_yrs}
                  onChange={e => set('min_hold_yrs', e.target.value)}
                  placeholder="Any"
                />
              </div>
            </div>
            <div className="bbem-check-grid">
              {OWNER_TYPE_OPTIONS.map(opt => {
                const checked = form.owner_types.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    className={`bbem-check-item${checked ? ' checked' : ''}`}
                    onClick={() => set('owner_types', toggleArr(form.owner_types, opt.value))}
                  >
                    <div className="bbem-check-dot">{checked && <I.Check size={9}/>}</div>
                    {opt.label}
                  </div>
                );
              })}
            </div>
            <div className="bbem-toggle-row">
              <div className="bbem-toggle-text">Absentee owners only</div>
              <button
                className={`bbem-toggle${form.absentee_only ? ' on' : ''}`}
                onClick={() => set('absentee_only', !form.absentee_only)}
                aria-label="Toggle absentee only"
              />
            </div>
            <div className="bbem-toggle-row">
              <div className="bbem-toggle-text">Out-of-state owners only</div>
              <button
                className={`bbem-toggle${form.out_of_state_only ? ' on' : ''}`}
                onClick={() => set('out_of_state_only', !form.out_of_state_only)}
                aria-label="Toggle out-of-state only"
              />
            </div>
          </div>

          {/* Distress */}
          <div className="bbem-sec">
            <div className="bbem-sec-label">Distress Signals</div>
            <div className="bbem-toggle-row">
              <div className="bbem-toggle-text">Distressed properties only</div>
              <button
                className={`bbem-toggle${form.distress_only ? ' on' : ''}`}
                onClick={() => set('distress_only', !form.distress_only)}
                aria-label="Toggle distress only"
              />
            </div>
            <div className="bbem-match-row">
              {['any', 'all'].map(m => (
                <button
                  key={m}
                  className={`bbem-match-btn${form.distress_match_mode === m ? ' active' : ''}`}
                  onClick={() => set('distress_match_mode', m)}
                >
                  {m.toUpperCase()}
                </button>
              ))}
              <span className="bbem-match-hint">match</span>
            </div>
            <div className="bbem-check-grid">
              {DISTRESS_SIGNAL_OPTIONS.map(opt => {
                const checked = form.distress_signals.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    className={`bbem-check-item${checked ? ' checked' : ''}`}
                    onClick={() => set('distress_signals', toggleArr(form.distress_signals, opt.value))}
                  >
                    <div className="bbem-check-dot">{checked && <I.Check size={9}/>}</div>
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule */}
          <div className="bbem-sec">
            <div className="bbem-sec-label">Run Schedule</div>
            <div className="bbem-day-row">
              {SCHEDULE_DAYS.map(d => {
                const active = days.includes(d.abbr);
                return (
                  <button
                    key={d.abbr}
                    className={`bbem-day-btn${active ? ' active' : ''}`}
                    onClick={() => {
                      const newDays = active ? days.filter(x => x !== d.abbr) : [...days, d.abbr];
                      set('run_schedule', { ...form.run_schedule, days: newDays });
                    }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bbem-foot">
          {confirmDelete ? (
            <div className="bbem-confirm-zone">
              <div className="bbem-confirm-msg">Delete this buy box permanently?</div>
              <button className="bbem-btn-confirm-delete" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button className="bbem-btn-cancel" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          ) : (
            <>
              <button className="bbem-btn-delete" onClick={() => setConfirmDelete(true)}>Delete</button>
              <div className="bbem-foot-right">
                <button className="bbem-btn-cancel" onClick={onClose}>Cancel</button>
                <button className="bbem-btn-save" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
