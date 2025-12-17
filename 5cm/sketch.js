let video
let particles = []
let season = "spring"
let seasonMix = 0
let ribbonPts = null
let ribbonPolys = null
let bgImg
let bgBrightness = 1
let bgSaturation = 1


let freezeMix = 0
let freezeTarget = 0
let lastFrameMs = 0
let bgmWinter
let grainG


const FREEZE_FADE_MS = 5000
const RESUME_FADE_MS = 900


let mpPose
let mpLandmarks = null
let mpInFlight = false

const FONT_BODY = "Noto Serif KR"
const FONT_TITLE = "Noto Serif KR"

const UI_MARGIN = 20
const SNOW_MELT_MS = 5000

const SENTENCE_MIN_DURATION = 5000
const CHAR_SPAWN_INTERVAL_BASE = 16

const MAX_PARTICLES = 260

const PULSE_RATIO = 0.22
const PULSE_SPEED_MIN = 0.028
const PULSE_SPEED_MAX = 0.055
const PULSE_DEPTH_MIN = 0.45

let currentSentence = ""
let currentSentenceType = "snow"
let currentCharIndex = 0
let lastSentenceChangeTime = 0
let currentSpawnSentence = ""

let currentLine = ""
let currentLineType = "snow"

let showIntro = true
let introRipples = []

let lastSeasonGestureTime = 0
let handsUpFrames = 0
let handsTogetherFrames = 0
const GESTURE_HOLD_FRAMES = 18
const GESTURE_COOLDOWN_MS = 1300

let reflectionLayer

const LAYOUT = {
  grid: 8,
  clampS: { min: 0.78, max: 1.2 },
  margins: { left: 0.1, right: 0.08 },
  rightShift: 90,
  gutter: 36,
  colWMax: 380,
  colWRatio: 0.26,
  overlayAlpha: 214,
  hairlineAlpha: 26,
  distanceMaxW: 700,
  introShiftY: 26,
  hintDividerAlpha: 18,
  gapBetweenDistanceAndSeason: 26
}

const TYPE = {
  title: { size: 52, leadMult: 0.95, tracking: 0.08, weight: "bold" },
  deck: { size: 15.6, leadMult: 1.42, tracking: 0.22, weight: "normal" },
  sub: { size: 16.5, leadMult: 1.35, tracking: 0.12, weight: "bold" },
  seasonTitle: { size: 15, leadMult: 1.25, tracking: 0.08, weight: "bold" },
  body: { size: 14, leadMult: 1.36, tracking: 0.35, weight: "normal" },
  small: { size: 13, leadMult: 1.42, tracking: 0.25, weight: "normal" },
  list: { size: 11.5, leadMult: 1.55, tracking: 0.18, weight: "normal" },
  line: { size: 16, leadPx: 20, tracking: 0.3, weight: "normal" }
}

const winterDesc =
  "겨울 모드에서는 텍스트가 눈송이처럼 천천히 떨어집니다.\n" +
  "손에 닿는 순간 잠시 번져 오르듯 커졌다가\n" +
  "부서지며 녹아 사라집니다.\n" +
  "멀어지는 마음과 쌓이는 거리감이\n" +
  "조용한 낙하와 소멸의 리듬으로 표현됩니다."

const springDesc =
  "봄 모드에서는 텍스트가 벚꽃잎처럼 가볍게 흔들리며 떨어집니다.\n" +
  "손끝을 스치면 자모로 분해되어 흩어지고,\n" +
  "두 사람이 있을 때는 손과 손 사이에 잠시 머뭅니다.\n" +
  "닿지 못한 채 스쳐 지나가는 순간들과\n" +
  "잠깐의 만남이 한 화면 안에 공존합니다."

const distanceText =
  "이 작업에서 ‘거리’는 물리적인 간격이라기보다,\n" +
  "가까워지고 싶은 마음과 끝내 남는 여백 사이의 리듬입니다.\n\n" +
  "〈초속 5센티미터〉에서 계절은 ‘감정의 속도’를 결정합니다.\n" +
  "겨울은 말이 늦어지고, 마음이 제자리에서 얼어붙는 시간입니다.\n" +
  "보내지 못한 메시지와 미뤄진 약속은 눈처럼 쌓여 시야를 흐리고,\n" +
  "닿기 전에 이미 늦어버린 문장들이 손끝에서 번졌다가 사라집니다.\n\n" +
  "반대로 봄은 마음이 다시 움직이려는 순간의 불안정함입니다.\n" +
  "손을 뻗을수록 타이밍은 비껴가고,\n" +
  "스쳐 지나간 찰나가 오히려 가장 선명한 기억으로 남습니다.\n\n" +
  "이 화면에서 텍스트는 ‘관계의 속도’로 떨어집니다.\n" +
  "가까워지려는 손의 움직임과 멀어지는 문장의 움직임이 겹치며,\n" +
  "끝내 남는 미세한 간격을 눈과 벚꽃의 리듬으로 드러냅니다."

const deckText =
  "〈초속 5센티미터〉의 계절감에서 출발해, 가까워지고 싶지만 끝내 남는 ‘미세한 간격’을 손의 움직임과 타이포그래피의 속도로 번역합니다.\n" +
  "눈은 말해지지 못한 문장을, 벚꽃은 어긋난 타이밍을 닮아 화면 위에 머물다 흩어집니다."

let snowSentences = [
  "우리는 얼마나 멀어져 버린 걸까",
  "눈 내리는 밤, 너에게 닿지 않는 문자",
  "손가락 끝이 시릴 만큼 겨울이 깊어졌다",
  "시간은 흘렀는데 마음은 그 자리에 서 있었다",
  "작은 오해들이 눈처럼 쌓여만 갔다",
  "돌아갈 수 없는 계절을 아직 붙잡고 있었다",
  "너와 나 사이에 눈발만 빽빽하게 흩날렸다",
  "기억은 따뜻했지만 현실은 너무 차가웠다",
  "그날의 약속은 눈 속에 묻혀 버렸다",
  "멀리서 들리는 기차 소리만이 밤을 채웠다"
]

let blossomSentences = [
  "벚꽃은 매년 피는데 우리는 어쩌다 어긋났을까",
  "너에게 닿을 듯 말 듯 손을 뻗어본다",
  "봄바람이 우리의 거리를 살짝 밀어낸다",
  "서로를 스쳐 지나가는 타이밍이 자꾸만 어긋난다",
  "너의 뒷모습만을 보면서 계절이 바뀌었다",
  "벚꽃잎처럼 우리의 말들도 허공에 흩어졌다",
  "조금만 더 빨리, 조금만 더 용기냈다면",
  "같은 하늘 아래 다른 속도로 걸어가고 있었다",
  "너를 좋아했던 봄을 나는 아직 걷고 있다",
  "닿을 수 없기에 더 선명해지는 얼굴이었다"
]

const HANGUL = {
  L: ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"],
  V: ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"],
  T: ["", "ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]
}

function decomposeHangulChar(ch) {
  const code = ch.charCodeAt(0)
  const SBase = 0xac00
  const LCount = 19
  const VCount = 21
  const TCount = 28
  const NCount = VCount * TCount
  const SCount = LCount * NCount
  if (code < SBase || code >= SBase + SCount) return [ch]
  const SIndex = code - SBase
  const LIndex = floor(SIndex / NCount)
  const VIndex = floor((SIndex % NCount) / TCount)
  const TIndex = SIndex % TCount
  const out = [HANGUL.L[LIndex], HANGUL.V[VIndex]]
  if (TIndex !== 0) out.push(HANGUL.T[TIndex])
  return out.filter(s => s && s.length > 0)
}

let motionFactor = 1
let prevMotion = new Map()
let smoothState = new Map()

const HAND_VIS = {
  glowOuter: 84,
  glowMid: 40,
  core: 16,
  outerA: 40,
  midA: 38,
  coreA: 150
}

let silG
let silW = 80
let silH = 60

let DOT_PX_BASE = 18
let DOT_R_BASE = 10.2

let THRESH = 0.46
let BLUR_PASSES = 1

const MP_MIN_VIS = 0.25

const trails = new Map()
const TRAIL_MAX = 34

const POSE_PATH = [
  28, 26, 24, 12, 14, 16, 20, 18, 16, 14, 12,
  11, 13, 15, 19, 17, 15, 13, 11,
  23, 25, 27,
  29, 31, 27,
  23,
  24,
  28, 30, 32, 28
]

let faceCenter = null
let faceW = 260
let faceTilt = 0

const FACE_SMOOTH = 0.18
const FACEW_SMOOTH = 0.18
const TILT_SMOOTH = 0.18

const WRIST_HOLD_MS = 220
const WRIST_REAPPEAR_BLEND = 0.22
const WRIST_MIN_VIS = 0.25

const wristState = new Map()

function initMediaPipe() {
  mpPose = new Pose({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
  })

  mpPose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
    enableSegmentation: false
  })

  mpPose.onResults((r) => {
    mpLandmarks = r.poseLandmarks || null
  })
}

