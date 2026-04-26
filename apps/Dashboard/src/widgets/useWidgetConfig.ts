import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { WIDGET_IDS, canRoleSeeWidget } from './registry'

const LS_KEY = 'bw_widget_config'

function getDefaultConfig(role) {
  const hidden = []
  // Revenue is hidden by default for staff
  if (role === 'staff') hidden.push('revenue')
  // Filter order to only include widgets this role can see
  const order = WIDGET_IDS.filter(id => canRoleSeeWidget(id, role))
  return { order, hidden, sizes: {} }
}

// Merges any newly registered widgets (added to registry.js after a user's
// first visit) into a stored config so they appear in the dashboard.
function mergeNewWidgets(storedConfig, role) {
  const known = new Set(storedConfig.order)
  const added = WIDGET_IDS.filter(id => !known.has(id) && canRoleSeeWidget(id, role))
  if (added.length === 0) return storedConfig
  return { ...storedConfig, order: [...storedConfig.order, ...added] }
}

// Accepts userId (string) rather than the full user object so that token
// refreshes — which produce a new user object reference — don't re-fire this
// hook's effect and force WidgetCanvas into a full remount cycle.
export function useWidgetConfig(userId, role) {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load config: try Supabase first, fall back to localStorage
  useEffect(() => {
    if (!userId) { setLoading(false); return }
    async function load() {
      setLoading(true)
      try {
        // Try Supabase widget_configs table
        // TODO: migrate to org_id once schema migration is applied
        const { data } = await supabase
          .from('widget_configs')
          .select('config')
          .eq('user_id', userId)
          .maybeSingle()

        if (data?.config && data.config.order) {
          setConfig(mergeNewWidgets(data.config, role))
        } else {
          // Fall back to localStorage
          const stored = localStorage.getItem(LS_KEY + '_' + userId)
          const parsed = stored ? JSON.parse(stored) : null
          setConfig(parsed ? mergeNewWidgets(parsed, role) : getDefaultConfig(role))
        }
      } catch {
        // If Supabase fails (table not created yet), use localStorage
        const stored = localStorage.getItem(LS_KEY + '_' + userId)
        const parsed = stored ? JSON.parse(stored) : null
        setConfig(parsed ? mergeNewWidgets(parsed, role) : getDefaultConfig(role))
      }
      setLoading(false)
    }
    load()
  }, [userId, role])

  // Save config to both localStorage and Supabase
  const saveConfig = useCallback(async (newConfig) => {
    if (!userId) return
    setConfig(newConfig)
    // Always save to localStorage immediately
    localStorage.setItem(LS_KEY + '_' + userId, JSON.stringify(newConfig))
    // Best-effort Supabase sync
    try {
      await supabase
        .from('widget_configs')
        .upsert({ user_id: userId, config: newConfig, updated_at: new Date().toISOString() })
    } catch {
      // Supabase sync failed — localStorage is the fallback, no action needed
    }
  }, [userId])

  const reorder = useCallback((newOrder) => {
    const newConfig = { ...config, order: newOrder }
    saveConfig(newConfig)
  }, [config, saveConfig])

  const toggleHidden = useCallback((widgetId) => {
    const hidden = config?.hidden || []
    const newHidden = hidden.includes(widgetId)
      ? hidden.filter(id => id !== widgetId)
      : [...hidden, widgetId]
    saveConfig({ ...config, hidden: newHidden })
  }, [config, saveConfig])

  const isHidden = useCallback((widgetId) => {
    return config?.hidden?.includes(widgetId) ?? false
  }, [config])

  // Normalise stored size value: old string format → { width, height } object
  function getSizeObj(raw) {
    if (!raw) return { width: 'small', height: 'small' }
    if (typeof raw === 'string') return { width: raw, height: 'small' }
    return { width: raw.width || 'small', height: raw.height || 'small' }
  }

  const toggleWidth = useCallback((widgetId) => {
    const sizes = config?.sizes || {}
    const current = getSizeObj(sizes[widgetId])
    const next = current.width === 'small' ? 'large' : 'small'
    saveConfig({ ...config, sizes: { ...sizes, [widgetId]: { ...current, width: next } } })
  }, [config, saveConfig])

  const toggleHeight = useCallback((widgetId) => {
    const sizes = config?.sizes || {}
    const current = getSizeObj(sizes[widgetId])
    const heights = ['small', 'medium', 'large']
    const nextHeight = heights[(heights.indexOf(current.height) + 1) % heights.length]
    saveConfig({ ...config, sizes: { ...sizes, [widgetId]: { ...current, height: nextHeight } } })
  }, [config, saveConfig])

  const getWidth = useCallback((widgetId) => {
    return getSizeObj(config?.sizes?.[widgetId]).width
  }, [config])

  const getHeight = useCallback((widgetId) => {
    return getSizeObj(config?.sizes?.[widgetId]).height
  }, [config])

  // Directional setters — used by drag handles so they don't cycle, they set exactly
  const setWidth = useCallback((widgetId, width) => {
    const sizes = config?.sizes || {}
    const current = getSizeObj(sizes[widgetId])
    if (current.width === width) return           // no change
    saveConfig({ ...config, sizes: { ...sizes, [widgetId]: { ...current, width } } })
  }, [config, saveConfig])

  const setHeight = useCallback((widgetId, height) => {
    const sizes = config?.sizes || {}
    const current = getSizeObj(sizes[widgetId])
    if (current.height === height) return         // no change
    saveConfig({ ...config, sizes: { ...sizes, [widgetId]: { ...current, height } } })
  }, [config, saveConfig])

  return { config, loading, reorder, toggleHidden, isHidden, toggleWidth, toggleHeight, getWidth, getHeight, setWidth, setHeight }
}
