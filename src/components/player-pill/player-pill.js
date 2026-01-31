import React, { useState, useRef, useLayoutEffect } from 'react'
import { Pencil } from 'lucide-react';

export default function PlayerPill ({ player, playerID, myPlayerID, changeName }) {
  const [userIsEditing, setUserIsEditing] = useState(false)
  const [nameDraft, setNameDraft] = useState(player.name)
  const [pendingName, setPendingName] = useState(null)
  const pillRef = useRef(null)
  const measureRef = useRef(null)
  const snapshotRef = useRef(null)
  const pillIsMine = playerID === myPlayerID

  useLayoutEffect(() => {
    if (!pillRef.current || !snapshotRef.current) return

    const element = pillRef.current
    const { height: startHeight, width: startWidth } = snapshotRef.current
    
    // Measure target size (either from actual content or from hidden measure element)
    let endHeight, endWidth
    if (measureRef.current) {
      endHeight = measureRef.current.offsetHeight
      endWidth = measureRef.current.offsetWidth
    } else {
      endHeight = element.offsetHeight
      endWidth = element.offsetWidth
    }
    
    // Clear snapshot
    snapshotRef.current = null
    
    // Only animate if size changed
    if (startHeight === endHeight && startWidth === endWidth) {
      setPendingName(null)
      return
    }
    
    // Hide content while we set size
    const inner = element.querySelector('.joined-player-pill__inner')
    if (inner) inner.style.visibility = 'hidden'
    
    // Set to start size
    element.style.height = startHeight + 'px'
    element.style.width = startWidth + 'px'
    
    // Force reflow
    void element.offsetHeight
    
    // Show content and animate to end size
    requestAnimationFrame(() => {
      if (!pillRef.current) return
      if (inner) inner.style.visibility = 'visible'
      element.style.transition = 'height 0.3s ease, width 0.3s ease'
      element.style.height = endHeight + 'px'
      element.style.width = endWidth + 'px'
      
      // Reset after animation and clear pending name
      setTimeout(() => {
        if (pillRef.current) {
          pillRef.current.style.height = ''
          pillRef.current.style.width = ''
          pillRef.current.style.transition = ''
        }
        setPendingName(null)
      }, 300)
    })
  }, [userIsEditing])

  const handleEdit = () => {
    if (pillRef.current) {
      snapshotRef.current = {
        height: pillRef.current.offsetHeight,
        width: pillRef.current.offsetWidth
      }
    }
    setUserIsEditing(true)
  }

  const handleSave = () => {
    // Set pending name so we can measure it
    setPendingName(nameDraft)
    changeName(nameDraft)
    
    // Wait a frame so measureRef gets populated
    requestAnimationFrame(() => {
      if (pillRef.current) {
        snapshotRef.current = {
          height: pillRef.current.offsetHeight,
          width: pillRef.current.offsetWidth
        }
      }
      setUserIsEditing(false)
    })
  }

  const handleCancel = () => {
    setNameDraft(player.name)
    if (pillRef.current) {
      snapshotRef.current = {
        height: pillRef.current.offsetHeight,
        width: pillRef.current.offsetWidth
      }
    }
    setUserIsEditing(false)
  }

  console.log('playerID', playerID)
  console.log('myPlayerID', myPlayerID)
  
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        ref={pillRef}
        className={[
          'joined-player-pill',
          pillIsMine && 'joined-player-pill--me'
        ].filter(Boolean).join(' ')}
      >
        {pillIsMine && !userIsEditing && (
          <button
            className="joined-player-pill__edit-button button button--x-small button--style-c"
            onClick={handleEdit}
          >
            <Pencil size=".8em" />
          </button>
        )}
        <div className="joined-player-pill__inner">
          {!userIsEditing && player.name}
          {userIsEditing && (
            <div className="joined-player-pill__editor">
              <input
                value={nameDraft}
                onChange={(e) => {
                  setNameDraft(e.target.value)
                }}
              />
              <button
                className="button button--x-small button--style-a"
                onClick={handleSave}
              >
                û
              </button>
              <button
                className="button button--x-small button--style-c"
                onClick={handleCancel}
              >
                ?
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden element to measure target size with pending name */}
      {pendingName && (
        <div
          ref={measureRef}
          className={[
            'joined-player-pill',
            pillIsMine && 'joined-player-pill--me'
          ].filter(Boolean).join(' ')}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            pointerEvents: 'none',
            top: 0,
            left: 0
          }}
          aria-hidden="true"
        >
          <div className="joined-player-pill__inner">
            {pendingName}
          </div>
        </div>
      )}
    </div>
  )
}