function pumpMediaPipe() {
  if (!mpPose || !video || !video.elt) return
  if (video.elt.readyState < 2) return
  if (mpInFlight) return
  mpInFlight = true
  mpPose.send({ image: video.elt }).finally(() => (mpInFlight = false))
}

function mpOK(p) {
  if (!p) return false
  const v = p.visibility == null ? 1 : p.visibility
  return v > MP_MIN_VIS
}

function mpToCanvas(p) {
  return { x: (1 - p.x) * width, y: p.y * height, v: p.visibility == null ? 1 : p.visibility }
}

function getHandsFromMP() {
  const hands = []
  if (!mpLandmarks) return hands
  const lw = mpLandmarks[15]
  const rw = mpLandmarks[16]
  if (mpOK(lw)) {
    const pos = mpToCanvas(lw)
    hands.push({ x: pos.x, y: pos.y, part: "leftWrist", person: 0 })
  }
  if (mpOK(rw)) {
    const pos = mpToCanvas(rw)
    hands.push({ x: pos.x, y: pos.y, part: "rightWrist", person: 0 })
  }
  return hands
}

function getAllMPPoints() {
  if (!mpLandmarks) return null
  const out = new Array(33).fill(null)
  let good = 0
  for (let i = 0; i < 33; i++) {
    const p = mpLandmarks[i]
    if (!mpOK(p)) continue
    out[i] = mpToCanvas(p)
    good++
  }
  if (good < 6) return null
  return out
}

function hasPersonMP() {
  if (!mpLandmarks) return false
  let good = 0
  for (let i = 0; i < 33; i++) if (mpOK(mpLandmarks[i])) good++
  return good >= 6
}

function setup() {
  const c = createCanvas(windowWidth, windowHeight)
  c.elt.style.position = "fixed"
  c.elt.style.left = "0"
  c.elt.style.top = "0"
  c.elt.style.zIndex = "1"

  textAlign(CENTER, CENTER)
  textSize(12)
  textFont(FONT_BODY)

  video = createCapture({ video: { facingMode: "user" }, audio: false }, () => {})
  video.size(1280, 720)
  video.hide()
  video.elt.setAttribute("playsinline", "")
  video.elt.muted = true

  initMediaPipe()

  silG = createGraphics(silW, silH)
  silG.pixelDensity(1)

  reflectionLayer = createGraphics(windowWidth, windowHeight)
  reflectionLayer.clear()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  if (video) video.size(1280, 720)
    

  const old = reflectionLayer
  reflectionLayer = createGraphics(windowWidth, windowHeight)
  reflectionLayer.clear()
  if (old) reflectionLayer.image(old, 0, 0, width, height)
    grainG = createGraphics(windowWidth, windowHeight)
grainG.pixelDensity(1)
grainG.clear()

}

function draw() {
  pumpMediaPipe()

  const now = millis()
  const dt = lastFrameMs ? now - lastFrameMs : 16
  lastFrameMs = now

  if (showIntro) {
    clear()
    drawIntroOverlay()
    return
  }

  const personPresent = hasPersonMP()
  freezeTarget = personPresent ? 0 : 1

  const dur = freezeTarget ? FREEZE_FADE_MS : RESUME_FADE_MS
  const a = constrain(dt / max(1, dur), 0, 1)
  freezeMix = lerp(freezeMix, freezeTarget, a)

  const timeScale = 1 - freezeMix

 // ===== BG DRAW + TONE CONTROL =====
if (bgImg) {
  push()
  image(bgImg, 0, 0, width, height)
  pop()
}

// winterness: 겨울일수록 1, 봄일수록 0
const winterness = 1 - seasonMix

// 1) 배경 거의 죽이기(암전 오버레이)
push()
noStroke()
const dimAlpha = lerp(200, 240, winterness)   // 겨울 더 어둡게
fill(0, 0, 0, dimAlpha)
rect(0, 0, width, height)
pop()

// 2) 채도 죽이기(회색 베일) - 겨울이 더 강하게
push()
noStroke()
const grayA = lerp(25, 70, winterness)        // 겨울 더 무채
fill(120, 120, 120, grayA)
rect(0, 0, width, height)
pop()

// 3) 그레인(더 쎄게)
push()
noStroke()
const grainA = lerp(22, 34, winterness)       // 겨울 조금 더 거칠게
for (let i = 0; i < 9000; i++) {
  const x = random(width)
  const y = random(height)
  const a = random(grainA * 0.4, grainA)
  fill(255, 255, 255, a)
  rect(x, y, 1, 1)
}
pop()




  let hands = []
  let handColliders = []

  if (personPresent) {
    const targetMix = season === "winter" ? 0 : 1
    seasonMix = lerp(seasonMix, targetMix, 0.06)

    const handsRaw = getHandsFromMP()
    hands = smoothHands(handsRaw)
    motionFactor = lerp(motionFactor, computeHandMotionFactor(hands), 0.18)

    handColliders = buildHandColliders(hands)
    function drawGrainOverlay() {
  push()
  noStroke()

  // 🔥 핵심 파라미터
  const density = 1 / 4200   // 작을수록 많아짐 (기존보다 훨씬 빽빽)
  const passes = 2           // 몇 번 겹칠지
  const alphaBase = 42       // 기본 투명도

  const count = width * height * density

  for (let p = 0; p < passes; p++) {
    for (let i = 0; i < count; i++) {
      const x = random(width)
      const y = random(height)
      const g = random(120, 255)

      fill(g, g, g, alphaBase)
      rect(x, y, 1, 1)
    }
  }

  pop()
}



    const pts = getAllMPPoints()
    updateFaceProxy(pts)
    drawFaceRibbon()
    updateTrailsFromManyPoints(pts)
    drawBodyRibbon(pts)
    drawMinimalLandmarkHints(pts)

    ribbonPts = pts
    ribbonPolys = buildRibbonPolylines(pts)

    updateSeasonByHands(hands)

    if (timeScale > 0.02) spawnParticlesBySentence()

    drawHandsGlow(hands)
  }

  particles.sort((a, b) => (a.depth || 0.6) - (b.depth || 0.6))

  for (let p of particles) {
    if (p && typeof p.update === "function") p.update(hands, handColliders, timeScale)
    if (p && typeof p.show === "function") p.show()
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].isDead()) particles.splice(i, 1)
  }

  drawLineOverlay()
  drawSeasonLabel()
}



function drawDotSilhouetteSimple() {
  if (!video) return
  if (!hasPersonMP()) return

  silG.push()
  silG.translate(silG.width, 0)
  silG.scale(-1, 1)
  silG.image(video, 0, 0, silG.width, silG.height)
  silG.pop()

  for (let i = 0; i < BLUR_PASSES; i++) silG.filter(BLUR, 1)
  silG.loadPixels()

  const w = silG.width
  const h = silG.height
  const n = w * h

  let edgeSum = 0
  let edgeCnt = 0

  for (let x = 0; x < w; x++) {
    edgeSum += lumAt(silG.pixels, w, x, 0)
    edgeSum += lumAt(silG.pixels, w, x, h - 1)
    edgeCnt += 2
  }
  for (let y = 1; y < h - 1; y++) {
    edgeSum += lumAt(silG.pixels, w, 0, y)
    edgeSum += lumAt(silG.pixels, w, w - 1, y)
    edgeCnt += 2
  }

  const edgeAvg = edgeSum / max(1, edgeCnt)
  const wantBrightSil = edgeAvg < 0.5

  const mask = new Uint8Array(n)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const L = lumAt(silG.pixels, w, x, y)
      const v = wantBrightSil ? (L > THRESH) : (L < THRESH)
      mask[y * w + x] = v ? 1 : 0
    }
  }

  closeMask(mask, w, h)
  openMask(mask, w, h)

  const kept = keepLargestBlob(mask, w, h)

  let area = 0
  for (let i = 0; i < n; i++) area += kept[i]
  const ratio = area / n
  if (ratio < 0.08 || ratio > 0.78) return

  const m = constrain(motionFactor, 0.6, 2.35)
  const restBoost = map(m, 0.6, 2.35, 1.0, 0.62)

  const DOT_PX = DOT_PX_BASE * restBoost
  const DOT_R = DOT_R_BASE * map(m, 0.6, 2.35, 1.12, 0.96)

  const stepX = max(2, floor(DOT_PX * (w / width)))
  const stepY = max(2, floor(DOT_PX * (h / height)))

  const winterCol = color(180, 210, 255)
  const springCol = color(255, 170, 210)
  const rr = lerp(red(winterCol), red(springCol), seasonMix)
  const gg = lerp(green(winterCol), green(springCol), seasonMix)
  const bb = lerp(blue(winterCol), blue(springCol), seasonMix)

  const sx = DOT_PX
  const sy = DOT_PX

  const baseX = (width - w * sx) * 0.5
  const baseY = (height - h * sy) * 0.5

  noStroke()
  fill(rr, gg, bb, 228)

  for (let y = 0; y < h; y += stepY) {
    for (let x = 0; x < w; x += stepX) {
      if (!kept[y * w + x]) continue
      const cx = baseX + x * sx
      const cy = baseY + y * sy
      ellipse(cx, cy, DOT_R * 2, DOT_R * 2)
    }
  }
}

