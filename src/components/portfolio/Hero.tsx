import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Play, Pause, ArrowRight } from "lucide-react";
import { useI18n } from "../../lib/client/i18n-store";
import type { Lang } from "../../i18n";

/**
 * NOTE: paths must start with a single leading "/" and must NOT include
 * "public/" — everything inside the Astro/Vite "public" folder is served
 * from the site root. Using "/public/..." or a relative "public/..." path
 * causes 404s (and therefore a vinyl that "randomly" doesn't work) as soon
 * as you're not on the exact page the relative path was written for.
 */
const VINYL_RECORDS = [
  {
    audio: "/audio/act ii date @ 8 (feat. Drake) [remix].mp3",
    artwork: "/images/act ii date @ 8 (feat. Drake) [remix].jpg",
    title: "Act II: Date @ 8",
  },
  {
    audio: "/audio/Bryson_Tiller_-_Outside_EKANY_X_GXLDEN_BOY_EDIT_KLICKAUD.mp3",
    artwork: "/images/Bryson Tiller - Outside (EKANY X GXLDEN BOY EDIT).jpg",
    title: "Outside: EKANY X GXLDEN BOY EDIT",
  },
  {
    audio: "/audio/Oukhti - أختي.mp3",
    artwork: "/images/Oukhti - أختي.jpg",
    title: "Oukhti - أختي: Inez, Chirin",
  },
  {
    audio: "/audio/Swim Deep.mp3",
    artwork: "/images/Swim Deep - Yade Lauren.jpg",
    title: "Swim Deep: Yade Lauren, CHO, Kevin, Jordan Wayne",
  },
];

const TARGET_SPIN_SPEED = 120;
const INERTIA_FRICTION_PER_SEC = 0.1;
const FLICK_THRESHOLD = 70;
const STOP_EPSILON = 3;
const SPIN_UP_TAU = 0.8;
const PAUSE_DECAY_TAU = 0.45;

const ARM_ANGLE_REST = -24;
const ARM_ANGLE_OUTER_GROOVE = 4;
const ARM_ANGLE_INNER_GROOVE = 21;

type PlayerMode =
  | "paused"
  | "dragging"
  | "inertia"
  | "spinning";

type VinylRecord = (typeof VINYL_RECORDS)[number];

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const clamp = (
  value: number,
  min: number,
  max: number,
): number =>
  Math.min(max, Math.max(min, value));

const lerp = (
  a: number,
  b: number,
  t: number,
): number => a + (b - a) * t;

/**
 * This value is only ever used for cosmetic/non-security purposes (picking
 * a random record, generating vinyl crackle noise). We still avoid
 * Math.random() and use the Web Crypto API where available so static
 * analysis tools (and browsers without Math.random entropy guarantees)
 * are both happy, with a safe fallback for environments without
 * `crypto.getRandomValues` (e.g. very old browsers or SSR).
 */
function getRandomUnitInterval(): number {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }

  return Math.random(); // NOSONAR - Safe fallback for SSR/old browsers, cosmetic use only
}


function createCrackleBuffer(
  ctx: AudioContext,
  durationSeconds: number,
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(
    sampleRate * durationSeconds,
  );

  const buffer = ctx.createBuffer(
    1,
    length,
    sampleRate,
  );

  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    data[i] =
      (getRandomUnitInterval() * 2 - 1) *
      0.015;
  }

  let i = 0;

  while (i < length) {
    if (getRandomUnitInterval() < 0.0009) {
      const popLength =
        15 +
        Math.floor(
          getRandomUnitInterval() * 35,
        );

      const amp =
        getRandomUnitInterval() * 0.55;

      for (
        let j = 0;
        j < popLength &&
        i + j < length;
        j++
      ) {
        data[i + j] +=
          (getRandomUnitInterval() * 2 - 1) *
          amp *
          (1 - j / popLength);
      }

      i += popLength;
    } else {
      i++;
    }
  }

  return buffer;
}

/* ----------------------------------------------------------------
   Random record selector

   We use sessionStorage only in the browser after hydration.
   This prevents Astro SSR / React hydration mismatches.
---------------------------------------------------------------- */

function getRandomRecordIndex(
  previousIndex: number,
): number {
  if (VINYL_RECORDS.length <= 1) {
    return 0;
  }

  let nextIndex = Math.floor(
    getRandomUnitInterval() *
      VINYL_RECORDS.length,
  );

  if (nextIndex === previousIndex) {
    nextIndex =
      (nextIndex + 1) %
      VINYL_RECORDS.length;
  }

  return nextIndex;
}

