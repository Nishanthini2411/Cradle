import { useEffect, useMemo, useRef, useState } from 'react'

type StarData = {
  id: number
  top: string
  left: string
  width: string
  height: string
  opacity: number
  delay: string
  duration: string
  driftX: number
  driftY: number
}

const STAR_COUNT = 34

const randomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const createStars = (): StarData[] =>
  Array.from({ length: STAR_COUNT }).map((_, index) => {
    const size = randomValue(12, 34)
    const driftX = randomValue(24, 60) * (Math.random() < 0.5 ? -1 : 1)
    const driftY = randomValue(40, 90) * (Math.random() < 0.5 ? -1 : 1)

    return {
      id: index,
      top: `${randomValue(2, 96)}%`,
      left: `${randomValue(2, 96)}%`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: 0.7 + Math.random() * 0.25,
      delay: `${Math.random() * 4}s`,
      duration: `${7 + Math.random() * 8}s`,
      driftX,
      driftY,
    }
  })

const StarField = () => {
  const stars = useMemo(() => createStars(), [])
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [isMoving, setIsMoving] = useState(false)
  const rafRef = useRef<number | null>(null)
  const moveTimeout = useRef<number | null>(null)
  const pointerRef = useRef(pointer)

  useEffect(() => {
    const updatePointer = (x: number, y: number) => {
      pointerRef.current = { x, y }
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(() => {
          setPointer(pointerRef.current)
          rafRef.current = null
        })
      }
    }

    const activateMove = () => {
      setIsMoving(true)
      if (moveTimeout.current) {
        window.clearTimeout(moveTimeout.current)
      }
      moveTimeout.current = window.setTimeout(() => {
        setIsMoving(false)
      }, 220)
    }

    const handleMove = (event: MouseEvent) => {
      const x = ((event.clientX / window.innerWidth) - 0.5) * 2
      const y = ((event.clientY / window.innerHeight) - 0.5) * 2
      activateMove()
      updatePointer(x, y)
    }

    const handleTouch = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      const x = ((touch.clientX / window.innerWidth) - 0.5) * 2
      const y = ((touch.clientY / window.innerHeight) - 0.5) * 2
      activateMove()
      updatePointer(x, y)
    }

    const handleLeave = () => {
      updatePointer(0, 0)
      setIsMoving(false)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleTouch, { passive: true })
    window.addEventListener('mouseleave', handleLeave)
    window.addEventListener('touchend', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleTouch)
      window.removeEventListener('mouseleave', handleLeave)
      window.removeEventListener('touchend', handleLeave)
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current)
      }
      if (moveTimeout.current) {
        window.clearTimeout(moveTimeout.current)
      }
    }
  }, [])

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((star) => {
        const motionStrength = 0.2 + Math.max(Math.abs(pointer.x), Math.abs(pointer.y)) * (isMoving ? 1.2 : 0.35)
        const translateX = pointer.x * star.driftX * motionStrength
        const translateY = pointer.y * star.driftY * motionStrength

        return (
          <span
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.width,
              height: star.height,
              opacity: star.opacity,
              animationDelay: star.delay,
              animationDuration: star.duration,
              ['--star-offset-x' as string]: `${translateX}px`,
              ['--star-offset-y' as string]: `${translateY}px`,
              ['--bubble-drift-x' as string]: `${star.driftX}px`,
              ['--bubble-drift-y' as string]: `${star.driftY}px`,
              transition: 'transform 0.25s ease-out',
            }}
          />
        )
      })}
    </div>
  )
}

export default StarField