function lumAt(px, w, x, y) {
  const i = 4 * (y * w + x)
  const r = px[i] / 255
  const g = px[i + 1] / 255
  const b = px[i + 2] / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function dilateOnce(src, w, h) {
  const out = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0
      for (let oy = -1; oy <= 1 && !v; oy++) {
        const yy = y + oy
        if (yy < 0 || yy >= h) continue
        for (let ox = -1; ox <= 1; ox++) {
          const xx = x + ox
          if (xx < 0 || xx >= w) continue
          if (src[yy * w + xx]) {
            v = 1
            break
          }
        }
      }
      out[y * w + x] = v
    }
  }
  return out
}

function erodeOnce(src, w, h) {
  const out = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 1
      for (let oy = -1; oy <= 1 && v; oy++) {
        const yy = y + oy
        if (yy < 0 || yy >= h) {
          v = 0
          break
        }
        for (let ox = -1; ox <= 1; ox++) {
          const xx = x + ox
          if (xx < 0 || xx >= w) {
            v = 0
            break
          }
          if (!src[yy * w + xx]) {
            v = 0
            break
          }
        }
      }
      out[y * w + x] = v
    }
  }
  return out
}

function closeMask(mask, w, h) {
  let a = dilateOnce(mask, w, h)
  let b = erodeOnce(a, w, h)
  for (let i = 0; i < mask.length; i++) mask[i] = b[i]
}

function openMask(mask, w, h) {
  let a = erodeOnce(mask, w, h)
  let b = dilateOnce(a, w, h)
  for (let i = 0; i < mask.length; i++) mask[i] = b[i]
}

function keepLargestBlob(mask, w, h) {
  const n = w * h
  const seen = new Uint8Array(n)
  let bestCount = 0
  let bestIdxs = null

  const qx = new Int16Array(n)
  const qy = new Int16Array(n)

  for (let i = 0; i < n; i++) {
    if (!mask[i] || seen[i]) continue

    let head = 0
    let tail = 0

    const sx = i % w
    const sy = (i / w) | 0

    qx[tail] = sx
    qy[tail] = sy
    tail++

    seen[i] = 1

    let cnt = 0
    const idxs = []

    while (head < tail) {
      const x = qx[head]
      const y = qy[head]
      head++

      const idx = y * w + x
      idxs.push(idx)
      cnt++

      const r0x = x + 1, r0y = y
      const r1x = x - 1, r1y = y
      const r2x = x, r2y = y + 1
      const r3x = x, r3y = y - 1

      if (r0x >= 0 && r0x < w) {
        const ni = r0y * w + r0x
        if (!seen[ni] && mask[ni]) {
          seen[ni] = 1
          qx[tail] = r0x
          qy[tail] = r0y
          tail++
        }
      }
      if (r1x >= 0 && r1x < w) {
        const ni = r1y * w + r1x
        if (!seen[ni] && mask[ni]) {
          seen[ni] = 1
          qx[tail] = r1x
          qy[tail] = r1y
          tail++
        }
      }
      if (r2y >= 0 && r2y < h) {
        const ni = r2y * w + r2x
        if (!seen[ni] && mask[ni]) {
          seen[ni] = 1
          qx[tail] = r2x
          qy[tail] = r2y
          tail++
        }
      }
      if (r3y >= 0 && r3y < h) {
        const ni = r3y * w + r3x
        if (!seen[ni] && mask[ni]) {
          seen[ni] = 1
          qx[tail] = r3x
          qy[tail] = r3y
          tail++
        }
      }
    }

    if (cnt > bestCount) {
      bestCount = cnt
      bestIdxs = idxs
    }
  }

  const out = new Uint8Array(n)
  if (bestIdxs) for (let k = 0; k < bestIdxs.length; k++) out[bestIdxs[k]] = 1
  return out
}

function smoothHands(hands) {
  if (!hands || hands.length === 0) {
    smoothState.clear()
    return []
  }

  const alpha = 0.46
  const out = []

  for (let h of hands) {
    const id = h.person + ":" + h.part
    const prev = smoothState.get(id)

    let x = h.x
    let y = h.y
    if (prev) {
      x = lerp(prev.x, x, alpha)
      y = lerp(prev.y, y, alpha)
    }

    smoothState.set(id, { x, y })
    out.push({ x, y, part: h.part, person: h.person })
  }

  return out
}

function computeHandMotionFactor(hands) {
  if (!hands || hands.length === 0) {
    prevMotion.clear()
    return 1
  }

  let sum = 0
  let cnt = 0

  for (let h of hands) {
    const id = h.person + ":" + h.part
    const prev = prevMotion.get(id)
    if (prev) {
      const dx = h.x - prev.x
      const dy = h.y - prev.y
      const v = sqrt(dx * dx + dy * dy)
      sum += v
      cnt++
    }
    prevMotion.set(id, { x: h.x, y: h.y })
  }

  if (cnt === 0) return 1

  const avg = sum / cnt
  return constrain(map(avg, 0.2, 22.0, 0.65, 2.2), 0.6, 2.35)
}

function buildHandColliders(hands) {
  const col = []
  for (let h of hands) col.push({ x: h.x, y: h.y, r: 56 })
  return col
}

function drawHandsGlow(hands) {
  if (!hands || hands.length === 0) return

  const winterCol = color(180, 210, 255)
  const springCol = color(255, 170, 210)
  const rr = lerp(red(winterCol), red(springCol), seasonMix)
  const gg = lerp(green(winterCol), green(springCol), seasonMix)
  const bb = lerp(blue(winterCol), blue(springCol), seasonMix)

  push()
  noStroke()
  for (let h of hands) {
    fill(rr, gg, bb, HAND_VIS.outerA)
    ellipse(h.x, h.y, HAND_VIS.glowOuter, HAND_VIS.glowOuter)

    fill(255, 255, 255, HAND_VIS.midA)
    ellipse(h.x, h.y, HAND_VIS.glowMid, HAND_VIS.glowMid)

    fill(rr, gg, bb, HAND_VIS.coreA)
    ellipse(h.x, h.y, HAND_VIS.core, HAND_VIS.core)
  }
  pop()
}

function updateSeasonByHands(hands) {
  const now = millis()

  if (!hands || hands.length < 2) {
    handsUpFrames = 0
    handsTogetherFrames = 0
    return
  }

  const a = hands[0]
  const b = hands[1]

  const d = dist(a.x, a.y, b.x, b.y)
  const together = d < max(70, min(width, height) * 0.075)

  const upLine = height * 0.22
  const up = a.y < upLine && b.y < upLine

  handsUpFrames = up ? handsUpFrames + 1 : 0
  handsTogetherFrames = together ? handsTogetherFrames + 1 : 0

  if (handsUpFrames > GESTURE_HOLD_FRAMES && now - lastSeasonGestureTime > GESTURE_COOLDOWN_MS) {
    season = "spring"
    lastSeasonGestureTime = now
  }

  if (handsTogetherFrames > GESTURE_HOLD_FRAMES && now - lastSeasonGestureTime > GESTURE_COOLDOWN_MS) {
    season = "winter"
    lastSeasonGestureTime = now
  }
}

function keyPressed() {
  if (key === " ") season = season === "winter" ? "spring" : "winter"
}

function mousePressed() {
  if (showIntro) {
    showIntro = false
    introRipples = []
  }
}