export default function Hero({
  lang: initialLang = "en",
}: {
  lang?: Lang;
}) {
  const { t } = useI18n(initialLang);

  const vinylContainerRef =
    useRef<HTMLDivElement>(null);

  const glowRef =
    useRef<HTMLDivElement>(null);

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  /* ---------------------------------------------------------------
     Random vinyl record

     First render stays deterministic for hydration.
     After mount we switch to a random record.
  ---------------------------------------------------------------- */

  const [record, setRecord] =
    useState<VinylRecord>(
      VINYL_RECORDS[0],
    );

  /* ---------------------------------------------------------------
     General UI state
  ---------------------------------------------------------------- */

  const [
    roleIndex,
    setRoleIndex,
  ] = useState(0);

  const [
    displayed,
    setDisplayed,
  ] = useState("");

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    isPaused,
    setIsPaused,
  ] = useState(false);

  /* ---------------------------------------------------------------
     Player state
  ---------------------------------------------------------------- */

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);

  const [
    needleDown,
    setNeedleDown,
  ] = useState(false);

  const [
    trackProgress,
    setTrackProgress,
  ] = useState(0);

  const rotate =
    useMotionValue<number>(0);

  /* ---------------------------------------------------------------
     Physics refs
  ---------------------------------------------------------------- */

  const rotationRef =
    useRef(0);

  const velocityRef =
    useRef(0);

  const modeRef =
    useRef<PlayerMode>(
      "paused",
    );

  const isPlayingRef =
    useRef(false);

  const wasAudibleRef =
    useRef(false);

  const lastPointerAngleRef =
    useRef(0);

  const lastPointerTimeRef =
    useRef(0);

  const rafIdRef =
    useRef<number | null>(null);

  const lastFrameTimeRef =
    useRef<number | null>(null);

  const reducedMotionRef =
    useRef(false);

  /* ---------------------------------------------------------------
     Audio refs
  ---------------------------------------------------------------- */

  const audioCtxRef =
    useRef<AudioContext | null>(
      null,
    );

  const gainNodeRef =
    useRef<GainNode | null>(
      null,
    );

  const filterNodeRef =
    useRef<BiquadFilterNode | null>(
      null,
    );

  const analyserRef =
    useRef<AnalyserNode | null>(
      null,
    );

  const freqDataRef =
    useRef<
      Uint8Array<ArrayBuffer> | null
    >(null);

  const smoothedGlowRef =
    useRef(0);

  const crackleGainRef =
    useRef<GainNode | null>(
      null,
    );

  /* ---------------------------------------------------------------
     Pick random record after hydration
  ---------------------------------------------------------------- */

  useEffect(() => {
    const storedIndex =
      Number(
        sessionStorage.getItem(
          "vinyl-record-index",
        ),
      );

    const previousIndex =
      Number.isInteger(storedIndex) &&
      storedIndex >= 0 &&
      storedIndex <
        VINYL_RECORDS.length
        ? storedIndex
        : 0;

    const nextIndex =
      getRandomRecordIndex(
        previousIndex,
      );

    sessionStorage.setItem(
      "vinyl-record-index",
      String(nextIndex),
    );

    setRecord(
      VINYL_RECORDS[nextIndex],
    );
  }, []);

  /* ---------------------------------------------------------------
     Audio element

     Recreated whenever the selected vinyl changes.
  ---------------------------------------------------------------- */

  useEffect(() => {
    const audio =
      new Audio(record.audio);

    audio.loop = true;
    // "metadata" keeps the 3–7 MB tracks off the critical path; the browser
    // fetches the audio only when the visitor actually presses play.
    audio.preload = "metadata";
    // Improves Safari/iOS reliability when the graph falls back to plain
    // <audio> playback (see ensureAudioGraph).
    audio.crossOrigin = "anonymous";

    audioRef.current = audio;

    setTrackProgress(0);
    setIsPlaying(false);
    setIsDragging(false);
    setNeedleDown(false);

    rotationRef.current = 0;
    velocityRef.current = 0;
    modeRef.current = "paused";
    wasAudibleRef.current = false;

    rotate.set(0);

    const handleTimeUpdate =
      (): void => {
        if (
          Number.isFinite(
            audio.duration,
          ) &&
          audio.duration > 0
        ) {
          setTrackProgress(
            audio.currentTime /
              audio.duration,
          );
        }
      };

    const handleError = (): void => {
      console.warn(
        `Vinyl track failed to load: ${record.audio}`,
      );
    };

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate,
    );

    audio.addEventListener(
      "error",
      handleError,
    );

    reducedMotionRef.current =
      window
        .matchMedia(
          "(prefers-reduced-motion: reduce)",
        )
        .matches;

    return () => {
      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate,
      );

      audio.removeEventListener(
        "error",
        handleError,
      );

      audio.pause();

      audio.src = "";
    };
  }, [record, rotate]);

  /* ---------------------------------------------------------------
     Keep isPlaying ref synchronized
  ---------------------------------------------------------------- */

  useEffect(() => {
    isPlayingRef.current =
      isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    setNeedleDown(
      isPlaying &&
        !isDragging,
    );
  }, [
    isPlaying,
    isDragging,
  ]);

  /* ---------------------------------------------------------------
     Audio graph

     IMPORTANT:
     Only one AudioContext is created for the currently loaded track.
     Falls back gracefully (plain <audio> playback, no turntable FX) on
     browsers without Web Audio support instead of breaking playback.
  ---------------------------------------------------------------- */

  const ensureAudioGraph =
    useCallback((): void => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      if (audioCtxRef.current) {
        if (
          audioCtxRef.current
            .state ===
          "suspended"
        ) {
          void audioCtxRef.current.resume();
        }

        return;
      }

      const AudioContextClass =
        window.AudioContext ||
        (window as WindowWithWebkitAudio)
          .webkitAudioContext;

      if (!AudioContextClass) {
        // No Web Audio support: the <audio> element still plays normally,
        // just without the pitch/filter/crackle turntable effects.
        return;
      }

      let ctx: AudioContext;

      try {
        ctx = new AudioContextClass();
      } catch (error) {
        console.warn(
          "Could not create AudioContext, falling back to plain playback:",
          error,
        );

        return;
      }

      const source =
        ctx.createMediaElementSource(
          audio,
        );

      const filter =
        ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.value =
        14000;

      const analyser =
        ctx.createAnalyser();

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant =
        0.7;

      const gain =
        ctx.createGain();

      gain.gain.value = 1;

      source.connect(filter);
      filter.connect(analyser);
      analyser.connect(gain);
      gain.connect(
        ctx.destination,
      );

      const crackleBuffer =
        createCrackleBuffer(
          ctx,
          6,
        );

      const crackleSource =
        ctx.createBufferSource();

      crackleSource.buffer =
        crackleBuffer;

      crackleSource.loop = true;

      const crackleFilter =
        ctx.createBiquadFilter();

      crackleFilter.type =
        "bandpass";

      crackleFilter.frequency.value =
        3200;

      crackleFilter.Q.value =
        0.6;

      const crackleGain =
        ctx.createGain();

      crackleGain.gain.value =
        0;

      crackleSource.connect(
        crackleFilter,
      );

      crackleFilter.connect(
        crackleGain,
      );

      crackleGain.connect(
        ctx.destination,
      );

      crackleSource.start(0);

      audioCtxRef.current =
        ctx;

      filterNodeRef.current =
        filter;

      analyserRef.current =
        analyser;

      freqDataRef.current =
        new Uint8Array(
          new ArrayBuffer(
            analyser.frequencyBinCount,
          ),
        );

      gainNodeRef.current =
        gain;

      crackleGainRef.current =
        crackleGain;
    }, []);

  /* ---------------------------------------------------------------
     Reset / close audio graph when the record changes
  ---------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      void audioCtxRef.current
        ?.close()
        .catch(() => undefined);

      audioCtxRef.current =
        null;

      gainNodeRef.current =
        null;

      filterNodeRef.current =
        null;

      analyserRef.current =
        null;

      freqDataRef.current =
        null;

      crackleGainRef.current =
        null;
    };
  }, [record]);

  /* ---------------------------------------------------------------
     Physics loop
  ---------------------------------------------------------------- */

  useEffect(() => {
    const setEnvelope = (
      speedRatio: number,
      targetGain: number,
    ): void => {
      const gain =
        gainNodeRef.current;

      const filter =
        filterNodeRef.current;

      const crackle =
        crackleGainRef.current;

      if (!gain || !filter) {
        return;
      }

      const currentTime =
        audioCtxRef.current
          ?.currentTime ?? 0;

      const detuneDrop =
        clamp(
          1 -
            Math.abs(
              speedRatio - 1,
            ) *
              0.12,
          0.5,
          1,
        );

      const nextGain =
        clamp(
          targetGain *
            detuneDrop,
          0,
          1,
        );

      gain.gain.setTargetAtTime(
        nextGain,
        currentTime,
        0.03,
      );

      filter.frequency.setTargetAtTime(
        lerp(
          1400,
          15000,
          clamp(
            speedRatio,
            0,
            1,
          ),
        ),
        currentTime,
        0.03,
      );

      if (crackle) {
        crackle.gain.setTargetAtTime(
          0.045 *
            clamp(
              speedRatio,
              0,
              1,
            ),
          currentTime,
          0.08,
        );
      }
    };

    const updateReactiveGlow =
      (
        mode: PlayerMode,
      ): void => {
        const glow =
          glowRef.current;

        if (!glow) {
          return;
        }

        const analyser =
          analyserRef.current;

        const freqData =
          freqDataRef.current;

        let level = 0;

        if (
          analyser &&
          freqData &&
          mode !== "paused"
        ) {
          analyser.getByteFrequencyData(
            freqData,
          );

          const bandEnd =
            Math.min(
              24,
              freqData.length,
            );

          if (bandEnd > 0) {
            let sum = 0;

            for (
              let i = 0;
              i < bandEnd;
              i++
            ) {
              sum +=
                freqData[i];
            }

            level =
              sum /
              bandEnd /
              255;
          }
        }

        const smoothing =
          reducedMotionRef.current
            ? 0.08
            : 0.22;

        smoothedGlowRef.current =
          lerp(
            smoothedGlowRef.current,
            level,
            smoothing,
          );

        const base = 0.22;

        const amount =
          reducedMotionRef.current
            ? 0.25
            : 0.65;

        const intensity =
          base +
          smoothedGlowRef.current *
            amount;

        const blur =
          46 +
          smoothedGlowRef.current *
            (reducedMotionRef.current
              ? 12
              : 34);

        glow.style.opacity =
          intensity.toFixed(3);

        glow.style.filter =
          `blur(${blur.toFixed(
            1,
          )}px)`;
      };

    const tick = (
      now: number,
    ): void => {
      const last =
        lastFrameTimeRef.current ??
        now;

      const dt = clamp(
        (now - last) /
          1000,
        0,
        0.05,
      );

      lastFrameTimeRef.current =
        now;

      const mode =
        modeRef.current;

      const audio =
        audioRef.current;

      if (
        mode === "spinning"
      ) {
        velocityRef.current =
          lerp(
            velocityRef.current,
            TARGET_SPIN_SPEED,
            1 -
              Math.exp(
                -dt /
                  SPIN_UP_TAU,
              ),
          );

        rotationRef.current +=
          velocityRef.current *
          dt;

        if (
          audio &&
          wasAudibleRef.current
        ) {
          const ratio =
            clamp(
              velocityRef.current /
                TARGET_SPIN_SPEED,
              0.05,
              1,
            );

          audio.playbackRate =
            ratio;

          setEnvelope(
            ratio,
            1,
          );
        }
      } else if (
        mode === "inertia"
      ) {
        velocityRef.current *=
          Math.pow(
            INERTIA_FRICTION_PER_SEC,
            dt,
          );

        rotationRef.current +=
          velocityRef.current *
          dt;

        if (
          audio &&
          wasAudibleRef.current
        ) {
          const ratio =
            clamp(
              Math.abs(
                velocityRef.current,
              ) /
                TARGET_SPIN_SPEED,
              0,
              3,
            );

          audio.playbackRate =
            clamp(
              ratio,
              0.02,
              3,
            );

          setEnvelope(
            clamp(
              ratio,
              0,
              1,
            ),
            clamp(
              ratio,
              0,
              1,
            ),
          );
        }

        if (
          Math.abs(
            velocityRef.current,
          ) < STOP_EPSILON
        ) {
          velocityRef.current =
            0;

          if (
            isPlayingRef.current
          ) {
            modeRef.current =
              "spinning";
          } else {
            modeRef.current =
              "paused";

            audio?.pause();

            setEnvelope(
              1,
              0,
            );
          }
        }
      } else if (
        mode === "paused"
      ) {
        velocityRef.current =
          lerp(
            velocityRef.current,
            0,
            1 -
              Math.exp(
                -dt /
                  PAUSE_DECAY_TAU,
              ),
          );

        rotationRef.current +=
          velocityRef.current *
          dt;
      }

      rotate.set(
        rotationRef.current,
      );

      updateReactiveGlow(
        mode,
      );

      rafIdRef.current =
        requestAnimationFrame(
          tick,
        );
    };

    rafIdRef.current =
      requestAnimationFrame(
        tick,
      );

    return () => {
      if (
        rafIdRef.current !==
        null
      ) {
        cancelAnimationFrame(
          rafIdRef.current,
        );
      }

      rafIdRef.current = null;
    };
  }, [rotate]);

  /* ---------------------------------------------------------------
     Calculate pointer angle

     Works identically for mouse, touch and pen input because Pointer
     Events normalize clientX/clientY across input types.
  ---------------------------------------------------------------- */

  const calculateAngle = (
    clientX: number,
    clientY: number,
  ): number => {
    const vinyl =
      vinylContainerRef.current;

    if (!vinyl) {
      return 0;
    }

    const rect =
      vinyl.getBoundingClientRect();

    const centerX =
      rect.left +
      rect.width / 2;

    const centerY =
      rect.top +
      rect.height / 2;

    return (
      Math.atan2(
        clientY - centerY,
        clientX - centerX,
      ) *
      (180 / Math.PI)
    );
  };

  /* ---------------------------------------------------------------
     Scratch audio
  ---------------------------------------------------------------- */

  const applyScratchAudio = (
    delta: number,
    dt: number,
  ): void => {
    const audio =
      audioRef.current;

    if (
      !audio ||
      !wasAudibleRef.current ||
      !audioCtxRef.current
    ) {
      return;
    }

    const gain =
      gainNodeRef.current;

    const filter =
      filterNodeRef.current;

    const crackle =
      crackleGainRef.current;

    const currentTime =
      audioCtxRef.current
        .currentTime;

    if (delta >= 0) {
      const speedRatio =
        clamp(
          (delta / dt) /
            TARGET_SPIN_SPEED,
          0.15,
          4,
        );

      audio.playbackRate =
        speedRatio;

      gain?.gain.setTargetAtTime(
        clamp(
          1 -
            Math.abs(
              speedRatio - 1,
            ) *
              0.15,
          0.4,
          1,
        ),
        currentTime,
        0.02,
      );

      filter?.frequency.setTargetAtTime(
        lerp(
          1200,
          9000,
          clamp(
            speedRatio / 2,
            0,
            1,
          ),
        ),
        currentTime,
        0.02,
      );
    } else {
      audio.playbackRate =
        0.4;

      if (
        Number.isFinite(
          audio.duration,
        )
      ) {
        audio.currentTime =
          clamp(
            audio.currentTime -
              Math.abs(delta) *
                0.0025,
            0,
            audio.duration,
          );
      }

      gain?.gain.setTargetAtTime(
        0.16,
        currentTime,
        0.02,
      );

      filter?.frequency.setTargetAtTime(
        700,
        currentTime,
        0.02,
      );
    }

    crackle?.gain.setTargetAtTime(
      0.05,
      currentTime,
      0.05,
    );
  };

  /* ---------------------------------------------------------------
     Pointer down

     Fires for mouse, touch and pen alike. ensureAudioGraph() runs here
     (inside the gesture handler) so mobile browsers treat any audio
     work as user-initiated.
  ---------------------------------------------------------------- */

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
  ): void => {
    e.preventDefault();

    ensureAudioGraph();

    setIsDragging(true);

    try {
      e.currentTarget.setPointerCapture(
        e.pointerId,
      );
    } catch {
      // Some mobile browsers/WebViews can throw here; the drag still
      // works fine without explicit pointer capture.
    }

    modeRef.current =
      "dragging";

    wasAudibleRef.current =
      isPlayingRef.current;

    velocityRef.current =
      0;

    lastPointerAngleRef.current =
      calculateAngle(
        e.clientX,
        e.clientY,
      );

    lastPointerTimeRef.current =
      performance.now();
  };

  /* ---------------------------------------------------------------
     Pointer move
  ---------------------------------------------------------------- */

  const handlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
  ): void => {
    if (
      modeRef.current !==
      "dragging"
    ) {
      return;
    }

    const rawAngle =
      calculateAngle(
        e.clientX,
        e.clientY,
      );

    let delta =
      rawAngle -
      lastPointerAngleRef.current;

    if (delta > 180) {
      delta -= 360;
    }

    if (delta < -180) {
      delta += 360;
    }

    const now =
      performance.now();

    const dt =
      Math.max(
        (now -
          lastPointerTimeRef.current) /
          1000,
        1 / 240,
      );

    const instantVelocity =
      delta / dt;

    velocityRef.current =
      lerp(
        velocityRef.current,
        instantVelocity,
        0.6,
      );

    rotationRef.current +=
      delta;

    rotate.set(
      rotationRef.current,
    );

    lastPointerAngleRef.current =
      rawAngle;

    lastPointerTimeRef.current =
      now;

    applyScratchAudio(
      delta,
      dt,
    );
  };

  /* ---------------------------------------------------------------
     Pointer up / cancel / lost-capture

     Mobile browsers occasionally steal pointer capture mid-gesture
     (e.g. a tablet interpreting the touch as a scroll); handling
     onLostPointerCapture the same way as pointer up keeps the vinyl
     from getting stuck in "dragging" mode.
  ---------------------------------------------------------------- */

  const handlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
  ): void => {
    setIsDragging(false);

    try {
      if (
        e.currentTarget.hasPointerCapture(
          e.pointerId,
        )
      ) {
        e.currentTarget.releasePointerCapture(
          e.pointerId,
        );
      }
    } catch {
      // Ignore: capture may already have been released by the browser.
    }

    const flickSpeed =
      Math.abs(
        velocityRef.current,
      );

    if (
      flickSpeed >
      FLICK_THRESHOLD
    ) {
      modeRef.current =
        "inertia";
    } else if (
      isPlayingRef.current
    ) {
      modeRef.current =
        "spinning";

      const gain =
        gainNodeRef.current;

      const filter =
        filterNodeRef.current;

      const currentTime =
        audioCtxRef.current
          ?.currentTime ?? 0;

      if (audioRef.current) {
        audioRef.current.playbackRate =
          1;
      }

      gain?.gain.setTargetAtTime(
        1,
        currentTime,
        0.05,
      );

      filter?.frequency.setTargetAtTime(
        15000,
        currentTime,
        0.05,
      );
    } else {
      modeRef.current =
        "paused";
    }
  };

  /* ---------------------------------------------------------------
     Play / pause

     On iOS/mobile Safari, audio.play() is only allowed to keep the
     "user gesture" if it is called before any `await`. Awaiting the
     AudioContext resume first (as before) silently breaks playback on
     those browsers. Both promises are now kicked off in the same tick
     and only awaited together afterwards.
  ---------------------------------------------------------------- */

  const togglePlay =
    async (): Promise<void> => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      ensureAudioGraph();

      if (isPlaying) {
        setIsPlaying(false);

        audio.pause();

        if (
          modeRef.current ===
          "spinning"
        ) {
          modeRef.current =
            "paused";
        }

        return;
      }

      try {
        const playPromise =
          audio.play();

        const resumePromise =
          audioCtxRef.current?.resume();

        await Promise.all([
          playPromise,
          resumePromise,
        ]);

        wasAudibleRef.current =
          true;

        setIsPlaying(true);

        if (
          modeRef.current !==
          "dragging"
        ) {
          modeRef.current =
            "spinning";
        }
      } catch (error) {
        console.log(
          "Audio play blocked:",
          error,
        );
      }
    };

  /* ---------------------------------------------------------------
     Typewriter
  ---------------------------------------------------------------- */

  // When the language changes, restart the role typewriter cleanly.
  useEffect(() => {
    setDisplayed("");
    setIsDeleting(false);
    setIsPaused(false);
    setRoleIndex(0);
  }, [t]);

  useEffect(() => {
    const currentRole =
      t.hero.roles[roleIndex % t.hero.roles.length];

    if (isPaused) {
      const timeout =
        window.setTimeout(
          () => {
            setIsPaused(false);
            setIsDeleting(true);
          },
          1800,
        );

      return () =>
        window.clearTimeout(
          timeout,
        );
    }

    if (!isDeleting) {
      if (
        displayed.length <
        currentRole.length
      ) {
        const timeout =
          window.setTimeout(
            () => {
              setDisplayed(
                currentRole.slice(
                  0,
                  displayed.length +
                    1,
                ),
              );
            },
            60,
          );

        return () =>
          window.clearTimeout(
            timeout,
          );
      }

      setIsPaused(true);

      return;
    }

    if (displayed.length > 0) {
      const timeout =
        window.setTimeout(
          () => {
            setDisplayed(
              displayed.slice(
                0,
                -1,
              ),
            );
          },
          35,
        );

      return () =>
        window.clearTimeout(
          timeout,
        );
    }

    setIsDeleting(false);

    setRoleIndex(
      (current) =>
        (current + 1) %
        t.hero.roles.length,
    );
  }, [
    displayed,
    isDeleting,
    isPaused,
    roleIndex,
    t,
  ]);

  /* ---------------------------------------------------------------
     Tonearm position
  ---------------------------------------------------------------- */

  const armTargetAngle =
    needleDown
      ? lerp(
          ARM_ANGLE_OUTER_GROOVE,
          ARM_ANGLE_INNER_GROOVE,
          clamp(
            trackProgress,
            0,
            1,
          ),
        )
      : ARM_ANGLE_REST;

  return (
    <section
      id="home"
      className="hero-section"
    >
      {/* Grain */}
      <div
        aria-hidden="true"
        className="hero-grain"
      />

      <div className="hero-content">
        <div className="hero-copy">
          <p className="hero-availability hero-animate hero-delay-1">
            <span className="hero-status-dot"/>
            {t.hero.availability}
          </p>

          <h1 className="hero-title hero-animate hero-delay-2">
            <span className="font-name hero-name">Krishna Bihari</span>
            <span className="hero-title-line">
              <span className="hero-title-accent">{t.hero.headlinePart1}</span>{" "}
              {t.hero.headlinePart2}
            </span>
          </h1>

          <div className="hero-role hero-animate hero-delay-3">
            <span>
              {displayed}
              <span className="hero-cursor" />
            </span>
          </div>

          <p className="hero-description hero-animate hero-delay-4">
            {t.hero.description}
          </p>

          <div className="hero-actions hero-animate hero-delay-5">
            <a
              href="#projects"
              className="btn-primary"
            >
              {t.hero.viewWork}
            </a>

            <a
              href="/client"
              className="btn-secondary"
            >
              {t.hero.clientPortal}
            </a>

            <a
              href="#contact"
              className="hero-link"
            >
              {t.hero.getInTouch}
              <ArrowRight
                size={14}
                strokeWidth={1.75}
              />
            </a>
          </div>

          <div className="hero-proof hero-animate hero-delay-6">
            <div className="hero-proof__stat">
              <span className="hero-proof__value">3+</span>
              <span className="hero-proof__label">{t.hero.statsYears}</span>
            </div>
            <div className="hero-proof__stat">
              <span className="hero-proof__value">2</span>
              <span className="hero-proof__label">{t.hero.statsProjects}</span>
            </div>
            <div className="hero-proof__stat">
              <span className="hero-proof__value">4</span>
              <span className="hero-proof__label">{t.hero.statsStacks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------
          VINYL — an easter egg, not a hero component.

          Deliberately positioned outside the composition flow so it
          can never influence the layout, the fold, or the typography.
          It sits quietly in the lower-right; it comes forward only
          when the visitor notices and reaches for it.
      ---------------------------------------------------------- */}

      <div className="hero-player">
          <div className="vinyl-stage">
            {/* Glow */}
            <div
              ref={glowRef}
              aria-hidden="true"
              className="vinyl-glow"
            />

            {/* Tonearm */}
            <motion.div
              aria-hidden="true"
              className="tonearm"
              animate={{
                rotate:
                  armTargetAngle,
                y:
                  needleDown
                    ? 0
                    : -6,
              }}
              transition={{
                type: "spring",
                stiffness:
                  needleDown
                    ? 130
                    : 95,
                damping: 15,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className="tonearm-svg"
              >
                <circle
                  cx="88"
                  cy="12"
                  r="7"
                  fill="#1a1a18"
                  stroke="#3a3833"
                  strokeWidth="1.5"
                />

                <circle
                  cx="88"
                  cy="12"
                  r="2.5"
                  fill="#0a0a09"
                />

                <line
                  x1="88"
                  y1="12"
                  x2="16"
                  y2="78"
                  stroke="#2a2925"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <rect
                  x="8"
                  y="72"
                  width="16"
                  height="9"
                  rx="2"
                  fill="#1e1d1a"
                  stroke="#3a3833"
                  strokeWidth="1"
                />

                <circle
                  cx="9"
                  cy="81"
                  r="1.6"
                  fill={
                    needleDown
                      ? "var(--forest-bright, #6fae7d)"
                      : "#4a4843"
                  }
                />
              </svg>
            </motion.div>

            {/* Vinyl */}
            <div
              ref={
                vinylContainerRef
              }
              className="vinyl"
              onPointerDown={
                handlePointerDown
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                handlePointerUp
              }
              onPointerCancel={
                handlePointerUp
              }
              onLostPointerCapture={
                handlePointerUp
              }
              onContextMenu={(e) =>
                e.preventDefault()
              }
            >
              <motion.div
                className="vinyl-disc"
                style={{
                  rotate,
                }}
              >
                <div className="album-art">
                  <img
                    src={
                      record.artwork
                    }
                    alt={`${record.title} album artwork`}
                    draggable={false}
                    decoding="async"
                    fetchPriority="high"
                  />

                  <div className="vinyl-center-hole" />
                </div>
              </motion.div>
            </div>

            {/* Shimmer — a fixed specular sheen. It previously rotated with
                the pointer; it is static now, so nothing in the hero tracks
                the cursor. */}
            <div
              aria-hidden="true"
              className="vinyl-shimmer"
            />
          </div>

          {/* Player button */}
          <button
            type="button"
            className="player-button"
            onClick={() =>
              void togglePlay()
            }
            aria-label={
              isPlaying
                ? "Pause track"
                : "Play track"
            }
          >
            {isPlaying &&
            !isDragging ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
          </button>

          {/* Optional track label */}
          <span
            className="vinyl-track-title"
            aria-live="polite"
          >
            {record.title}
          </span>
      </div>

      {/* Scroll */}
      <div
        aria-hidden="true"
        className="hero-scroll"
      >
        <span>Scroll</span>

        <div className="hero-scroll-line" />
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
          /* Height-aware: short laptops compress, tall displays open up. */
          padding:
            clamp(7rem, 13vh, 11rem)
            var(--container-pad)
            clamp(7rem, 15vh, 12rem);
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.03;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        /* The composition sits on one centred axis. The measure is generous
           on large displays so the wordmark is never boxed in. */
        .hero-content {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: min(1440px, 100%);
          margin: 0 auto;
        }

        .hero-copy {
          width: 100%;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero-availability {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          margin: 0 0 clamp(2.25rem, 5.5vh, 4rem);
          color: var(--text-faint);
          font-size: 0.66rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .hero-status-dot {
          display: block;
          width: 5px;
          min-width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--verde-ink);
          box-shadow: 0 0 10px var(--verde-ink);
          animation: heroPulse 3.4s var(--ease-inout) infinite;
        }

        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        /* ── Typography: two deliberately separate layers ────────── */

        .hero-title {
          margin: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1.25rem, 3vw, 2.75rem);
        }

        /*
          Layer A — the name. Amsterdam Four, and nothing else.

          This face has extreme vertical metrics. Measured from the font
          tables, its glyphs reach 1.6152em above and 0.8428em below the
          baseline while its declared line box is 3.1919em tall. At a
          normal line-height the flourishes therefore overflow into
          whatever follows — which is precisely what used to collide
          with the Playfair headline.

          Curing that with line-height alone would need ~2.9em and inject
          a large block of dead space. Instead the line box stays tight
          (1em) and the real glyph overflow is absorbed by explicit
          padding, derived from those metrics:

            top    = 1.6152 - 2.2148 + (3.1919 - 1) / 2 = 0.4964em -> 0.53em
            bottom = 0.8428 + 2.2148 - (3.1919 - 1) / 2 - 1 = 0.9616em -> 1em

          The box now bounds the glyphs exactly: no waste, no clipping,
          and no possibility of collision. Separation from layer B is the
          flex gap above — never a negative margin.

          Sizing: "Krishna Bihari" measures 6.7783em wide, so the fluid
          size is jointly capped by viewport height as well as width.
          Height-capping keeps the hero composed on short laptop screens
          rather than merely tall ones.
        */
        .hero-name {
          display: block;
          font-family: var(--font-name);
          font-size: clamp(2.25rem, min(11.5vw, 13.5vh), 10.5rem);
          font-weight: 400;
          line-height: 1;
          letter-spacing: 0.005em;
          color: var(--text);
          text-align: center;
          max-width: 100%;
          padding: 0.53em 0.02em 1em;
          overflow: visible;
        }

        /* Layer B — the statement. Playfair, its own size, its own layer. */
        .hero-title-line {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(1.3rem, 3.1vw, 2.85rem);
          font-weight: 400;
          line-height: 1.2;
          letter-spacing: -0.015em;
          color: var(--text-soft);
          max-width: 28ch;
          text-wrap: balance;
        }

        .hero-title-accent {
          color: var(--text);
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
        }

        .hero-role {
          min-height: 1.9rem;
          margin: clamp(1.75rem, 4vh, 2.75rem) 0 clamp(1.5rem, 3.5vh, 2.25rem);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-faint);
          font-family: var(--font-mono);
          font-size: clamp(0.72rem, 1.15vw, 0.84rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .hero-cursor {
          display: inline-block;
          width: 1px;
          height: 1.05em;
          margin-left: 4px;
          vertical-align: text-bottom;
          background: var(--verde-ink);
          animation:
            heroBlink
            1.1s
            step-end
            infinite;
        }

        .hero-description {
          max-width: 46ch;
          margin: 0 0 clamp(2.25rem, 5vh, 3.5rem);
          color: var(--text-faint);
          font-size: clamp(0.95rem, 1.15vw, 1.08rem);
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: clamp(0.75rem, 1.5vw, 1.15rem);
        }

        /* The third path is a quiet text link, not a third button —
           three competing buttons is what made this read as a landing page. */
        .hero-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.8rem 0.35rem;
          font-size: 0.875rem;
          color: var(--text-faint);
          white-space: nowrap;
          transition:
            color var(--dur-base) var(--ease-out),
            gap var(--dur-base) var(--ease-out);
        }

        .hero-link:hover {
          color: var(--text);
          gap: 0.7rem;
        }

        /* ── Proof strip — real facts, no invented numbers ── */
        .hero-proof {
          display: flex;
          justify-content: center;
          gap: clamp(1.75rem, 4vw, 3.25rem);
          margin-top: clamp(2.25rem, 5vh, 3.5rem);
          padding-top: clamp(1.5rem, 3vh, 2rem);
          border-top: 1px solid var(--line-soft);
        }

        .hero-proof__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }

        .hero-proof__value {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 2.4vw, 1.9rem);
          line-height: 1;
          color: var(--text);
        }

        .hero-proof__label {
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-faint);
          text-align: center;
          max-width: 15ch;
        }

        /*
          The vinyl is an easter egg, not a hero component.

          It is absolutely positioned so it can never influence the
          composition, the fold, or the typography. It sits quietly in
          the lower-right at low opacity — barely more than an
          atmospheric detail — and only comes forward when the visitor
          notices it and reaches for it.
        */
        .hero-player {
          position: absolute;
          right: clamp(2rem, 4vw, 4.5rem);
          bottom: clamp(2.75rem, 6vh, 4rem);
          z-index: 2;
          width: clamp(120px, 11vw, 175px);
          aspect-ratio: 1;
          opacity: 0.4;
          transition: opacity var(--dur-slow) var(--ease-out);
        }

        .hero-player:hover,
        .hero-player:focus-within {
          opacity: 1;
        }

        .vinyl-stage {
          position: absolute;
          inset: 0;
        }

        /* A whisper of verde, not a glow. */
        .vinyl-glow {
          position: absolute;
          inset: -32%;
          z-index: 0;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              var(--verde-glow)
              0%,
              transparent
              62%
            );
          opacity: 0.4;
          filter: blur(58px);
          pointer-events: none;
        }

        .tonearm {
          position: absolute;
          top: -6%;
          right: -14%;
          width: 46%;
          height: 46%;
          z-index: 4;
          transform-origin: 88% 12%;
          pointer-events: none;
        }

        .tonearm-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* ── The record itself ──
           Treated as a physical object: fine groove texture, visible track
           bands, a dark run-out, and a soft specular sheen. No neon, no
           cartoon gloss — the sheen is a separate layer above this one. */
        .vinyl {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 50%;
          background-color: #0a0a09;
          background-image:
            /* fine groove texture */
            repeating-radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, 0.017) 0px,
              rgba(255, 255, 255, 0.017) 1px,
              rgba(0, 0, 0, 0.34) 1px,
              rgba(0, 0, 0, 0.34) 2.5px
            ),
            /* track bands — the visible breaks between songs */
            radial-gradient(circle, transparent 34%, rgba(255,255,255,0.03) 34.6%, transparent 35.4%),
            radial-gradient(circle, transparent 52%, rgba(255,255,255,0.024) 52.5%, transparent 53.2%),
            radial-gradient(circle, transparent 70%, rgba(255,255,255,0.018) 70.5%, transparent 71.2%),
            /* lead-in and run-out */
            radial-gradient(circle, transparent 27%, rgba(0,0,0,0.55) 28.5%, transparent 30%),
            radial-gradient(circle, transparent 86%, rgba(0,0,0,0.5) 88%, transparent 93%),
            /* base tone — lit slightly off-centre so it reads as a solid */
            radial-gradient(circle at 38% 30%, #171716 0%, #0b0b0a 54%, #060606 100%);
          box-shadow:
            0 26px 52px -20px rgba(0, 0, 0, 0.92),
            0 3px 8px rgba(0, 0, 0, 0.55),
            inset 0 1px 1px rgba(255, 255, 255, 0.045);
          cursor: grab;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }

        .vinyl:active {
          cursor: grabbing;
        }

        .vinyl-disc {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .album-art {
          position: relative;
          width: clamp(
            72px,
            10vw,
            112px
          );
          height: clamp(
            72px,
            10vw,
            112px
          );
          overflow: hidden;
          border: 4px solid #0e0e0d;
          border-radius: 50%;
          box-shadow:
            inset
            0 0 20px
            rgba(0,0,0,0.8);
        }

        .album-art img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }

        .vinyl-center-hole {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 10px;
          transform:
            translate(
              -50%,
              -50%
            );
          border: 1px solid #222;
          border-radius: 50%;
          background: #050505;
          box-shadow:
            0 1px 4px
            rgba(0,0,0,0.65);
        }

        /* Specular sheen — two soft highlights raking across the grooves,
           the way a real record catches a room light. Restrained on purpose,
           and fixed: the angle used to follow the pointer. */
        .vinyl-shimmer {
          position: absolute;
          inset: 0;
          z-index: 3;
          border-radius: 50%;
          pointer-events: none;
          background:
            conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(255, 255, 255, 0.075) 13deg,
              transparent 33deg,
              transparent 150deg,
              rgba(255, 255, 255, 0.045) 177deg,
              transparent 203deg,
              transparent 331deg,
              rgba(255, 255, 255, 0.055) 345deg,
              transparent 360deg
            );
          -webkit-mask-image:
            radial-gradient(
              circle,
              transparent 28%,
              black 34%,
              black 88%,
              transparent 94%
            );
          mask-image:
            radial-gradient(
              circle,
              transparent 28%,
              black 34%,
              black 88%,
              transparent 94%
            );
          mix-blend-mode: screen;
          opacity: 0.5;
        }

        /* Playback control — centred on the record and revealed on approach.
           Kept small so it reads as part of the object, not a UI widget. */
        .player-button {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 5;
          transform: translate(-50%, -50%);
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--glass-border);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.42);
          -webkit-backdrop-filter: blur(var(--glass-blur-1));
          backdrop-filter: blur(var(--glass-blur-1));
          color: var(--text);
          cursor: pointer;
          opacity: 0;
          transition:
            opacity var(--dur-base) var(--ease-out),
            background-color var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out);
        }

        .hero-player:hover .player-button,
        .hero-player:focus-within .player-button {
          opacity: 1;
        }

        .player-button:hover {
          background: rgba(0, 0, 0, 0.62);
          border-color: var(--glass-border-hover);
        }

        /* Touch devices never hover — surface the control permanently. */
        @media (hover: none) {
          .player-button {
            opacity: 0.72;
          }
        }

        /* Track name — a quiet caption beneath the record. */
        .vinyl-track-title {
          position: absolute;
          top: calc(100% + 0.7rem);
          left: 50%;
          transform: translateX(-50%);
          max-width: 18ch;
          color: var(--text-faint);
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          opacity: 0;
          transition: opacity var(--dur-base) var(--ease-out);
        }

        .hero-player:hover .vinyl-track-title,
        .hero-player:focus-within .vinyl-track-title {
          opacity: 1;
        }

        @media (hover: none) {
          .vinyl-track-title {
            opacity: 0.85;
          }
        }

        .hero-scroll {
          position: absolute;
          left: 50%;
          bottom: 2.25rem;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          transform:
            translateX(-50%);
          pointer-events: none;
        }

        .hero-scroll span {
          color: var(--text-faint);
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .hero-scroll-line {
          width: 1px;
          height: 52px;
          background:
            linear-gradient(
              to bottom,
              var(--line-strong),
              transparent
            );
          animation:
            heroScrollPulse
            3.2s
            var(--ease-inout)
            infinite;
        }

        .hero-animate {
          opacity: 0;
          transform:
            translateY(16px);
          filter: blur(8px);
          animation:
            heroReveal
            1100ms
            var(--ease-out)
            forwards;
        }

        .hero-delay-1 {
          animation-delay: 120ms;
        }

        .hero-delay-2 {
          animation-delay: 320ms;
        }

        .hero-delay-3 {
          animation-delay: 620ms;
        }

        .hero-delay-4 {
          animation-delay: 820ms;
        }

        .hero-delay-5 {
          animation-delay: 1020ms;
        }

        .hero-delay-6 {
          animation-delay: 1220ms;
        }

        @keyframes heroReveal {
          from {
            opacity: 0;
            transform:
              translateY(16px);
            filter: blur(8px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
            filter: blur(0);
          }
        }

        @keyframes heroBlink {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }
        }

        @keyframes heroScrollPulse {
          0%,
          100% {
            opacity: 0.3;
            transform:
              scaleY(1);
          }

          50% {
            opacity: 1;
            transform:
              scaleY(1.15);
          }
        }

        /* ── Short laptop displays ──
           Compose rather than overflow: tighten the rhythm and pull the
           wordmark back so the hero still resolves within the viewport. */
        @media (min-width: 1024px) and (max-height: 800px) {
          .hero-section {
            padding-top: clamp(6rem, 10vh, 7.5rem);
            padding-bottom: clamp(5rem, 9vh, 7rem);
          }

          .hero-name {
            font-size: clamp(2.25rem, min(10vw, 11.5vh), 7.5rem);
          }

          .hero-availability {
            margin-bottom: clamp(1.5rem, 3.5vh, 2.5rem);
          }

          .hero-role {
            margin-top: clamp(1.25rem, 2.5vh, 1.75rem);
            margin-bottom: clamp(1rem, 2vh, 1.5rem);
          }

          .hero-description {
            margin-bottom: clamp(1.5rem, 3vh, 2.25rem);
          }
        }

        @media (max-width: 767px) {
          .hero-section {
            padding-top: clamp(7rem, 14vh, 9rem);
            /* A clear band at the foot of the hero gives the record a
               quiet place to sit without crowding the copy. */
            padding-bottom: clamp(8rem, 18vh, 10rem);
          }

          .hero-title-line {
            max-width: 20ch;
          }

          .hero-description {
            max-width: 40ch;
          }

          /* Simplified, smaller, lower — present but never competing. */
          .hero-player {
            width: clamp(96px, 24vw, 128px);
            right: 1.25rem;
            bottom: 3rem;
            opacity: 0.32;
          }

          .hero-player:hover,
          .hero-player:focus-within {
            opacity: 0.85;
          }

          .hero-scroll {
            display: none;
          }
        }

        @media (max-width: 420px) {
          .hero-role {
            letter-spacing: 0.16em;
          }

          .hero-player {
            width: clamp(88px, 26vw, 110px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-animate {
            opacity: 1;
            transform: none;
            animation: none;
          }

          .hero-cursor,
          .hero-scroll-line {
            animation: none;
          }

          .player-button {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}