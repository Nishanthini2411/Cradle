import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ReactConfetti from 'react-confetti'
import StarField from './components/StarField'
import { ceremonyContent } from './content'

const youtubeEmbedUrl = `https://www.youtube.com/embed/${ceremonyContent.youtubeVideoId}?autoplay=1&rel=0`

const stageMotion = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
}

const App = () => {
  const [stage, setStage] = useState(0)
  const [windowSize, setWindowSize] = useState({ width: 1280, height: 720 })
  const [revealedLetters, setRevealedLetters] = useState(0)
  const [showRevealConfetti, setShowRevealConfetti] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showFinalHearts, setShowFinalHearts] = useState(false)

  const babyNameLetters = useMemo(() => ceremonyContent.babyName.split(''), [])

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleStart = () => {
    setStage(1)
  }

  const handleContinue = () => {
    setStage((current) => current + 1)
  }

  const handleBack = () => {
    setStage((current) => (current === 6 ? 4 : Math.max(0, current - 1)))
  }

  const blessingVariants = [
    { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
    { initial: { opacity: 0, scale: 0.6 }, animate: { opacity: 1, scale: 1 } },
    { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
    { initial: { opacity: 0, y: -20, scale: 0.85 }, animate: { opacity: 1, y: 0, scale: 1 } },
  ]

  useEffect(() => {
    if (stage !== 4) return

    setShowVideo(false)
    const introTimer = window.setTimeout(() => setShowVideo(true), 2500)

    return () => window.clearTimeout(introTimer)
  }, [stage])

  useEffect(() => {
    if (stage !== 5) {
      setRevealedLetters(0)
      return
    }

    setShowRevealConfetti(true)
    const letterInterval = window.setInterval(() => {
      setRevealedLetters((current) => {
        if (current >= babyNameLetters.length) {
          window.clearInterval(letterInterval)
          return current
        }
        return current + 1
      })
    }, 110)

    const revealTimer = window.setTimeout(() => {
      setStage(6)
    }, 8500)

    return () => {
      window.clearInterval(letterInterval)
      window.clearTimeout(revealTimer)
    }
  }, [stage, babyNameLetters.length])

  useEffect(() => {
    if (stage === 6) {
      const finalTimer = window.setTimeout(() => {
        setShowFinalHearts(true)
      }, 300)
      return () => window.clearTimeout(finalTimer)
    }
    setShowFinalHearts(false)
  }, [stage])

  const heroTitle = ceremonyContent.heroTitle
  const heroSubtitle = ceremonyContent.heroSubtitle
  const parentMessage = ceremonyContent.parentMessage
  const birthMessage = ceremonyContent.birthMessage
  const revealPrompt = ceremonyContent.revealPrompt
  const revealButton = ceremonyContent.revealButton

  return (
    <div className="ceremony-shell">
      <StarField />
      <div className="soft-glow" aria-hidden="true" />

      {stage > 0 && (
        <button type="button" className="back-button" onClick={handleBack}>
          <span aria-hidden="true">&larr;</span> Back
        </button>
      )}

      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.section
            key="welcome"
            className="stage page-hero"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stageMotion}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="hero-copy">
              <p className="hero-kicker">A Heavenly Naming Ceremony</p>
              <h1>{heroTitle}</h1>
              <p>{heroSubtitle}</p>
              <button type="button" className="button button-primary" onClick={handleStart}>
                {ceremonyContent.startButton}
              </button>
            </div>
          </motion.section>
        )}

        {stage === 1 && (
          <motion.section
            key="parents"
            className="stage stage-panel"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stageMotion}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="stage-header">
              <span className="stage-label">Parents’ Blessing</span>
              <h2>Our Family’s Warm Embrace</h2>
            </div>
            <div className="parents-grid">
              <div className="detail-block detail-gold parent-tile">
                <img className="parent-icon" src={`${import.meta.env.BASE_URL}father-with-baby.png`} alt="Father holding his baby" />
                <strong>{ceremonyContent.fatherName}</strong>
              </div>
              <div className="detail-block detail-gold parent-tile">
                <img className="parent-icon" src={`${import.meta.env.BASE_URL}mother-with-baby.png`} alt="Mother holding her baby" />
                <strong>{ceremonyContent.motherName}</strong>
              </div>
            </div>
            <p className="stage-message">{parentMessage}</p>
            <button type="button" className="button button-secondary" onClick={handleContinue}>
              Continue
            </button>
          </motion.section>
        )}

        {stage === 2 && (
          <motion.section
            key="birth"
            className="stage stage-panel stage-birth"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stageMotion}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="stage-header">
              <span className="stage-label">First Glimpse</span>
              <h2>Arrival of the Miracle</h2>
            </div>
            <div className="birth-details">
              <div>
                <span>Date of Birth</span>
                <strong>{ceremonyContent.birthDetails.date}</strong>
              </div>
              <div>
                <span>Time of Birth</span>
                <strong>{ceremonyContent.birthDetails.time}</strong>
              </div>
              <div>
                <span>Place of Birth</span>
                <strong>{ceremonyContent.birthDetails.place}</strong>
              </div>
            </div>
            <p className="stage-message">{birthMessage}</p>
            <button type="button" className="button button-secondary" onClick={handleContinue}>
              Continue
            </button>
          </motion.section>
        )}

        {stage === 3 && (
          <motion.section
            key="blessing"
            className="stage stage-panel stage-blessing"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stageMotion}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="stage-header stage-header-dark">
              <span className="stage-label stage-label-light">God’s Blessing</span>
            </div>
            <div className="blessing-list">
              {ceremonyContent.blessings.map((blessing, index) => (
                <motion.p
                  key={blessing}
                  className="blessing-line"
                  initial={blessingVariants[index].initial}
                  animate={blessingVariants[index].animate}
                  transition={{ duration: 0.75, delay: index * 0.35, ease: 'easeOut' }}
                >
                  {blessing}
                </motion.p>
              ))}
            </div>
            <p className="stage-message stage-message-soft">{revealPrompt}</p>
            <button type="button" className="button button-primary" onClick={handleContinue}>
              {revealButton}
            </button>
          </motion.section>
        )}

        {stage === 4 && (
          <motion.section
            key="video"
            className="stage stage-video"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stageMotion}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="video-stage">
              {!showVideo && (
                <motion.div
                  className="video-intro"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <h2>Feel the blessing</h2>
                  <p>Enjoy this special journey with us.</p>
                </motion.div>
              )}
              {showVideo && (
                <iframe
                className={`video-player ${showVideo ? 'video-player--visible' : ''}`}
                  src={youtubeEmbedUrl}
                  title="Birthday celebration video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
              {showVideo && (
                <motion.div
                  className="video-next-wrap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button type="button" className="button button-primary video-next-button" onClick={() => setStage(6)}>
                    Next
                  </button>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {stage === 5 && (
          <motion.section
            key="reveal"
            className="stage stage-panel stage-reveal"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stageMotion}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="reveal-rays" aria-hidden="true" />
            <div className="stage-header">
              <span className="stage-label">Name Reveal</span>
              <h2>The Blessing Unfolds</h2>
            </div>
            <div className="reveal-card">
              <div className="crown" aria-hidden="true">👑</div>
              <div className="name-letters">
                {babyNameLetters.slice(0, revealedLetters).map((letter, index) => (
                  <motion.span key={`${letter}-${index}`} className="name-letter" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: index * 0.05 }}>
                    {letter}
                  </motion.span>
                ))}
              </div>
              <p className="reveal-subtitle">{ceremonyContent.babyName}</p>
            </div>
            <p className="stage-message stage-message-soft">{ceremonyContent.revealBlessing}</p>
          </motion.section>
        )}

        {stage === 6 && (
          <motion.section
            key="final"
            className="stage stage-panel stage-final"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stageMotion}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="stage-header">
              <span className="stage-label">Final Blessing</span>
              <h2>{ceremonyContent.finalTitle}</h2>
            </div>
            <button type="button" className="final-photo" onClick={() => setStage(0)}>
              <span>{ceremonyContent.finalPhotoLabel}</span>
            </button>
            <p className="stage-message stage-message-soft">{ceremonyContent.finalSubtitle}</p>
            <div className={`floating-hearts ${showFinalHearts ? 'floating-hearts--active' : ''}`} aria-hidden="true">
              <span className="heart">❤</span>
              <span className="heart">✶</span>
              <span className="heart">✦</span>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {stage === 5 && showRevealConfetti && (
        <ReactConfetti width={windowSize.width} height={windowSize.height} numberOfPieces={120} gravity={0.2} recycle={false} />
      )}
    </div>
  )
}

export default App