function ensureSentence() {
  const now = millis()
  const needNew = !currentSentence || now - lastSentenceChangeTime > SENTENCE_MIN_DURATION

  if (needNew) {
    if (season === "winter") {
      currentSentence = random(snowSentences)
      currentSentenceType = "snow"
    } else {
      currentSentence = random(blossomSentences)
      currentSentenceType = "blossom"
    }

    lastSentenceChangeTime = now
    currentSpawnSentence = currentSentence.replace(/\s+/g, "")
    currentCharIndex = 0

    currentLine = currentSentence
    currentLineType = currentSentenceType
  }
}

function spawnParticlesBySentence() {
  ensureSentence()
  if (!currentSpawnSentence) return

  const interval = max(4, floor(CHAR_SPAWN_INTERVAL_BASE / constrain(motionFactor, 0.6, 2.35)))
  if (frameCount % interval !== 0) return

  let safety = 0
  let ch = null

  while (safety < currentSpawnSentence.length) {
    if (currentCharIndex >= currentSpawnSentence.length) currentCharIndex = 0
    ch = currentSpawnSentence[currentCharIndex]
    currentCharIndex++
    safety++
    if (ch && ch !== " ") break
  }

  if (!ch || ch === " ") return

  const type = currentSentenceType
  const count = type === "blossom" ? 2 : 1
  for (let i = 0; i < count; i++) particles.push(new TextParticle(type, ch))

  if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES)
}

class JamoParticle {
  constructor(jamo, x, y, baseSize, inheritDepth, initVx, initVy) {
    this.type = "jamo"
    this.text = jamo
    this.depth = inheritDepth != null ? inheritDepth : random(0.45, 1.0)
    this.layerScale = map(this.depth, 0.3, 1.0, 0.75, 1.35)
    this.baseAlpha = map(this.depth, 0.3, 1.0, 140, 255)

    this.x = x + random(-2, 2)
    this.y = y + random(-2, 2)

    this.size = baseSize * 0.9 * this.layerScale

    const ang = random(TWO_PI)
    const sp = random(2.6, 6.2) * (0.85 + 0.3 * map(this.depth, 0.3, 1.0, 0, 1))
    const rvx = cos(ang) * sp
    const rvy = sin(ang) * sp * 0.8 - random(0.8, 2.2)

    this.vx = typeof initVx === "number" ? initVx : rvx
    this.vy = typeof initVy === "number" ? initVy : rvy

    this.drag = random(0.88, 0.93)
    this.g = random(0.08, 0.14)

    this.angle = random(-0.6, 0.6)
    this.spin = random(-0.14, 0.14)

    this.alpha = 255
    this.life = 0
    this.maxLife = floor(random(22, 42))
  }

  update(a, b, c) {
  const f = typeof c === "number" ? c : (typeof a === "number" ? a : 1)

  this.life++

  this.vx *= this.drag
  this.vy *= this.drag
  this.vy += this.g * f

  this.x += this.vx * (0.92 + 0.08 * f)
  this.y += this.vy * f

  this.angle += this.spin * 0.55

  if (this.y > height + 40) this.alpha = max(0, this.alpha - 10)
  if (this.y > height + 120) this.alpha = max(0, this.alpha - 24)
}

isDead() {
  return this.alpha <= 0 || this.x < -260 || this.x > width + 260 || this.y > height + 260
}


  show() {
   
    

    push()
    translate(this.x, this.y)
    
  
    textFont(FONT_BODY)
    textStyle(NORMAL)
    textSize(this.size)
    noStroke()

    fill(110, 55, 85, effectiveAlpha * 0.18)
    text(this.text, 1.1 + this.depth, 0.9 + this.depth)

    fill(255, 205, 235, effectiveAlpha)
    text(this.text, 0, 0)
    pop()
  }
}


class TextParticle {
  constructor(type, ch) {
    this.meltStart = 0

    this.type = type
    this.text = ch
    this.seasonAtBirth = season

    this.depth = random(0.3, 1.0)
    this.layerScale = map(this.depth, 0.3, 1.0, 0.62, 1.38)
    this.baseAlpha = map(this.depth, 0.3, 1.0, 120, 255)

    this.x = random(width)
    this.y = -20

    this.baseSize = random(12, 19)
    this.size = this.baseSize * this.layerScale

    this.t = random(1000)
    this.angle = random(TWO_PI)

    const depthSpeedFactor = map(this.depth, 0.3, 1.0, 0.85, 1.25)

    if (type === "snow") {
      this.vy = random(1.15, 2.9) * depthSpeedFactor
      this.vx = random(-0.15, 0.15)

     this.spin = random(-0.004, 0.004)

    } else {
      this.vy = random(0.9, 1.6) * depthSpeedFactor
 * depthSpeedFactor
      this.vx = random(-0.62, 0.62)
      this.spin = random(-0.07, 0.07)
    }

    this.alpha = 255
    this.caught = false
    this.melting = false
    this.meltProgress = 0

    this.seed = random(100000)
    this.p1 = random(TWO_PI)
    this.p2 = random(TWO_PI)

    this.windX = 0
    this.windY = 0

    this.flutter = random(TWO_PI)
    this.flutterSpd = random(0.035, 0.065)

    this.drag = type === "blossom" ? random(0.905, 0.945) : 0.98
    this.termVy = type === "blossom" ? random(3.6, 5.1) * depthSpeedFactor : 6.0
    this.gustBias = type === "blossom" ? random(-1, 1) : 0

    const canPulse = this.depth >= PULSE_DEPTH_MIN && random(1) < PULSE_RATIO
    this.pulseOn = canPulse
    this.pulseT = random(TWO_PI)
    this.pulseSpd = random(PULSE_SPEED_MIN, PULSE_SPEED_MAX)
    this.pulseAmp = random(0.08, 0.2)

    this.splitDone = false
  }

  update(hands, handColliders, sf) {
    const f = sf == null ? 1 : sf
    if (this.type === "snow") this.updateSnow(handColliders, f)
    else this.updateBlossom(hands, f)
    if (this.pulseOn) this.pulseT += this.pulseSpd
  }

  splitIntoJamo(impulse) {
  if (this.splitDone) return
  this.splitDone = true

  const parts = decomposeHangulChar(this.text)

  const dN = this.depth != null ? this.depth : 0.7
  const base = 5.2 * (0.85 + 0.3 * map(dN, 0.3, 1.0, 0, 1))

  const nx = impulse && impulse.nx != null ? impulse.nx : random(-1, 1)
  const ny = impulse && impulse.ny != null ? impulse.ny : random(-1, -0.2)

  for (let i = 0; i < parts.length; i++) {
    const spread = random(-0.55, 0.55)
    const vx = (nx + spread) * base + random(-1.4, 1.4)
    const vy = (ny + spread) * base - random(2.8, 5.2)
    particles.push(new JamoParticle(parts[i], this.x, this.y, this.baseSize, this.depth, vx, vy))
  }

  this.alpha = 0
}

 updateSnow(handColliders, sf) {
  this.t += 0.012

  if (!this.melting) {
    this.y += this.vy * sf
    this.x += (this.vx + sin(this.t * 0.9 + this.p1) * 0.38) * (0.92 + 0.08 * sf)
    this.vx *= 0.985
    this.angle += this.spin * 0.6

    for (let c of handColliders) {
      const d = dist(this.x, this.y, c.x, c.y)
      if (d < c.r * 0.92) {
        this.melting = true
        this.meltStart = millis()
        break
      }
    }
  } else {
    const t = constrain((millis() - this.meltStart) / SNOW_MELT_MS, 0, 1)

    const swell = 1 + 0.08 * sin(t * PI)
    this.size = this.baseSize * this.layerScale * swell

    this.alpha = 255 * (1 - t)
    this.y += this.vy * 0.12 * sf
    this.x += random(-0.15, 0.15)
  }

  if (!this.melting && this.y > height + 40) this.alpha -= 14
  if (this.y > height + 120 || this.x < -120 || this.x > width + 120) this.alpha -= 22
}


  updateBlossom(hands, sf) {
    this.t += 0.028

    const n = noise(this.seed * 0.0007, this.t * 0.38, this.y * 0.0016)
    const dir = (n - 0.5) * 2.25 + this.gustBias * 0.25

    const baseWind = 0.92 + 0.76 * map(this.depth, 0.3, 1.0, 0.2, 1.0)
    const wxTarget = dir * baseWind
    const wyTarget = (noise(this.seed * 0.0009 + 7.1, this.t * 0.28, this.x * 0.0015) - 0.5) * baseWind * 0.28

    this.windX = lerp(this.windX, wxTarget, 0.065)
    this.windY = lerp(this.windY, wyTarget, 0.06)

    const g = (0.06 + 0.03 * map(this.depth, 0.3, 1.0, 0.0, 1.0)) * sf
    this.flutter += this.flutterSpd * (0.95 + 0.22 * map(this.depth, 0.3, 1.0, 0.0, 1.0))

    const lift = (sin(this.flutter + this.p1) * 0.18 + sin(this.flutter * 0.56 + this.p2) * 0.1) * 0.52
    const slip = sin(this.flutter * 0.92 + this.p2) * 0.26

    this.vx += (this.windX + slip) * 0.09 * (0.9 + 0.1 * sf)
    this.vy += g - lift * 0.16 + this.windY * 0.015

    this.vx *= this.drag
    this.vy *= this.drag

    if (this.vy > this.termVy * sf) this.vy = lerp(this.vy, this.termVy * sf, 0.1)

    if (!this.caught) {
      this.x += (this.vx + this.windX * 0.24 + sin(this.t * 1.1 + this.p2) * 0.16) * (0.9 + 0.1 * sf)
      this.y += (this.vy + lift * 0.55) * sf
    }

    const windSpin = (this.windX * 0.022 + this.vx * 0.014) * 0.85
    const flutterSpin = sin(this.flutter + this.p1) * 0.026
    this.angle += (this.spin * 0.55 + windSpin + flutterSpin) * (0.85 + 0.25 * map(this.depth, 0.3, 1.0, 0.0, 1.0))

    if (!this.splitDone) {
  let hit = null

  if (ribbonPolys) {
    hit = ribbonHitInfo(this.x, this.y, ribbonPolys, 26)
    if (hit) {
      const n = hitNormalFromSeg(hit)
      this.splitIntoJamo({ nx: n.nx, ny: n.ny })
    }
  }

 if (!this.splitDone && hands && hands.length > 0) {
  for (let h of hands) {
    const d = dist(this.x, this.y, h.x, h.y)
    if (d < 58) {
      const nx = (this.x - h.x) / max(1, d)
      const ny = (this.y - h.y) / max(1, d)
      this.splitIntoJamo({ nx, ny })
      return
      }
    }
  }
}


    this.caught = false

    if (this.caught) {
      this.vx *= 0.78
      this.vy *= 0.78
      this.alpha -= 3
      this.angle *= 0.96
      this.flutter += this.flutterSpd * 0.9
    }

    if (this.y > height + 60 || this.x < -80 || this.x > width + 80) this.alpha -= 18
    if (this.y > height + 140 || this.x < -140 || this.x > width + 140) this.alpha -= 28

    if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES)
  }

  isDead() {
    return this.alpha <= 0
  }

  show() {
    const effectiveAlpha = (this.alpha / 255) * this.baseAlpha
    if (effectiveAlpha <= 0) return

    const pulseScale = this.pulseOn ? 1 + sin(this.pulseT) * this.pulseAmp : 1

    push()
    translate(this.x, this.y)
    rotate(this.angle + freezeMix * (sin(millis() * 0.001 + this.seed) * 0.22))


    textFont(FONT_BODY)
    textStyle(NORMAL)
    textSize(this.size * pulseScale)
    noStroke()

    if (this.type === "snow" && this.melting) {
      let g = map(this.meltProgress, 0, 20, 0.5, 5)
      for (let i = 0; i < 4; i++) {
        fill(240, 245, 255, min(255, effectiveAlpha * 1.2))

        text(this.text, random(-g, g), random(-g, g))
      }
      pop()
      return
    }

    if (this.type === "snow") {
      fill(80, 90, 120, effectiveAlpha * 0.32)
      text(this.text, 1.5 * this.depth, 1.5 * this.depth)
      fill(200, 220, 255, effectiveAlpha)
      text(this.text, 0, 0)
      pop()
      return
    }

    fill(110, 55, 85, effectiveAlpha * 0.2)
    text(this.text, 1.2 + this.depth, 1.0 + this.depth)
fill(255, 195, 235, min(255, effectiveAlpha * 1.25))

    text(this.text, 0, 0)

    pop()
  }
}

function getTwoPersonCatchZoneFromHands(hands) {
  return null
}

function snap(v, grid) {
  return round(v / grid) * grid
}

function clampLeading(px, minPx, maxPx) {
  return constrain(px, minPx, maxPx)
}

function styleText(fontName, sizePx, leadPx, trackingPx, weight) {
  textFont(fontName)
  textSize(sizePx)
  if (leadPx != null) textLeading(leadPx)
  textStyle(weight === "bold" ? BOLD : NORMAL)
  return trackingPx || 0
}

function applyTrackingDraw(word, x, y, trackPx) {
  if (!trackPx || trackPx === 0) {
    text(word, x, y)
    return
  }
  let cx = x
  for (let i = 0; i < word.length; i++) {
    const ch = word[i]
    text(ch, cx, y)
    cx += textWidth(ch) + trackPx
  }
}

function applyTrackingMeasure(word, trackPx) {
  if (!trackPx || trackPx === 0) return textWidth(word)
  let w = 0
  for (let i = 0; i < word.length; i++) {
    const ch = word[i]
    w += textWidth(ch)
    if (i !== word.length - 1) w += trackPx
  }
  return w
}

function drawTrackedTextOnGraphics(gfx, str, x, y, trackPx) {
  if (!trackPx || trackPx === 0) {
    gfx.text(str, x, y)
    return
  }
  let cx = x
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    gfx.text(ch, cx, y)
    cx += gfx.textWidth(ch) + trackPx
  }
}

function getRippleOffsetAt(x, y) {
  let offset = 0
  offset += sin(frameCount * 0.02 + x * 0.003) * 0.4

  const baseAmp = 1.2
  const band = 40
  const t = frameCount * 0.08

  for (let r of introRipples) {
    const d = dist(x, y, r.x, r.y)
    const frontDist = abs(d - r.r)

    if (frontDist < band) {
      const influence = 1 - frontDist / band
      offset += sin(t + d * 0.02) * influence * baseAmp
    }
  }

  return constrain(offset, -3, 3)
}

class IntroRipple {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.r = 0
    this.maxR = random(width * 0.25, width * 0.45)
    this.alpha = random(90, 150)
    this.strokeW = random(1, 2)
  }

  update() {
    this.r += 1.4
    this.alpha -= 0.7
  }

  isDead() {
    return this.alpha <= 0 || this.r > this.maxR
  }

  draw() {
    push()
    noFill()
    strokeWeight(this.strokeW * 0.6)
    stroke(230, 240, 255, this.alpha * 1.0)
    ellipse(this.x, this.y, this.r * 2.05, this.r * 2.05)
    strokeWeight(this.strokeW)
    stroke(150, 190, 255, this.alpha * 0.6)
    ellipse(this.x, this.y, this.r * 2, this.r * 2)
    pop()
  }
}

function drawTextWithSoftReflection(str, x, y, sizePx, leadPx, colMain, colReflect, gapPx, fadeHPx, weight, trackPx, rippleStrength) {
  push()
  textAlign(LEFT, TOP)
  const t = styleText(FONT_TITLE, sizePx, leadPx, trackPx, weight)
  fill(colMain)

  const w = applyTrackingMeasure(str, t)
  const oy = getRippleOffsetAt(x + w * 0.5, y + sizePx * 0.35) * rippleStrength
  applyTrackingDraw(str, x, y + oy, t)
  pop()

  reflectionLayer.clear()
  reflectionLayer.push()
  reflectionLayer.textAlign(LEFT, TOP)
  reflectionLayer.textFont(FONT_TITLE)
  reflectionLayer.textSize(sizePx)
  reflectionLayer.textLeading(leadPx)
  reflectionLayer.textStyle(weight === "bold" ? BOLD : NORMAL)
  reflectionLayer.noStroke()
  reflectionLayer.fill(red(colReflect), green(colReflect), blue(colReflect), alpha(colReflect))

  const baseY = y + oy + sizePx + gapPx
  reflectionLayer.push()
  reflectionLayer.translate(x, baseY + sizePx * 0.95)
  reflectionLayer.scale(1, -1)
  drawTrackedTextOnGraphics(reflectionLayer, str, 0, 0, trackPx)
  reflectionLayer.pop()

  const ctx = reflectionLayer.drawingContext
  ctx.save()
  ctx.globalCompositeOperation = "destination-in"
  const g = ctx.createLinearGradient(0, baseY, 0, baseY + fadeHPx)
  g.addColorStop(0, "rgba(0,0,0,0.35)")
  g.addColorStop(0.55, "rgba(0,0,0,0.12)")
  g.addColorStop(1, "rgba(0,0,0,0)")
  ctx.fillStyle = g
  ctx.fillRect(0, baseY, reflectionLayer.width, fadeHPx)
  ctx.restore()

  reflectionLayer.pop()

  push()
  blendMode(SCREEN)
  image(reflectionLayer, 0, 0, width, height)
  blendMode(BLEND)
  pop()
}

function drawIntroOverlay() {
  const L = computeLayout()

  push()
  noStroke()
  fill(0, 0, 0, 120)
  rect(0, 0, width, height)

  if (introRipples.length < 2 && random(1) < 0.01) {
    const rx = random(width * 0.25, width * 0.75)
    const ry = random(height * 0.35, height * 0.85)
    introRipples.push(new IntroRipple(rx, ry))
  }

  for (let i = introRipples.length - 1; i >= 0; i--) {
    const r = introRipples[i]
    r.update()
    r.draw()
    if (r.isDead()) introRipples.splice(i, 1)
  }

  const s = L.s
  const grid = L.grid

  const titleStr = "초속 5CM 인터렉티브 디자인"
  const titleSize = TYPE.title.size * s
  const titleLead = clampLeading(titleSize * TYPE.title.leadMult, 44 * s, 74 * s)
  const titleTrack = TYPE.title.tracking * s

  drawTextWithSoftReflection(
    titleStr,
    L.leftMargin,
    L.titleY,
    titleSize,
    titleLead,
    color(250, 250, 252, 248),
    color(230, 242, 255, 46),
    snap(10 * s, grid),
    snap(70 * s, grid),
    TYPE.title.weight,
    titleTrack,
    0.55
  )

  const deckSize = TYPE.deck.size * s
  const deckLead = clampLeading(deckSize * TYPE.deck.leadMult, 20 * s, 28 * s)
  const deckTrack = TYPE.deck.tracking * s

  push()
  textAlign(LEFT, TOP)
  styleText(FONT_BODY, deckSize, deckLead, deckTrack, TYPE.deck.weight)
  fill(240, 244, 252, 238)
  const deckW = min(width - L.leftMargin - L.rightMargin, 1080 * s)
  drawDeckLineWrapped(deckText, L.leftMargin, L.deckY, deckW, deckLead, deckTrack)
  pop()

  stroke(255, 255, 255, LAYOUT.hairlineAlpha)
  strokeWeight(1)
  line(L.hairLineX1, L.hairLineY, L.hairLineX2, L.hairLineY)
  noStroke()

  const subStr = "손과 텍스트의 거리"
  const subSize = TYPE.sub.size * s
  const subLead = clampLeading(subSize * TYPE.sub.leadMult, 18 * s, 28 * s)
  const subTrack = TYPE.sub.tracking * s

  drawTextWithSoftReflection(
    subStr,
    L.leftMargin,
    L.seasonTopY,
    subSize,
    subLead,
    color(232, 236, 246, 238),
    color(230, 242, 255, 34),
    snap(8 * s, grid),
    snap(54 * s, grid),
    TYPE.sub.weight,
    subTrack,
    0.45
  )

  const seasonTitleSize = TYPE.seasonTitle.size * s
  const seasonTitleLead = clampLeading(seasonTitleSize * TYPE.seasonTitle.leadMult, 16 * s, 24 * s)
  const seasonTitleTrack = TYPE.seasonTitle.tracking * s

  push()
  textAlign(LEFT, TOP)
  styleText(FONT_TITLE, seasonTitleSize, seasonTitleLead, seasonTitleTrack, TYPE.seasonTitle.weight)
  fill(235, 235, 245, 240)

  const wt = "겨울"
  const bt = "봄"

  const wtw = applyTrackingMeasure(wt, seasonTitleTrack)
  const btw = applyTrackingMeasure(bt, seasonTitleTrack)

  textStyle(BOLD)
  applyTrackingDraw(
    wt,
    L.winterX,
    L.seasonTopY + getRippleOffsetAt(L.winterX + wtw * 0.5, L.seasonTopY + seasonTitleSize * 0.5) * 0.45,
    seasonTitleTrack
  )
  applyTrackingDraw(
    bt,
    L.springX,
    L.seasonTopY + getRippleOffsetAt(L.springX + btw * 0.5, L.seasonTopY + seasonTitleSize * 0.5) * 0.45,
    seasonTitleTrack
  )
  pop()

  const baseBodySize = TYPE.body.size * s
  const baseBodyLead = clampLeading(baseBodySize * TYPE.body.leadMult, 18 * s, 24 * s)
  const baseBodyTrack = TYPE.body.tracking * s

  const distanceTrack = baseBodyTrack * 0.92
  const distanceLead = baseBodyLead * 0.98

  drawWavyLineText(
    distanceText,
    L.leftMargin,
    L.distanceTextY,
    L.distanceW,
    baseBodySize,
    distanceLead,
    color(240, 244, 252, 228),
    distanceTrack,
    0.95
  )

  const descSize = TYPE.small.size * s
  const descLead = clampLeading(descSize * TYPE.small.leadMult, 18 * s, 22 * s)
  const descTrack = TYPE.small.tracking * s

  drawWavyLineText(winterDesc, L.winterX, L.seasonTextY, L.colW, descSize, descLead, color(228, 235, 248, 205), descTrack, 0.9)
  drawWavyLineText(springDesc, L.springX, L.seasonTextY, L.colW, descSize, descLead, color(228, 235, 248, 205), descTrack, 0.9)

  const listSize = TYPE.list.size * s
  const listLead = clampLeading(listSize * TYPE.list.leadMult, 16 * s, 20 * s)
  const gridStep = snap(18 * s, grid)

  let wy = snap(L.seasonTextY + 112 * s, grid)
  let sy = snap(L.seasonTextY + 112 * s, grid)

  push()
  textAlign(LEFT, TOP)
  styleText(FONT_BODY, listSize, listLead, TYPE.list.tracking * s, TYPE.list.weight)
  fill(226, 232, 246, 175)

  for (let i = 0; i < min(7, snowSentences.length); i++) {
    if (wy > L.hintLineY - 26 * s) break
    const lineStr = "· " + snowSentences[i]
    const wv = min(textWidth(lineStr), L.colW)
    const oy = getRippleOffsetAt(L.winterX + wv * 0.5, wy + listSize * 0.5) * 0.55
    text(lineStr, L.winterX, wy + oy, L.colW)
    wy += gridStep
  }

  for (let i = 0; i < min(7, blossomSentences.length); i++) {
    if (sy > L.hintLineY - 26 * s) break
    const lineStr = "· " + blossomSentences[i]
    const wv = min(textWidth(lineStr), L.colW)
    const oy = getRippleOffsetAt(L.springX + wv * 0.5, sy + listSize * 0.5) * 0.55
    text(lineStr, L.springX, sy + oy, L.colW)
    sy += gridStep
  }
  pop()

  stroke(255, 255, 255, LAYOUT.hintDividerAlpha)
  strokeWeight(1)
  line(L.hairLineX1, L.hintLineY, L.hairLineX2, L.hintLineY)
  noStroke()

  push()
  textAlign(CENTER, TOP)
  textFont(FONT_BODY)
  textStyle(NORMAL)
  textSize(12 * s)
  textLeading(14 * s)
  fill(255, 255, 255, 76)
  text("화면을 클릭하면 작품 감상이 시작됩니다", width / 2, L.hintY + getRippleOffsetAt(width / 2, L.hintY) * 0.5)
  pop()

  pop()
}

function computeLayout() {
  const s = constrain(min(width / 1200, height / 800), LAYOUT.clampS.min, LAYOUT.clampS.max)
  const grid = LAYOUT.grid * s

  const leftMargin = snap(width * LAYOUT.margins.left, grid)
  const rightMargin = snap(width * LAYOUT.margins.right, grid)
  const contentRight = width - rightMargin

  const shiftY = snap(LAYOUT.introShiftY * s, grid)

  const titleY = snap(height * 0.14, grid) + shiftY
  const topYBase = snap(height * 0.195, grid) + shiftY
  const hairLineY = snap(topYBase + 150 * s, grid)

  const deckY = snap(hairLineY - 92 * s, grid)

  const rightShift = snap(LAYOUT.rightShift * s, grid)
  const gutter = snap(LAYOUT.gutter * s, grid)

  const colW = snap(min(width * LAYOUT.colWRatio, LAYOUT.colWMax * s), grid)
  const springX0 = snap(width - width * 0.06 - colW + rightShift, grid)
  const winterX0 = snap(springX0 - colW - gutter, grid)

  const leftClamp = snap(width * 0.08, grid)
  let winterX = winterX0
  let springX = springX0
  if (winterX < leftClamp) {
    const dx = leftClamp - winterX
    winterX += dx
    springX += dx
  }

  const hairLineX1 = leftMargin
  const hairLineX2 = contentRight

  const seasonTopY = snap(hairLineY + 44 * s, grid)

  const distanceX = leftMargin
  const distanceGap = snap(LAYOUT.gapBetweenDistanceAndSeason * s, grid)
  const maxToWinter = max(240 * s, (winterX - distanceX) - distanceGap)
  const distanceW = snap(min(LAYOUT.distanceMaxW * s, maxToWinter), grid)

  const spacingAfterSub = snap(34 * s, grid)
  const distanceTextY = snap(seasonTopY + spacingAfterSub, grid)

  const seasonTextY = snap(seasonTopY + snap(26 * s, grid), grid)

  const hintY = snap(height - 70 * s, grid)
  const hintLineY = snap(hintY - 22 * s, grid)

  return {
    s,
    grid,
    leftMargin,
    rightMargin,
    contentRight,
    titleY,
    hairLineY,
    deckY,
    hairLineX1,
    hairLineX2,
    winterX,
    springX,
    colW,
    seasonTopY,
    distanceX,
    distanceW,
    distanceTextY,
    seasonTextY,
    hintY,
    hintLineY
  }
}

function drawLineOverlay() {
  if (!currentLine) return

  const w = min(width * 0.5, 560)
  const x = UI_MARGIN
  const y = UI_MARGIN

  push()
  textAlign(LEFT, TOP)
  const t = styleText(FONT_BODY, TYPE.line.size, TYPE.line.leadPx, TYPE.line.tracking, TYPE.line.weight)
  fill(currentLineType === "snow" ? color(220, 230, 255, 175) : color(255, 205, 230, 175))
  drawDeckLineWrapped(currentLine, x, y, w, TYPE.line.leadPx, t)
  pop()
}

function drawSeasonLabel() {
  push()
  const winterCol = color(180, 210, 255, 200)
  const springCol = color(255, 170, 210, 200)
  const lr = lerp(red(winterCol), red(springCol), seasonMix)
  const lg = lerp(green(winterCol), green(springCol), seasonMix)
  const lb = lerp(blue(winterCol), blue(springCol), seasonMix)
  fill(lr, lg, lb, 190)
  textFont(FONT_BODY)
  textSize(12)
  textLeading(14)
  textStyle(NORMAL)
  const txt =
    season === "winter"
      ? "winter · snow melts on hands · hold hands together to switch"
      : "spring · blossoms split into jamo · raise both hands to switch"
  text(txt, width / 2, height - 20)
  pop()
}

function drawDeckLineWrapped(str, x, y, maxW, lead, trackPx) {
  push()
  textAlign(LEFT, TOP)

  const paragraphs = str.split("\n")
  let cy = y

  for (let pi = 0; pi < paragraphs.length; pi++) {
    const para = paragraphs[pi].trim()
    if (!para) {
      cy += lead
      continue
    }

    const words = para.split(" ").filter(w => w.length > 0)
    let cx = x
    const spaceW = textWidth(" ")

    for (let i = 0; i < words.length; i++) {
      const w0 = words[i]
      const ww = applyTrackingMeasure(w0, trackPx)
      if (cx + ww > x + maxW) {
        cy += lead
        cx = x
      }
      const wcx = cx + ww * 0.5
      const wcy = cy + lead * 0.5
      const oy = getRippleOffsetAt(wcx, wcy) * 0.35
      applyTrackingDraw(w0, cx, cy + oy, trackPx)
      cx += ww + spaceW
    }

    cy += lead
  }

  pop()
}

function drawWavyLineText(str, x, y, maxW, sizePx, leadPx, col, trackPx, rippleMul = 1) {
  push()
  fill(col)
  textAlign(LEFT, TOP)

  const lines = str.split("\n")
  let cy = y

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === "") {
      cy += leadPx
      continue
    }

    const words = line.split(" ")
    let cx = x
    const spaceW = textWidth(" ")

    for (let w0 of words) {
      if (!w0) continue
      const ww = applyTrackingMeasure(w0, trackPx)
      if (cx + ww > x + maxW) {
        cy += leadPx
        cx = x
      }
      const wcx = cx + ww * 0.5
      const wcy = cy + leadPx * 0.5
      const oy = getRippleOffsetAt(wcx, wcy) * rippleMul
      applyTrackingDraw(w0, cx, cy + oy, trackPx)
      cx += ww + spaceW
    }

    cy += leadPx
  }

  pop()
}

function ensureWristState(id) {
  if (!wristState.has(id)) wristState.set(id, { x: null, y: null, lastSeen: 0 })
  return wristState.get(id)
}

function updateTrailsFromManyPoints(pts) {
  const ids = [0,11,12,13,14,15,16,23,24,25,26,27,28]
  const now = millis()

  for (const id of ids) {
    const arr = trails.get(id) || []
    let p = pts ? pts[id] : null

    if (id === 15 || id === 16) {
      const st = ensureWristState(id)
      if (p) {
        if (st.x != null) {
          p = {
            x: lerp(st.x, p.x, WRIST_REAPPEAR_BLEND),
            y: lerp(st.y, p.y, WRIST_REAPPEAR_BLEND),
            v: p.v
          }
        }
        st.x = p.x
        st.y = p.y
        st.lastSeen = now
      } else {
        if (st.x != null && (now - st.lastSeen) <= WRIST_HOLD_MS) {
          p = { x: st.x, y: st.y, v: 1 }
        }
      }
    }

    if (p) {
      const lp = arr.length ? arr[arr.length - 1] : null
      const dx = lp && lp.x != null ? p.x - lp.x : 0
      const dy = lp && lp.y != null ? p.y - lp.y : 0
      const v = lp && lp.x != null ? Math.sqrt(dx * dx + dy * dy) : 0
      arr.push({ x: p.x, y: p.y, v, t: now })
      while (arr.length > TRAIL_MAX) arr.shift()
    } else {
      arr.push({ x: null, y: null, v: 0, t: now })
      while (arr.length > TRAIL_MAX) arr.shift()
    }

    trails.set(id, arr)
  }
}

function drawWristRibbon(id, rr, gg, bb, baseW) {
  const tarr = trails.get(id)
  if (!tarr || tarr.length < 6) return

  for (let pass = 0; pass < 2; pass++) {
    beginShape()
    for (let i = 0; i < tarr.length; i++) {
      const p = tarr[i]
      if (p.x == null) continue
      const t = i / max(1, tarr.length - 1)
      const fade = (t * t) * 0.95 + 0.05
      const v = constrain(p.v, 0, 18)
      const boost = map(v, 0, 18, 0.95, 1.35)
      const w = baseW * (0.32 + 0.85 * t) * (pass === 0 ? 1.0 : 0.56) * boost
      strokeWeight(w)
      const a = (pass === 0 ? 58 : 28) * fade
      stroke(rr, gg, bb, a)
      curveVertex(p.x, p.y)
    }
    endShape()
  }
}

function drawBodyRibbon(pts) {
  if (!pts) return

  const warm = { r: 255, g: 160, b: 210 }
  const cold = { r: 165, g: 220, b: 255 }
  const rr = lerp(cold.r, warm.r, seasonMix)
  const gg = lerp(cold.g, warm.g, seasonMix)
  const bb = lerp(cold.b, warm.b, seasonMix)

  const baseW = map(constrain(motionFactor, 0.7, 2.35), 0.7, 2.35, 9.6, 5.2)

  const poly = []
  for (let i = 0; i < POSE_PATH.length; i++) {
    const idx = POSE_PATH[i]
    const p = pts[idx]
    if (!p) continue
    poly.push(p)
  }
  if (poly.length < 6) return

  push()
  drawingContext.globalCompositeOperation = "lighter"
  noFill()

  for (let pass = 0; pass < 2; pass++) {
    beginShape()
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i]
      const t = i / max(1, poly.length - 1)
      const fade = (t * t) * 0.95 + 0.05
      const w = baseW * (pass === 0 ? 1.0 : 0.56) * (0.45 + 0.85 * t)
      strokeWeight(w)
      const a = (pass === 0 ? 64 : 32) * fade
      stroke(rr, gg, bb, a)
      curveVertex(p.x, p.y)
    }
    endShape()
  }

  drawWristRibbon(15, rr, gg, bb, baseW)
  drawWristRibbon(16, rr, gg, bb, baseW)

  drawingContext.globalCompositeOperation = "source-over"
  pop()
}

function drawMinimalLandmarkHints(pts) {
  if (!pts) return

  const warm = { r: 255, g: 175, b: 220 }
  const cold = { r: 185, g: 220, b: 255 }
  const rr = lerp(cold.r, warm.r, seasonMix)
  const gg = lerp(cold.g, warm.g, seasonMix)
  const bb = lerp(cold.b, warm.b, seasonMix)

  const s = map(constrain(motionFactor, 0.7, 2.35), 0.7, 2.35, 1.0, 0.88)

  push()
  drawingContext.globalCompositeOperation = "lighter"
  noStroke()

  for (let i = 0; i < 33; i++) {
    if (i <= 10) continue
    const p = pts[i]
    if (!p) continue
    const v = p.v == null ? 1 : p.v
    const a0 = constrain(map(v, WRIST_MIN_VIS, 1.0, 8, 22), 6, 22)

    const r1 = 7.0 * s
    const r2 = 3.0 * s

    fill(rr, gg, bb, a0 * 0.55)
    ellipse(p.x, p.y, r1, r1)

    fill(255, 255, 255, a0 * 0.35)
    ellipse(p.x, p.y, r2, r2)
  }

  drawingContext.globalCompositeOperation = "source-over"
  pop()
}

function updateFaceProxy(pts) {
  if (!pts) {
    faceCenter = null
    return
  }

  const nose = pts[0]
  const le = pts[2]
  const re = pts[5]
  const leo = pts[3]
  const reo = pts[6]
  const lear = pts[7]
  const rear = pts[8]

  const candidates = []
  if (nose) candidates.push(nose)
  if (le) candidates.push(le)
  if (re) candidates.push(re)
  if (leo) candidates.push(leo)
  if (reo) candidates.push(reo)
  if (lear) candidates.push(lear)
  if (rear) candidates.push(rear)

  if (candidates.length < 2) {
    faceCenter = null
    return
  }

  let cx = 0
  let cy = 0
  for (const p of candidates) {
    cx += p.x
    cy += p.y
  }
  cx /= candidates.length
  cy /= candidates.length

  if (nose && le && re) {
    const ex = (le.x + re.x) * 0.5
    const ey = (le.y + re.y) * 0.5
    cx = lerp(cx, ex, 0.6)
    cy = lerp(cy, lerp(ey, nose.y, 0.45), 0.75)
  } else if (nose) {
    cx = lerp(cx, nose.x, 0.65)
    cy = lerp(cy, nose.y, 0.65)
  }

  let targetW = faceW
  if (lear && rear) targetW = dist(lear.x, lear.y, rear.x, rear.y) * 1.02
  else if (leo && reo) targetW = dist(leo.x, leo.y, reo.x, reo.y) * 2.45
  else if (le && re) targetW = dist(le.x, le.y, re.x, re.y) * 3.1
  else return

  targetW = constrain(targetW, 120, min(width, height) * 0.62)

  let targetTilt = 0
  if (le && re) targetTilt = atan2(re.y - le.y, re.x - le.x)
  else if (leo && reo) targetTilt = atan2(reo.y - leo.y, reo.x - leo.x)

  if (!faceCenter) faceCenter = createVector(cx, cy)
  faceCenter.x = lerp(faceCenter.x, cx, FACE_SMOOTH)
  faceCenter.y = lerp(faceCenter.y, cy, FACE_SMOOTH)

  faceW = lerp(faceW, targetW, FACEW_SMOOTH)
  faceTilt = lerp(faceTilt, targetTilt, TILT_SMOOTH)
}

function drawFaceRibbon() {
  if (!faceCenter) return

  const warm = { r: 255, g: 160, b: 210 }
  const cold = { r: 165, g: 220, b: 255 }
  const rr = lerp(cold.r, warm.r, seasonMix)
  const gg = lerp(cold.g, warm.g, seasonMix)
  const bb = lerp(cold.b, warm.b, seasonMix)

  const puff = map(constrain(motionFactor, 0.7, 2.35), 0.7, 2.35, 1.06, 1.0)
  const w = faceW * 1.02 * puff
  const h = faceW * 1.24 * puff

  const baseW = map(constrain(motionFactor, 0.7, 2.35), 0.7, 2.35, 9.0, 5.0)

  const N = 48

  push()
  translate(faceCenter.x, faceCenter.y)
  rotate(faceTilt)

  drawingContext.globalCompositeOperation = "lighter"
  noFill()

  for (let pass = 0; pass < 2; pass++) {
    beginShape()
    for (let i = 0; i <= N + 2; i++) {
      const k = i % N
      const t = k / N
      const ang = t * TWO_PI

      const x = Math.cos(ang) * (w * 0.5)
      const y = Math.sin(ang) * (h * 0.5)

      const bulge = 0.82 + 0.25 * Math.sin(ang * 2.0 + 0.6)
      const ww = baseW * (pass === 0 ? 1.0 : 0.58) * bulge
      strokeWeight(ww)

      const fade = 0.55 + 0.45 * Math.pow(Math.sin(ang * 0.5), 2)
      const a = (pass === 0 ? 62 : 30) * fade
      stroke(rr, gg, bb, a)

      curveVertex(x, y)
    }
    endShape()
  }

  drawingContext.globalCompositeOperation = "source-over"
  pop()
}

function buildRibbonPolylines(pts) {
  if (!pts) return null

  const polys = []

  if (typeof POSE_PATH !== "undefined" && Array.isArray(POSE_PATH)) {
    const body = []
    for (let i = 0; i < POSE_PATH.length; i++) {
      const p = pts[POSE_PATH[i]]
      if (p) body.push(p)
    }
    if (body.length >= 2) polys.push(body)
  }

  if (typeof trails !== "undefined" && trails instanceof Map) {
    const ids = [15, 16]
    for (const id of ids) {
      const tarr = trails.get(id)
      if (!tarr || tarr.length < 6) continue
      const poly = []
      for (let i = 0; i < tarr.length; i++) {
        const p = tarr[i]
        if (p && p.x != null) poly.push({ x: p.x, y: p.y })
      }
      if (poly.length >= 2) polys.push(poly)
    }
  }

  return polys.length ? polys : null
}

function pointSegDistSq(px, py, ax, ay, bx, by) {
  const abx = bx - ax
  const aby = by - ay
  const apx = px - ax
  const apy = py - ay
  const ab2 = abx * abx + aby * aby
  let t = ab2 > 0 ? (apx * abx + apy * aby) / ab2 : 0
  t = t < 0 ? 0 : t > 1 ? 1 : t
  const cx = ax + abx * t
  const cy = ay + aby * t
  const dx = px - cx
  const dy = py - cy
  return { d2: dx * dx + dy * dy, cx, cy, ax, ay, bx, by }
}

function ribbonHitInfo(x, y, polys, hitR) {
  if (!polys) return null
  const r2 = hitR * hitR
  let best = null

  for (let k = 0; k < polys.length; k++) {
    const poly = polys[k]
    for (let i = 0; i < poly.length - 1; i++) {
      const a = poly[i]
      const b = poly[i + 1]
      const info = pointSegDistSq(x, y, a.x, a.y, b.x, b.y)
      if (info.d2 <= r2) {
        if (!best || info.d2 < best.d2) best = info
      }
    }
  }

  return best
}

function hitNormalFromSeg(hit) {
  const sx = hit.bx - hit.ax
  const sy = hit.by - hit.ay
  const len = Math.sqrt(sx * sx + sy * sy) || 1
  let nx = -sy / len
  let ny = sx / len
  const vx = hit.cx - hit.ax
  const vy = hit.cy - hit.ay
  if (nx * vx + ny * vy < 0) {
    nx *= -1
    ny *= -1
  }
  return { nx, ny }
}
function preload() {
  bgmWinter = loadSound("winter.mp3")
  bgImg = loadImage("bg.png")

}
window.onStartMain = () => {
  userStartAudio()
  if (bgmWinter && !bgmWinter.isPlaying()) {
    bgmWinter.loop()
    bgmWinter.setVolume(0.6)
  }
}
function drawGrainOverlay() {
  if (!grainG) return

  const amt = season === "winter" ? 0.32 : 0.22
const step = season === "winter" ? 1 : 2


  grainG.clear()
  grainG.noStroke()

  for (let y = 0; y < grainG.height; y += step) {
    for (let x = 0; x < grainG.width; x += step) {
      const n = random()
      const a = 255 * amt * (0.35 + 0.65 * n)
      grainG.fill(255, a)
      grainG.rect(x, y, step, step)
    }
  }

  push()
  blendMode(OVERLAY)
  image(grainG, 0, 0)
  blendMode(BLEND)
  pop()
}




